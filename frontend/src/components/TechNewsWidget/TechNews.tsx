import React, { useEffect, useState } from 'react';
import { request } from "../../utils/api";
import './TechNews.scss';

type Article = {
  source: { id: string | null; name: string };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
};

type TechNewsResponse = {
  status: string;
  totalResults: number;
  articles: Array<Article>;
};

const TechNews: React.FC = () => {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request<TechNewsResponse>({
      endpoint: '/api/v1/news-letter/news',
      onSuccess: (data) => {
        setNews(data.articles);
        setLoading(false);
      },
      onFailure: (error) => {
        console.log('Error fetching news:', error);
        setLoading(false);
      },
    });
  }, []);

  if (loading) return <p className="loading-text">Loading tech news...</p>;

  return (
    <div className="tech-news-container">
      <h1>📰 Latest Tech News</h1>

      <div className="news-grid">
        {news.map((article, index) => (
          <div key={index} className="news-card">
            {article.urlToImage && (
              <div className="image-wrapper">
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
            )}
            <div className="content">
              <h2>{article.title}</h2>
              <p>{article.description}</p>

              <div className="author-time">
                <span className="author">By {article.author || 'Unknown'}</span>
                <div className="date-time">
                  <span className="date">
                    📅 {new Date(article.publishedAt).toLocaleDateString(undefined, {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="time">
                    🕒 {new Date(article.publishedAt).toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more-btn">
                Read More →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechNews;
