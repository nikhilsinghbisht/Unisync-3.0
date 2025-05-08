import React, { useEffect, useState } from 'react';
import { request } from "../../utils/api";

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

  if (loading) return <p className="text-center mt-10 text-lg font-serif">Loading tech news...</p>;

  return (
    <div className="px-6 py-10 min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 font-[Times_New_Roman]">
  <h1 className="text-center text-blue-900 font-extrabold text-5xl mb-12 border-b-4 border-blue-600 inline-block pb-2">
    📰 Latest Tech News
  </h1>



      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((article, index) => (
          <div
            key={index}
            className="bg-white shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
          >
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-28 object-cover"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            )}
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-800">{article.title}</h2>
              <p className="text-gray-700 text-sm mt-2 line-clamp-3">{article.description}</p>

              <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                <span className="italic">By {article.author || 'Unknown'}</span>
              </div>

              <div className="mt-2 text-xs text-gray-500">
                <span className="block mb-1">
                  📅 {new Date(article.publishedAt).toLocaleDateString(undefined, {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span>
                  🕒 {new Date(article.publishedAt).toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 font-bold text-blue-700 hover:underline"
              >
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
