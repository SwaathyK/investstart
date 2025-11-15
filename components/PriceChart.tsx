'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface PriceData {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface PriceChartProps {
  symbol: string
  currentPrice: number
  timeframe: string
}

export default function PriceChart({ symbol, currentPrice, timeframe }: PriceChartProps) {
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [hoveredPoint, setHoveredPoint] = useState<PriceData | null>(null)

  useEffect(() => {
    // Generate mock candlestick data
    const generateData = () => {
      const data: PriceData[] = []
      const basePrice = currentPrice
      let price = basePrice
      const now = Date.now()
      const interval = timeframe === '1D' ? 3600000 : timeframe === '1H' ? 300000 : 60000 // 1 hour, 5 min, or 1 min

      for (let i = 50; i >= 0; i--) {
        const change = (Math.random() - 0.5) * 2
        const open = price
        const high = open + Math.abs(change) + Math.random() * 0.5
        const low = open - Math.abs(change) - Math.random() * 0.5
        const close = open + change
        price = close

        data.push({
          time: now - (i * interval),
          open: parseFloat(open.toFixed(2)),
          high: parseFloat(high.toFixed(2)),
          low: parseFloat(low.toFixed(2)),
          close: parseFloat(close.toFixed(2)),
          volume: Math.floor(Math.random() * 1000000) + 100000
        })
      }
      setPriceData(data)
    }

    generateData()
    const interval = setInterval(generateData, 5000)
    return () => clearInterval(interval)
  }, [currentPrice, timeframe])

  if (priceData.length === 0) return <div className="h-64 flex items-center justify-center text-gray-500">Loading chart...</div>

  const allPrices = priceData.flatMap(d => [d.high, d.low])
  const minPrice = Math.min(...allPrices)
  const maxPrice = Math.max(...allPrices)
  const priceRange = maxPrice - minPrice || 1
  const chartHeight = 300
  const chartWidth = 800
  const padding = 40
  const candleWidth = (chartWidth - 2 * padding) / priceData.length

  const getY = (price: number) => {
    return chartHeight - padding - ((price - minPrice) / priceRange) * (chartHeight - 2 * padding)
  }

  const latestPrice = priceData[priceData.length - 1]?.close || currentPrice
  const priceChange = latestPrice - priceData[0]?.open || 0
  const priceChangePercent = priceData[0]?.open ? ((priceChange / priceData[0].open) * 100) : 0

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{symbol}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">£{latestPrice.toFixed(2)}</span>
            <span className={`flex items-center space-x-1 ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {priceChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span className="font-semibold">
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
              </span>
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          {['1M', '5M', '15M', '1H', '1D'].map((tf) => (
            <button
              key={tf}
              onClick={() => {
                // This would update the parent component's timeframe
                // For now, we'll just show the selected timeframe
              }}
              className={`px-3 py-1 rounded text-sm font-medium ${
                timeframe === tf
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="relative" style={{ height: chartHeight }}>
        <svg width="100%" height={chartHeight} className="overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding + ratio * (chartHeight - 2 * padding)
            const price = maxPrice - ratio * priceRange
            return (
              <g key={ratio}>
                <line
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  fill="#6b7280"
                  fontSize="10"
                  textAnchor="end"
                >
                  £{price.toFixed(2)}
                </text>
              </g>
            )
          })}

          {/* Candlesticks */}
          {priceData.map((candle, index) => {
            const x = padding + index * candleWidth + candleWidth / 2
            const openY = getY(candle.open)
            const closeY = getY(candle.close)
            const highY = getY(candle.high)
            const lowY = getY(candle.low)
            const isGreen = candle.close >= candle.open
            const bodyTop = Math.min(openY, closeY)
            const bodyBottom = Math.max(openY, closeY)
            const bodyHeight = bodyBottom - bodyTop || 1

            return (
              <g
                key={index}
                onMouseEnter={() => setHoveredPoint(candle)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="cursor-pointer"
              >
                {/* Wick */}
                <line
                  x1={x}
                  y1={highY}
                  x2={x}
                  y2={lowY}
                  stroke={isGreen ? '#10b981' : '#ef4444'}
                  strokeWidth="1"
                />
                {/* Body */}
                <rect
                  x={x - candleWidth / 2 + 2}
                  y={bodyTop}
                  width={candleWidth - 4}
                  height={bodyHeight}
                  fill={isGreen ? '#10b981' : '#ef4444'}
                />
              </g>
            )
          })}

          {/* Price line */}
          <polyline
            points={priceData.map((candle, index) => {
              const x = padding + index * candleWidth + candleWidth / 2
              const y = getY(candle.close)
              return `${x},${y}`
            }).join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />
        </svg>

        {/* Hover tooltip */}
        {hoveredPoint && (
          <div
            className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg text-sm shadow-lg z-10"
            style={{
              left: '50%',
              top: '10px',
              transform: 'translateX(-50%)'
            }}
          >
            <div className="font-semibold mb-1">{symbol}</div>
            <div>Open: £{hoveredPoint.open.toFixed(2)}</div>
            <div>High: £{hoveredPoint.high.toFixed(2)}</div>
            <div>Low: £{hoveredPoint.low.toFixed(2)}</div>
            <div>Close: £{hoveredPoint.close.toFixed(2)}</div>
            <div>Volume: {hoveredPoint.volume.toLocaleString()}</div>
          </div>
        )}
      </div>
    </div>
  )
}

