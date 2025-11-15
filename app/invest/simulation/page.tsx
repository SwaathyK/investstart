'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  ArrowLeft,
  Plus,
  Minus,
  Award,
  Trophy,
  BarChart3,
  Clock,
  Target,
  Zap,
  CheckCircle2,
  XCircle,
  Star,
  Bell,
  Settings,
  List,
  Activity
} from 'lucide-react'
import PriceChart from '@/components/PriceChart'
import Watchlist from '@/components/Watchlist'
import MarketOverview from '@/components/MarketOverview'

interface Stock {
  id: string
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  category: string
}

interface PortfolioItem {
  symbol: string
  name: string
  shares: number
  avgPrice: number
  currentPrice: number
  totalValue: number
  profit: number
  profitPercent: number
}

interface Transaction {
  id: string
  type: 'buy' | 'sell'
  symbol: string
  name: string
  shares: number
  price: number
  total: number
  timestamp: Date
  profit?: number  // Realized PnL for sell transactions
  profitPercent?: number  // Realized PnL percentage for sell transactions
  avgPrice?: number  // Average buy price for sell transactions
}

export const dynamic = 'force-dynamic'

export default function SimulationPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [virtualBalance, setVirtualBalance] = useState(1000.00)
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [shares, setShares] = useState('')
  const [action, setAction] = useState<'buy' | 'sell'>('buy')
  const [points, setPoints] = useState(0)
  const [tradesCount, setTradesCount] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<PortfolioItem | null>(null)
  const [sellQuantity, setSellQuantity] = useState('')
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop' | 'stopLimit'>('market')
  const [limitPrice, setLimitPrice] = useState('')
  const [stopLoss, setStopLoss] = useState('')
  const [takeProfit, setTakeProfit] = useState('')
  const [activeTab, setActiveTab] = useState<'market' | 'portfolio' | 'orders' | 'history'>('market')
  const [chartTimeframe, setChartTimeframe] = useState('1D')
  const [pendingOrders, setPendingOrders] = useState<any[]>([])
  const [priceAlerts, setPriceAlerts] = useState<any[]>([])

  // Mock stocks data
  const [stocks, setStocks] = useState<Stock[]>([
    { id: '1', symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, change: 2.30, changePercent: 1.33, volume: 45234567, category: 'Tech' },
    { id: '2', symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.80, change: -1.20, changePercent: -0.83, volume: 23456789, category: 'Tech' },
    { id: '3', symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.90, change: 5.40, changePercent: 1.45, volume: 34567890, category: 'Tech' },
    { id: '4', symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -3.20, changePercent: -1.27, volume: 56789012, category: 'Auto' },
    { id: '5', symbol: 'AMZN', name: 'Amazon.com Inc.', price: 145.30, change: 1.80, changePercent: 1.25, volume: 45678901, category: 'Retail' },
    { id: '6', symbol: 'META', name: 'Meta Platforms', price: 312.40, change: 4.60, changePercent: 1.50, volume: 34567890, category: 'Tech' },
    { id: '7', symbol: 'NVDA', name: 'NVIDIA Corp.', price: 485.20, change: 12.30, changePercent: 2.60, volume: 67890123, category: 'Tech' },
    { id: '8', symbol: 'JPM', name: 'JPMorgan Chase', price: 158.70, change: -0.90, changePercent: -0.56, volume: 23456789, category: 'Finance' },
  ])

  useEffect(() => {
    const checkLogin = () => {
      if (typeof window === 'undefined') return
      const loggedIn = localStorage.getItem('brokee_logged_in') === 'true'
      setIsLoggedIn(loggedIn)
      if (!loggedIn) {
        router.push('/login')
        return
      }

      // Load virtual balance
      const savedBalance = localStorage.getItem('brokee_virtual_balance')
      if (savedBalance) {
        setVirtualBalance(parseFloat(savedBalance))
      }

      // Load portfolio
      const savedPortfolio = localStorage.getItem('brokee_portfolio')
      if (savedPortfolio) {
        setPortfolio(JSON.parse(savedPortfolio))
      }

      // Load transactions
      const savedTransactions = localStorage.getItem('brokee_transactions')
      if (savedTransactions) {
        const parsed = JSON.parse(savedTransactions)
        setTransactions(parsed.map((t: any) => ({ ...t, timestamp: new Date(t.timestamp) })))
      }

      // Load points and trades count
      const savedPoints = localStorage.getItem('brokee_trading_points')
      if (savedPoints) {
        setPoints(parseInt(savedPoints))
      }

      const savedTrades = localStorage.getItem('brokee_trades_count')
      if (savedTrades) {
        setTradesCount(parseInt(savedTrades))
      }
    }

    checkLogin()
    window.addEventListener('loginStatusChanged', checkLogin)

    return () => {
      window.removeEventListener('loginStatusChanged', checkLogin)
    }
  }, [router])

  // Simulate real-time price updates
  useEffect(() => {
    if (!isLoggedIn) return

    const interval = setInterval(() => {
      setStocks(prevStocks => 
        prevStocks.map(stock => {
          const change = (Math.random() - 0.5) * 2 // Random change between -1 and 1
          const newPrice = Math.max(1, stock.price + change)
          const priceChange = newPrice - stock.price
          const changePercent = (priceChange / stock.price) * 100

          return {
            ...stock,
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat(priceChange.toFixed(2)),
            changePercent: parseFloat(changePercent.toFixed(2))
          }
        })
      )
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [isLoggedIn])

  // Update portfolio values when stock prices change
  useEffect(() => {
    if (portfolio.length === 0) return

    setPortfolio(prevPortfolio =>
      prevPortfolio.map(item => {
        const stock = stocks.find(s => s.symbol === item.symbol)
        if (!stock) return item

        const currentPrice = stock.price
        const totalValue = item.shares * currentPrice
        const profit = totalValue - (item.shares * item.avgPrice)
        const profitPercent = (profit / (item.shares * item.avgPrice)) * 100

        return {
          ...item,
          currentPrice,
          totalValue: parseFloat(totalValue.toFixed(2)),
          profit: parseFloat(profit.toFixed(2)),
          profitPercent: parseFloat(profitPercent.toFixed(2))
        }
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stocks])

  const handleBuy = () => {
    if (!selectedStock || !shares || parseFloat(shares) <= 0) return

    const sharesNum = parseFloat(shares)
    const totalCost = sharesNum * selectedStock.price

    if (totalCost > virtualBalance) {
      alert('Insufficient balance!')
      return
    }

    // Update balance
    const newBalance = virtualBalance - totalCost
    setVirtualBalance(newBalance)
    localStorage.setItem('brokee_virtual_balance', newBalance.toFixed(2))

    // Update portfolio
    const existingItem = portfolio.find(p => p.symbol === selectedStock.symbol)
    let newPortfolio: PortfolioItem[]

    if (existingItem) {
      const totalShares = existingItem.shares + sharesNum
      const totalCostOld = existingItem.shares * existingItem.avgPrice
      const avgPrice = (totalCostOld + totalCost) / totalShares

      newPortfolio = portfolio.map(item =>
        item.symbol === selectedStock.symbol
          ? {
              ...item,
              shares: totalShares,
              avgPrice: parseFloat(avgPrice.toFixed(2)),
              currentPrice: selectedStock.price,
              totalValue: parseFloat((totalShares * selectedStock.price).toFixed(2)),
              profit: parseFloat((totalShares * selectedStock.price - totalShares * avgPrice).toFixed(2)),
              profitPercent: 0
            }
          : item
      )
    } else {
      newPortfolio = [
        ...portfolio,
        {
          symbol: selectedStock.symbol,
          name: selectedStock.name,
          shares: sharesNum,
          avgPrice: selectedStock.price,
          currentPrice: selectedStock.price,
          totalValue: parseFloat(totalCost.toFixed(2)),
          profit: 0,
          profitPercent: 0
        }
      ]
    }

    setPortfolio(newPortfolio)
    localStorage.setItem('brokee_portfolio', JSON.stringify(newPortfolio))

    // Add transaction
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'buy',
      symbol: selectedStock.symbol,
      name: selectedStock.name,
      shares: sharesNum,
      price: selectedStock.price,
      total: totalCost,
      timestamp: new Date()
    }

    const newTransactions = [transaction, ...transactions]
    setTransactions(newTransactions)
    localStorage.setItem('brokee_transactions', JSON.stringify(newTransactions))

    // Update points and trades count
    const newPoints = points + 10 // 10 points per trade
    const newTradesCount = tradesCount + 1
    setPoints(newPoints)
    setTradesCount(newTradesCount)
    localStorage.setItem('brokee_trading_points', newPoints.toString())
    localStorage.setItem('brokee_trades_count', newTradesCount.toString())

    // Show success message
    setSuccessMessage(`Successfully bought ${sharesNum} shares of ${selectedStock.symbol} for £${totalCost.toFixed(2)}!`)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)

    // Reset form
    setShares('')
    setSelectedStock(null)

    // Trigger badge check
    window.dispatchEvent(new Event('tradingActivity'))
  }

  const handleSell = () => {
    if (!selectedStock || !shares || parseFloat(shares) <= 0) return

    const sharesNum = parseFloat(shares)
    const portfolioItem = portfolio.find(p => p.symbol === selectedStock.symbol)

    if (!portfolioItem || portfolioItem.shares < sharesNum) {
      alert('Insufficient shares!')
      return
    }

    const totalValue = sharesNum * selectedStock.price
    const profit = totalValue - (sharesNum * portfolioItem.avgPrice)

    // Update balance
    const newBalance = virtualBalance + totalValue
    setVirtualBalance(newBalance)
    localStorage.setItem('brokee_virtual_balance', newBalance.toFixed(2))

    // Update portfolio
    let newPortfolio: PortfolioItem[]
    if (portfolioItem.shares === sharesNum) {
      newPortfolio = portfolio.filter(p => p.symbol !== selectedStock.symbol)
    } else {
      newPortfolio = portfolio.map(item =>
        item.symbol === selectedStock.symbol
          ? {
              ...item,
              shares: item.shares - sharesNum,
              totalValue: parseFloat(((item.shares - sharesNum) * selectedStock.price).toFixed(2)),
              profit: parseFloat(((item.shares - sharesNum) * selectedStock.price - (item.shares - sharesNum) * item.avgPrice).toFixed(2))
            }
          : item
      )
    }

    setPortfolio(newPortfolio)
    localStorage.setItem('brokee_portfolio', JSON.stringify(newPortfolio))

    // Calculate profit percentage
    const profitPercent = portfolioItem.avgPrice > 0 
      ? (profit / (sharesNum * portfolioItem.avgPrice)) * 100 
      : 0

    // Add transaction
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'sell',
      symbol: selectedStock.symbol,
      name: selectedStock.name,
      shares: sharesNum,
      price: selectedStock.price,
      total: totalValue,
      timestamp: new Date(),
      profit: parseFloat(profit.toFixed(2)),
      profitPercent: parseFloat(profitPercent.toFixed(2)),
      avgPrice: portfolioItem.avgPrice
    }

    const newTransactions = [transaction, ...transactions]
    setTransactions(newTransactions)
    localStorage.setItem('brokee_transactions', JSON.stringify(newTransactions))

    // Update points (more points for profitable trades)
    const pointsEarned = profit > 0 ? 20 : 10
    const newPoints = points + pointsEarned
    const newTradesCount = tradesCount + 1
    setPoints(newPoints)
    setTradesCount(newTradesCount)
    localStorage.setItem('brokee_trading_points', newPoints.toString())
    localStorage.setItem('brokee_trades_count', newTradesCount.toString())

    // Show success message
    const profitText = profit > 0 ? `Profit: £${profit.toFixed(2)}` : `Loss: £${Math.abs(profit).toFixed(2)}`
    setSuccessMessage(`Sold ${sharesNum} shares of ${selectedStock.symbol} for £${totalValue.toFixed(2)}. ${profitText}!`)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)

    // Reset form
    setShares('')
    setSelectedStock(null)

    // Trigger badge check
    window.dispatchEvent(new Event('tradingActivity'))
  }

  const handlePortfolioSell = () => {
    if (!selectedPortfolioItem || !sellQuantity || parseFloat(sellQuantity) <= 0) {
      alert('Please enter a valid quantity to sell')
      return
    }

    const sharesNum = parseFloat(sellQuantity)
    const portfolioItem = portfolio.find(p => p.symbol === selectedPortfolioItem.symbol)
    
    if (!portfolioItem || portfolioItem.shares < sharesNum) {
      alert('Insufficient shares!')
      return
    }

    const stock = stocks.find(s => s.symbol === selectedPortfolioItem.symbol)
    if (!stock) return

    // Determine execution price based on order type
    let executionPrice: number
    if (orderType === 'market') {
      // Market order: execute at current market price
      executionPrice = stock.price
    } else {
      // Limit order: execute at specified price (if price is reached)
      const limitPriceNum = parseFloat(limitPrice)
      if (!limitPrice || limitPriceNum <= 0) {
        alert('Please enter a valid limit price')
        return
      }
      
      // For simulation, we'll execute if limit price is at or above current price for sell
      // In real trading, this would be handled by the exchange
      if (limitPriceNum > stock.price) {
        alert(`Limit price £${limitPriceNum.toFixed(2)} is above current market price £${stock.price.toFixed(2)}. Order will be placed and executed when price reaches your limit.`)
        // For simulation, we'll execute at the limit price
        executionPrice = limitPriceNum
      } else {
        // Limit price is at or below market price, execute immediately
        executionPrice = limitPriceNum
      }
    }

    const totalValue = sharesNum * executionPrice
    const profit = totalValue - (sharesNum * portfolioItem.avgPrice)

    // Update balance
    const newBalance = virtualBalance + totalValue
    setVirtualBalance(newBalance)
    localStorage.setItem('brokee_virtual_balance', newBalance.toFixed(2))

    // Update portfolio
    let newPortfolio: PortfolioItem[]
    if (portfolioItem.shares === sharesNum) {
      newPortfolio = portfolio.filter(p => p.symbol !== selectedPortfolioItem.symbol)
    } else {
      newPortfolio = portfolio.map(item =>
        item.symbol === selectedPortfolioItem.symbol
          ? {
              ...item,
              shares: item.shares - sharesNum,
              totalValue: parseFloat(((item.shares - sharesNum) * stock.price).toFixed(2)),
              profit: parseFloat(((item.shares - sharesNum) * stock.price - (item.shares - sharesNum) * item.avgPrice).toFixed(2))
            }
          : item
      )
    }

    setPortfolio(newPortfolio)
    localStorage.setItem('brokee_portfolio', JSON.stringify(newPortfolio))

    // Calculate profit percentage
    const profitPercent = portfolioItem.avgPrice > 0 
      ? (profit / (sharesNum * portfolioItem.avgPrice)) * 100 
      : 0

    // Add transaction
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'sell',
      symbol: selectedPortfolioItem.symbol,
      name: portfolioItem.name,
      shares: sharesNum,
      price: executionPrice,
      total: totalValue,
      timestamp: new Date(),
      profit: parseFloat(profit.toFixed(2)),
      profitPercent: parseFloat(profitPercent.toFixed(2)),
      avgPrice: portfolioItem.avgPrice
    }

    const newTransactions = [transaction, ...transactions]
    setTransactions(newTransactions)
    localStorage.setItem('brokee_transactions', JSON.stringify(newTransactions))

    // Update points (more points for profitable trades)
    const pointsEarned = profit > 0 ? 20 : 10
    const newPoints = points + pointsEarned
    const newTradesCount = tradesCount + 1
    setPoints(newPoints)
    setTradesCount(newTradesCount)
    localStorage.setItem('brokee_trading_points', newPoints.toString())
    localStorage.setItem('brokee_trades_count', newTradesCount.toString())

    // Show success message
    const orderTypeText = orderType === 'market' ? 'Market' : 'Limit'
    const profitText = profit > 0 ? `Profit: £${profit.toFixed(2)}` : `Loss: £${Math.abs(profit).toFixed(2)}`
    setSuccessMessage(`${orderTypeText} order: Sold ${sharesNum} shares of ${selectedPortfolioItem.symbol} at £${executionPrice.toFixed(2)}. ${profitText}!`)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)

    // Reset form
    setSelectedPortfolioItem(null)
    setSellQuantity('')
    setOrderType('market')
    setLimitPrice('')

    // Trigger badge check
    window.dispatchEvent(new Event('tradingActivity'))
  }

  const totalPortfolioValue = portfolio.reduce((sum, item) => sum + item.totalValue, 0)
  const totalProfit = portfolio.reduce((sum, item) => sum + item.profit, 0)
  const totalProfitPercent = totalPortfolioValue > 0 
    ? ((totalPortfolioValue - portfolio.reduce((sum, item) => sum + (item.shares * item.avgPrice), 0)) / portfolio.reduce((sum, item) => sum + (item.shares * item.avgPrice), 0)) * 100
    : 0

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <Navigation />

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-slide-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Virtual Trading Simulation</h1>
              <p className="text-gray-600">Practice trading with virtual money - Learn risk-free!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-xs text-gray-500">Points</p>
                    <p className="text-lg font-bold text-gray-900">{points}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="text-xs text-gray-500">Trades</p>
                    <p className="text-lg font-bold text-gray-900">{tradesCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Balance and Portfolio Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-primary-200">
            <div className="flex items-center justify-between mb-2">
              <Wallet className="h-6 w-6 text-primary-600" />
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Available</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">£{virtualBalance.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">Virtual Balance</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-accent-200">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="h-6 w-6 text-accent-600" />
              <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded">Portfolio</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">£{totalPortfolioValue.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">Total Value</p>
          </div>

          <div className={`bg-white rounded-xl shadow-lg p-6 border-2 ${
            totalProfit >= 0 ? 'border-green-200' : 'border-red-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              {totalProfit >= 0 ? (
                <TrendingUp className="h-6 w-6 text-green-600" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-600" />
              )}
              <span className={`text-xs px-2 py-1 rounded ${
                totalProfit >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>P&L</span>
            </div>
            <p className={`text-3xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalProfit >= 0 ? '+' : ''}£{totalProfit.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {totalProfitPercent >= 0 ? '+' : ''}{totalProfitPercent.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Market Overview */}
        <div className="mb-6">
          <MarketOverview stocks={stocks} />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('market')}
              className={`flex-1 px-4 py-2 rounded-md font-semibold transition-colors ${
                activeTab === 'market'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Market</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`flex-1 px-4 py-2 rounded-md font-semibold transition-colors ${
                activeTab === 'portfolio'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Portfolio</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 px-4 py-2 rounded-md font-semibold transition-colors ${
                activeTab === 'orders'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <List className="h-4 w-4" />
                <span>Orders</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-4 py-2 rounded-md font-semibold transition-colors ${
                activeTab === 'history'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>History</span>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'market' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Price Chart */}
              {selectedStock && (
                <PriceChart 
                  symbol={selectedStock.symbol} 
                  currentPrice={selectedStock.price}
                  timeframe={chartTimeframe}
                />
              )}

              {/* Stocks List */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Stocks</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {stocks.map((stock) => (
                  <div
                    key={stock.id}
                    onClick={() => setSelectedStock(stock)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedStock?.id === stock.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-bold text-gray-900">{stock.symbol}</h3>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {stock.category}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              const saved = localStorage.getItem('brokee_watchlist')
                              const watchlist = saved ? JSON.parse(saved) : []
                              const newWatchlist = watchlist.includes(stock.symbol)
                                ? watchlist.filter((s: string) => s !== stock.symbol)
                                : [...watchlist, stock.symbol]
                              localStorage.setItem('brokee_watchlist', JSON.stringify(newWatchlist))
                            }}
                            className="ml-auto"
                          >
                            <Star className={`h-4 w-4 ${
                              (() => {
                                const saved = localStorage.getItem('brokee_watchlist')
                                const watchlist = saved ? JSON.parse(saved) : []
                                return watchlist.includes(stock.symbol)
                              })() ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                            }`} />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{stock.name}</p>
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="text-lg font-semibold text-gray-900">£{stock.price.toFixed(2)}</p>
                          </div>
                          <div className={`flex items-center space-x-1 ${
                            stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {stock.change >= 0 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                            <span className="text-sm font-medium">
                              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trading Form */}
            {selectedStock && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {action === 'buy' ? 'Buy' : 'Sell'} {selectedStock.symbol}
                </h2>
                <div className="flex space-x-2 mb-4">
                  <button
                    onClick={() => setAction('buy')}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                      action === 'buy'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Plus className="h-4 w-4 inline mr-2" />
                    Buy
                  </button>
                  <button
                    onClick={() => setAction('sell')}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                      action === 'sell'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Minus className="h-4 w-4 inline mr-2" />
                    Sell
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Shares
                    </label>
                    <input
                      type="number"
                      value={shares}
                      onChange={(e) => setShares(e.target.value)}
                      placeholder="Enter shares"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                    />
                  </div>

                  {shares && parseFloat(shares) > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Price per share:</span>
                        <span className="font-semibold">£{selectedStock.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Shares:</span>
                        <span className="font-semibold">{parseFloat(shares).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-semibold text-gray-900">Total:</span>
                        <span className="font-bold text-lg text-primary-600">
                          £{(parseFloat(shares) * selectedStock.price).toFixed(2)}
                        </span>
                      </div>
                      {action === 'buy' && (
                        <div className="mt-2 text-sm text-gray-500">
                          Balance after: £{(virtualBalance - parseFloat(shares) * selectedStock.price).toFixed(2)}
                        </div>
                      )}
                      {action === 'sell' && (
                        <div className="mt-2 text-sm text-gray-500">
                          Available shares: {portfolio.find(p => p.symbol === selectedStock.symbol)?.shares || 0}
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={action === 'buy' ? handleBuy : handleSell}
                    disabled={!shares || parseFloat(shares) <= 0}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                      action === 'buy'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {action === 'buy' ? 'Buy Shares' : 'Sell Shares'}
                  </button>
                </div>
              </div>
            )}
            </div>

            {/* Sidebar - Watchlist */}
            <div className="space-y-6">
              <Watchlist 
                stocks={stocks} 
                onSelectStock={(symbol) => {
                  const stock = stocks.find(s => s.symbol === symbol)
                  if (stock) setSelectedStock(stock)
                }}
              />
            </div>
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            {/* Portfolio */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Portfolio</h2>
              {portfolio.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No holdings yet</p>
                  <p className="text-sm">Start buying stocks to build your portfolio!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {portfolio.map((item) => {
                    const currentStock = stocks.find(s => s.symbol === item.symbol)
                    const isSelected = selectedPortfolioItem?.symbol === item.symbol
                    return (
                      <div key={item.symbol}>
                        <div className={`border-2 rounded-lg p-4 transition-all ${
                          isSelected ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-primary-300'
                        }`}>
                          <div 
                            className="cursor-pointer"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedPortfolioItem(null)
                                setSellQuantity('')
                                setOrderType('market')
                                setLimitPrice('')
                              } else {
                                setSelectedPortfolioItem(item)
                                setSellQuantity('')
                                setOrderType('market')
                                setLimitPrice(currentStock?.price.toFixed(2) || '')
                              }
                            }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h3 className="font-bold text-gray-900">{item.symbol}</h3>
                                <p className="text-xs text-gray-500">{item.name}</p>
                              </div>
                              <div className={`flex items-center space-x-1 ${
                                item.profit >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {item.profit >= 0 ? (
                                  <TrendingUp className="h-4 w-4" />
                                ) : (
                                  <TrendingDown className="h-4 w-4" />
                                )}
                                <span className="text-sm font-semibold">
                                  {item.profitPercent >= 0 ? '+' : ''}{item.profitPercent.toFixed(2)}%
                                </span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-500">Shares:</span>
                                <span className="font-semibold ml-2">{item.shares}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Value:</span>
                                <span className="font-semibold ml-2">£{item.totalValue.toFixed(2)}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Avg Price:</span>
                                <span className="font-semibold ml-2">£{item.avgPrice.toFixed(2)}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">P&L:</span>
                                <span className={`font-semibold ml-2 ${
                                  item.profit >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {item.profit >= 0 ? '+' : ''}£{item.profit.toFixed(2)}
                                </span>
                              </div>
                            </div>
                            {currentStock && (
                              <div className="mt-2 text-xs text-gray-500">
                                Current Price: £{currentStock.price.toFixed(2)} 
                                <span className={`ml-2 ${currentStock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  ({currentStock.change >= 0 ? '+' : ''}{currentStock.changePercent.toFixed(2)}%)
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Sell Form - shown when item is selected */}
                          {isSelected && currentStock && (
                            <div className="mt-4 pt-4 border-t border-gray-300">
                              <h4 className="font-semibold text-gray-900 mb-3">Sell {item.symbol}</h4>
                              
                              {/* Order Type Selection */}
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Order Type
                                </label>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => {
                                      setOrderType('market')
                                      setLimitPrice('')
                                    }}
                                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                                      orderType === 'market'
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                  >
                                    Market
                                  </button>
                                  <button
                                    onClick={() => {
                                      setOrderType('limit')
                                      setLimitPrice(currentStock.price.toFixed(2))
                                    }}
                                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                                      orderType === 'limit'
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                  >
                                    Limit
                                  </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {orderType === 'market' 
                                    ? 'Market orders execute immediately at the current market price.'
                                    : 'Limit orders execute only when the price reaches your specified limit.'}
                                </p>
                              </div>

                              {/* Quantity Input */}
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Quantity to Sell
                                </label>
                                <div className="flex space-x-2">
                                  <input
                                    type="number"
                                    value={sellQuantity}
                                    onChange={(e) => setSellQuantity(e.target.value)}
                                    placeholder="Enter shares"
                                    min="0"
                                    max={item.shares}
                                    step="0.01"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                                  />
                                  <button
                                    onClick={() => setSellQuantity(item.shares.toString())}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors"
                                  >
                                    Max
                                  </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Available: {item.shares} shares
                                </p>
                              </div>

                              {/* Limit Price Input (only for Limit orders) */}
                              {orderType === 'limit' && (
                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Limit Price (£)
                                  </label>
                                  <input
                                    type="number"
                                    value={limitPrice}
                                    onChange={(e) => setLimitPrice(e.target.value)}
                                    placeholder="Enter limit price"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">
                                    Current market price: £{currentStock.price.toFixed(2)}
                                  </p>
                                </div>
                              )}

                              {/* Order Summary */}
                              {sellQuantity && parseFloat(sellQuantity) > 0 && (
                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                  <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Shares:</span>
                                    <span className="font-semibold">{parseFloat(sellQuantity).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Price per share:</span>
                                    <span className="font-semibold">
                                      {orderType === 'market' 
                                        ? `£${currentStock.price.toFixed(2)} (Market)`
                                        : `£${limitPrice || '0.00'} (Limit)`}
                                    </span>
                                  </div>
                                  <div className="flex justify-between pt-2 border-t border-gray-200">
                                    <span className="font-semibold text-gray-900">Estimated Total:</span>
                                    <span className="font-bold text-lg text-primary-600">
                                      £{(
                                        parseFloat(sellQuantity) * 
                                        (orderType === 'market' ? currentStock.price : parseFloat(limitPrice) || 0)
                                      ).toFixed(2)}
                                    </span>
                                  </div>
                                  {orderType === 'market' && (
                                    <div className="mt-2 text-xs text-gray-500">
                                      * Market orders execute at current price, which may change
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Sell Button */}
                              <button
                                onClick={handlePortfolioSell}
                                disabled={!sellQuantity || parseFloat(sellQuantity) <= 0 || parseFloat(sellQuantity) > item.shares || (orderType === 'limit' && (!limitPrice || parseFloat(limitPrice) <= 0))}
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                              >
                                <Minus className="h-5 w-5" />
                                <span>Sell {orderType === 'market' ? 'at Market' : 'Limit Order'}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Transactions</h2>
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No transactions yet</p>
                  <p className="text-sm">Your trading history will appear here</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {transactions.slice(0, 10).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {transaction.type === 'buy' ? (
                            <Plus className="h-4 w-4 text-green-600" />
                          ) : (
                            <Minus className="h-4 w-4 text-red-600" />
                          )}
                          <span className={`font-semibold ${
                            transaction.type === 'buy' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type.toUpperCase()}
                          </span>
                          <span className="font-bold">{transaction.symbol}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {transaction.shares} shares @ £{transaction.price.toFixed(2)}
                          {transaction.type === 'sell' && transaction.avgPrice && (
                            <span className="ml-2 text-gray-400">
                              (Avg: £{transaction.avgPrice.toFixed(2)})
                            </span>
                          )}
                        </p>
                        {transaction.type === 'sell' && transaction.profit !== undefined && (
                          <div className="mt-1 flex items-center space-x-2">
                            <span className={`text-xs font-semibold ${
                              transaction.profit >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              PnL: {transaction.profit >= 0 ? '+' : ''}£{transaction.profit.toFixed(2)}
                            </span>
                            {transaction.profitPercent !== undefined && (
                              <span className={`text-xs font-semibold ${
                                transaction.profitPercent >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                ({transaction.profitPercent >= 0 ? '+' : ''}{transaction.profitPercent.toFixed(2)}%)
                              </span>
                            )}
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {transaction.timestamp.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">£{transaction.total.toFixed(2)}</p>
                        {transaction.type === 'sell' && transaction.profit !== undefined && (
                          <p className={`text-xs font-semibold mt-1 ${
                            transaction.profit >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.profit >= 0 ? 'Profit' : 'Loss'}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Orders</h2>
              {pendingOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <List className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No pending orders</p>
                  <p className="text-sm">Your pending limit and stop orders will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`font-semibold ${order.type === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                              {order.type.toUpperCase()}
                            </span>
                            <span className="font-bold text-gray-900">{order.symbol}</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              {order.orderType}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {order.shares} shares @ £{order.price.toFixed(2)}
                          </p>
                        </div>
                        <button className="text-red-600 hover:text-red-700 px-3 py-1 rounded text-sm font-semibold">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Transaction History</h2>
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No transactions yet</p>
                  <p className="text-sm">Your trading history will appear here</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {transaction.type === 'buy' ? (
                            <Plus className="h-4 w-4 text-green-600" />
                          ) : (
                            <Minus className="h-4 w-4 text-red-600" />
                          )}
                          <span className={`font-semibold ${
                            transaction.type === 'buy' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type.toUpperCase()}
                          </span>
                          <span className="font-bold text-gray-900">{transaction.symbol}</span>
                          <span className="text-xs text-gray-500">{transaction.name}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {transaction.shares} shares @ £{transaction.price.toFixed(2)}
                          {transaction.type === 'sell' && transaction.avgPrice && (
                            <span className="ml-2 text-gray-400">
                              (Avg: £{transaction.avgPrice.toFixed(2)})
                            </span>
                          )}
                        </p>
                        {transaction.type === 'sell' && transaction.profit !== undefined && (
                          <div className="mt-1 flex items-center space-x-2">
                            <span className={`text-xs font-semibold ${
                              transaction.profit >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              PnL: {transaction.profit >= 0 ? '+' : ''}£{transaction.profit.toFixed(2)}
                            </span>
                            {transaction.profitPercent !== undefined && (
                              <span className={`text-xs font-semibold ${
                                transaction.profitPercent >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                ({transaction.profitPercent >= 0 ? '+' : ''}{transaction.profitPercent.toFixed(2)}%)
                              </span>
                            )}
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {transaction.timestamp.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">£{transaction.total.toFixed(2)}</p>
                        {transaction.type === 'sell' && transaction.profit !== undefined && (
                          <p className={`text-xs font-semibold mt-1 ${
                            transaction.profit >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.profit >= 0 ? 'Profit' : 'Loss'}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

