import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../../../../utils/api";
import { IUser } from "../../../authentication/contexts/AuthenticationContextProvider";
import { IConnection } from "../../../networking/components/Connection/Connection";
import { useWebSocket } from "../../../ws/WebSocketContextProvider";
import classes from "./LeftSidebar.module.scss";

interface ILeftSidebarProps {
  user: IUser | null;
}

type Article = {
  title: string;
  url: string;
  description?: string;
  source?: { name: string };
  publishedAt?: string;
  urlToImage?: string;   // Add this line
};



export function LeftSidebar({ user }: ILeftSidebarProps) {
  const [connections, setConnections] = useState<IConnection[]>([]);
  const [news, setNews] = useState<Article[]>([]);
  const ws = useWebSocket();
  const navigate = useNavigate();

  useEffect(() => {
    request<IConnection[]>({
      endpoint: "/api/v1/networking/connections?userId=" + user?.id,
      onSuccess: (data) => setConnections(data),
      onFailure: (error) => console.log(error),
    });
  }, [user?.id]);

  useEffect(() => {
    const subscription = ws?.subscribe(
      "/topic/users/" + user?.id + "/connections/accepted",
      (data) => {
        const connection = JSON.parse(data.body);
        setConnections((connections) => [...connections, connection]);
      }
    );
    return () => subscription?.unsubscribe();
  }, [user?.id, ws]);

  useEffect(() => {
    const subscription = ws?.subscribe(
      "/topic/users/" + user?.id + "/connections/remove",
      (data) => {
        const connection = JSON.parse(data.body);
        setConnections((connections) =>
          connections.filter((c) => c.id !== connection.id)
        );
      }
    );
    return () => subscription?.unsubscribe();
  }, [user?.id, ws]);

  useEffect(() => {
  request<{ articles: Article[] }>({
    endpoint: "/api/v1/news-letter/news",
    onSuccess: (data) => setNews(data.articles.slice(0, 3)), // ✅ data is now typed
    onFailure: (error) => console.log(error),
  });
}, []);

  return (
    <>
    <div className={classes.root}>
      <div className={classes.cover}>
        <img
          src={
            user?.coverPicture
              ? `${import.meta.env.VITE_API_URL}/api/v1/storage/${user?.coverPicture}`
              : "/cover.jpeg"
          }
          alt="Cover"
        />
      </div>

      <button className={classes.avatar} onClick={() => navigate("/profile/" + user?.id)}>
        <img
          src={
            user?.profilePicture
              ? `${import.meta.env.VITE_API_URL}/api/v1/storage/${user?.profilePicture}`
              : "/avatar.svg"
          }
          alt=""
        />
      </button>

      <div className={classes.name}>{user?.firstName + " " + user?.lastName}</div>
      <div className={classes.title}>{user?.position + " at " + user?.company}</div>

      <div className={classes.info}>
        <button className={classes.item} onClick={() => navigate("/network/connections")}>
          <span className={classes.label}>Connections</span>
          <span className={classes.value}>
            {connections.filter((c) => c.status === "ACCEPTED").length}
          </span>
        </button>
      </div>
</div>
       <div className={classes.newsContainer}>
      <h4 className={classes.title}>📰 Tech News</h4>
      {news.map((article, index) => (
        <a
          key={index}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.newsItem}
        >
          {/* <img src="/news-thumbnail.jpg" alt="news" className={classes.thumbnail} /> */}
          <img
  src={article.urlToImage || "/news-thumbnail.jpg"}
  alt={article.title}
  onError={(e) => (e.currentTarget.style.display = 'none')}
  className={classes.thumbnail}
/>

          <span>{article.title}</span>
        </a>
      ))}
      <button className={classes.viewMoreBtn} onClick={() => navigate("/news")}>
        View More
      </button>
    </div>
    </>
  );
}
