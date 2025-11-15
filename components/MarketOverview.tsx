'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'

interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
}

interface MarketOverviewProps {
  stocks: Stock[]
}

export default function MarketOverview({ stocks }: MarketOverviewProps) {
  const gainers = [...stocks]
    .filter(s => s.change > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5)

  const losers = [...stocks]
    .filter(s => s.change < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5)

  const mostActive = [...stocks]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 5)

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {/* Top Gainers */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <span>Top Gainers</span>
        </h3>
        <div className="space-y-2">
          {gainers.map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between text-sm">
              <div>
                <div className="font-semibold text-gray-900">{stock.symbol}</div>
                <div className="text-xs text-gray-500">{stock.name}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">£{stock.price.toFixed(2)}</div>
                <div className="text-green-600 font-medium">
                  +{stock.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Losers */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
          <TrendingDown className="h-4 w-4 text-red-600" />
          <span>Top Losers</span>
        </h3>
        <div className="space-y-2">
          {losers.map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between text-sm">
              <div>
                <div className="font-semibold text-gray-900">{stock.symbol}</div>
                <div className="text-xs text-gray-500">{stock.name}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">£{stock.price.toFixed(2)}</div>
                <div className="text-red-600 font-medium">
                  {stock.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Most Active */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Most Active</h3>
        <div className="space-y-2">
          {mostActive.map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between text-sm">
              <div>
                <div className="font-semibold text-gray-900">{stock.symbol}</div>
                <div className="text-xs text-gray-500">{stock.name}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">£{stock.price.toFixed(2)}</div>
                <div className="text-xs text-gray-500">
                  Vol: {(stock.volume / 1000000).toFixed(1)}M
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

