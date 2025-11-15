'use client'

import { useState, useEffect } from 'react'
import { Star, TrendingUp, TrendingDown, X } from 'lucide-react'

interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

interface WatchlistProps {
  stocks: Stock[]
  onSelectStock: (symbol: string) => void
}

export default function Watchlist({ stocks, onSelectStock }: WatchlistProps) {
  const [watchlist, setWatchlist] = useState<string[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('brokee_watchlist')
    if (saved) {
      setWatchlist(JSON.parse(saved))
    }
  }, [])

  const toggleWatchlist = (symbol: string) => {
    const newWatchlist = watchlist.includes(symbol)
      ? watchlist.filter(s => s !== symbol)
      : [...watchlist, symbol]
    setWatchlist(newWatchlist)
    localStorage.setItem('brokee_watchlist', JSON.stringify(newWatchlist))
  }

  const watchlistStocks = stocks.filter(s => watchlist.includes(s.symbol))

  if (watchlistStocks.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Watchlist</h3>
        <p className="text-sm text-gray-500">Add stocks to your watchlist by clicking the star icon</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Watchlist</h3>
        <span className="text-xs text-gray-500">{watchlistStocks.length} items</span>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {watchlistStocks.map((stock) => (
          <div
            key={stock.symbol}
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
            onClick={() => onSelectStock(stock.symbol)}
          >
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{stock.symbol}</div>
              <div className="text-xs text-gray-500">{stock.name}</div>
            </div>
            <div className="text-right mr-2">
              <div className="font-semibold text-gray-900">£{stock.price.toFixed(2)}</div>
              <div className={`text-xs flex items-center space-x-1 ${
                stock.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stock.change >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>
                  {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleWatchlist(stock.symbol)
              }}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <Star className={`h-4 w-4 ${watchlist.includes(stock.symbol) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

