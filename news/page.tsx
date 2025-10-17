import { getNews } from "@/lib/actions/finnhub.actions";
import { formatTimeAgo } from "@/lib/utils";
import Link from "next/link";

export default async function NewsPage() {
  const newsArticles = await getNews();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Market News</h1>
      
      <div className="grid gap-6">
        {newsArticles.map((article) => (
          <div key={article.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-xl font-semibold text-white">
                {article.headline}
              </h2>
              <span className="text-gray-400 text-sm">
                {formatTimeAgo(article.datetime)}
              </span>
            </div>
            
            <p className="text-gray-300 mb-4 line-clamp-3">
              {article.summary}
            </p>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">
                Source: {article.source}
              </span>
              
              <Link 
                href={article.url} 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-500 text-black px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
              >
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}