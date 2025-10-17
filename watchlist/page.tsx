// import { getUserWatchlist } from "@/lib/actions/watchlist.actions";
// import WatchlistButton from "@/components/WatchlistButton";
// import { getStockQuote } from "@/lib/actions/finnhub.actions";
// import Link from "next/link";

// interface WatchlistItem {
//   _id: string;
//   symbol: string;
//   company: string;
//   addedAt: string;
// }

// export default async function WatchlistPage() {
//   const watchlistItems = await getUserWatchlist() as unknown as WatchlistItem[];
  
//   // Fetch current prices for all watchlist items
//   const watchlistWithPrices = await Promise.all(
//     watchlistItems.map(async (item) => {
//       try {
//         const quote = await getStockQuote(item.symbol);
//         return {
//           ...item,
//           currentPrice: quote?.c || 0,
//           change: quote?.d || 0,
//           changePercent: quote?.dp || 0,
//           high: quote?.h || 0,
//           low: quote?.l || 0,
//           open: quote?.o || 0,
//           previousClose: quote?.pc || 0,
//         };
//       } catch (error) {
//         return { 
//           ...item, 
//           currentPrice: 0, 
//           change: 0, 
//           changePercent: 0,
//           high: 0,
//           low: 0,
//           open: 0,
//           previousClose: 0
//         };
//       }
//     })
//   );

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold text-white mb-6">My Watchlist</h1>
      
//       {watchlistWithPrices.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-gray-400 text-lg">Your watchlist is empty</p>
//           <p className="text-gray-500 mt-2">
//             Add stocks to your watchlist to track them here
//           </p>
//         </div>
//       ) : (
//         <div className="grid gap-6">
//           {watchlistWithPrices.map((item) => (
//             <div
//               key={item._id}
//               className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
//             >
//               <div className="flex justify-between items-start">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-4 mb-3">
//                     <h3 className="text-white font-semibold text-xl">{item.company}</h3>
//                     <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-sm">
//                       {item.symbol}
//                     </span>
//                   </div>
                  
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//                     <div>
//                       <p className="text-gray-400 text-sm">Current Price</p>
//                       <p className="text-white text-xl font-bold">
//                         ${item.currentPrice?.toFixed(2) || "N/A"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-gray-400 text-sm">Change</p>
//                       <p className={`text-xl font-bold ${
//                         item.change >= 0 ? 'text-green-500' : 'text-red-500'
//                       }`}>
//                         {item.change >= 0 ? '+' : ''}{item.change?.toFixed(2)} ({item.changePercent?.toFixed(2)}%)
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-gray-400 text-sm">Today's Range</p>
//                       <p className="text-white text-sm">
//                         ${item.low?.toFixed(2)} - ${item.high?.toFixed(2)}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-gray-400 text-sm">Open</p>
//                       <p className="text-white text-sm">${item.open?.toFixed(2)}</p>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex flex-col gap-2 ml-4">
//                   <WatchlistButton
//                     symbol={item.symbol}
//                     company={item.company}
//                     isInWatchlist={true}
//                     type="button"
//                     showTrashIcon={true}
//                   />
//                   <Link 
//                     href={`/stocks/${item.symbol}`}
//                     className="bg-yellow-500 text-black px-4 py-2 rounded-md text-center hover:bg-yellow-600 transition-colors"
//                   >
//                     View Details
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }








import { getUserWatchlist } from "@/lib/actions/watchlist.actions";
import WatchlistButton from "@/components/WatchlistButton";
import { getStockQuote } from "@/lib/actions/finnhub.actions";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";
import { JSX } from "react";

interface WatchlistItem {
  _id: string;
  symbol: string;
  company: string;
  addedAt: string;
}

interface WatchlistItemWithPrices extends WatchlistItem {
  currentPrice: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

export default async function WatchlistPage() {
  const watchlistItems = await getUserWatchlist() as unknown as WatchlistItem[];
  
  const watchlistWithPrices = await Promise.all(
    watchlistItems.map(async (item): Promise<WatchlistItemWithPrices> => {
      try {
        const quote = await getStockQuote(item.symbol);
        return {
          ...item,
          currentPrice: quote?.c || 0,
          change: quote?.d || 0,
          changePercent: quote?.dp || 0,
          high: quote?.h || 0,
          low: quote?.l || 0,
          open: quote?.o || 0,
          previousClose: quote?.pc || 0,
        };
      } catch (error) {
        return { 
          ...item, 
          currentPrice: 0, 
          change: 0, 
          changePercent: 0,
          high: 0,
          low: 0,
          open: 0,
          previousClose: 0
        };
      }
    })
  );

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const formatPrice = (price: number) => {
    return price ? `$${price.toFixed(2)}` : "N/A";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Watchlist</h1>
          <p className="text-gray-400">Track your favorite stocks in real-time</p>
        </div>

        {watchlistWithPrices.length === 0 ? (
          <EmptyWatchlistState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {watchlistWithPrices.map((item) => (
              <StockCard 
                key={item._id} 
                item={item} 
                getTrendIcon={getTrendIcon}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StockCard({ 
  item, 
  getTrendIcon, 
  formatPrice 
}: { 
  item: WatchlistItemWithPrices;
  getTrendIcon: (change: number) => JSX.Element;
  formatPrice: (price: number) => string;
}) {
  const isPositive = item.change > 0;
  const isNegative = item.change < 0;

  return (
    <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:translate-y-[-2px]">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg truncate">{item.company}</h3>
          <p className="text-gray-400 text-sm">{item.symbol}</p>
        </div>
        <div className="flex items-center gap-2">
          <WatchlistButton
            symbol={item.symbol}
            company={item.company}
            isInWatchlist={true}
            type="icon"
            showTrashIcon={true}
          />
        </div>
      </div>

      {/* Price and Change */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className={`text-2xl font-bold ${
            isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-gray-400'
          }`}>
            {formatPrice(item.currentPrice)}
          </span>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
            isPositive 
              ? 'bg-green-500/20 text-green-400' 
              : isNegative 
                ? 'bg-red-500/20 text-red-400'
                : 'bg-gray-500/20 text-gray-400'
          }`}>
            {getTrendIcon(item.change)}
            <span>
              {item.change >= 0 ? '+' : ''}{item.change?.toFixed(2)} ({item.changePercent?.toFixed(2)}%)
            </span>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Prev: {formatPrice(item.previousClose)}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-1">
          <p className="text-gray-400 text-xs uppercase tracking-wide">Today's Range</p>
          <p className="text-white text-sm font-medium">
            {formatPrice(item.low)} - {formatPrice(item.high)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-400 text-xs uppercase tracking-wide">Open</p>
          <p className="text-white text-sm font-medium">{formatPrice(item.open)}</p>
        </div>
      </div>

      {/* Action Button */}
      <Link 
        href={`/stocks/${item.symbol}`}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold group/btn"
      >
        View Details
        <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}

function EmptyWatchlistState() {
  return (
    <div className="text-center py-20">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No stocks in watchlist</h3>
        <p className="text-gray-400 mb-6">
          Start building your watchlist by adding your favorite stocks
        </p>
        <Link
          href="/stocks"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
        >
          Explore Stocks
        </Link>
      </div>
    </div>
  );
}