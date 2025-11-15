'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { 
  Gamepad2, 
  Play,
  ArrowLeft,
  Wallet,
  TrendingUp,
  BookOpen,
  Target,
  Award,
  CheckCircle2,
  Zap,
  Flame,
  Trophy
} from 'lucide-react'

export default function SimulationPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [virtualBalance, setVirtualBalance] = useState(1000.00)
  const [visitHistory, setVisitHistory] = useState<string[]>([])
  const [longestStreak, setLongestStreak] = useState(0)

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
      } else {
        setVirtualBalance(1000.00)
        localStorage.setItem('brokee_virtual_balance', '1000.00')
      }
    }

    checkLogin()
    window.addEventListener('loginStatusChanged', checkLogin)
    
    return () => {
      window.removeEventListener('loginStatusChanged', checkLogin)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Listen for balance updates
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleBalanceUpdate = () => {
      const savedBalance = localStorage.getItem('brokee_virtual_balance')
      if (savedBalance) {
        setVirtualBalance(parseFloat(savedBalance))
      }
    }

    window.addEventListener('virtualBalanceUpdated', handleBalanceUpdate)
    return () => {
      window.removeEventListener('virtualBalanceUpdated', handleBalanceUpdate)
    }
  }, [])

  // Track daily visits and load streak data
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Mark today as visited
    const today = new Date().toDateString()
    const savedVisits = localStorage.getItem('brokee_visit_history')
    let visits: string[] = savedVisits ? JSON.parse(savedVisits) : []
    
    // Add today if not already in the list
    if (!visits.includes(today)) {
      visits.push(today)
      // Keep only last 30 days to avoid storage bloat
      visits = visits.slice(-30)
      localStorage.setItem('brokee_visit_history', JSON.stringify(visits))
    }
    
    setVisitHistory(visits)

    // Load longest streak from streak data
    const savedStreak = localStorage.getItem('brokee_streak')
    if (savedStreak) {
      try {
        const streakData = JSON.parse(savedStreak)
        setLongestStreak(streakData.longestStreak || 0)
      } catch (e) {
        setLongestStreak(0)
      }
    }
  }, [])

  if (!isLoggedIn) {
    return null
  }

  const dailyTasks = [
    { id: 1, task: 'Complete a mini-course lesson', points: 50, completed: false },
    { id: 2, task: 'Make your first simulation trade', points: 100, completed: false },
    { id: 3, task: 'Check your portfolio', points: 25, completed: true },
    { id: 4, task: 'Read investment tips', points: 30, completed: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Virtual Money Simulation</h1>
          <p className="text-gray-600">Practice investing with virtual money - Learn risk-free!</p>
        </div>

        {/* Fire Streak Indicator */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Flame className="h-6 w-6 text-orange-500" />
              <h2 className="text-xl font-bold text-gray-900">7-Day Activity Streak</h2>
            </div>
            {longestStreak > 0 && (
              <div className="flex items-center space-x-2 bg-orange-50 px-3 py-1 rounded-lg">
                <Trophy className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-semibold text-orange-700">
                  Best: {longestStreak} days
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center">
            {/* Last 7 days fire icons */}
            <div className="flex items-center space-x-3 md:space-x-4">
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date()
                date.setDate(date.getDate() - (6 - i))
                const dateString = date.toDateString()
                const isVisited = visitHistory.includes(dateString)
                const isToday = i === 6
                
                return (
                  <div key={i} className="flex flex-col items-center space-y-2">
                    <div className={`relative ${isToday ? 'scale-110' : ''} transition-transform`}>
                      {isVisited ? (
                        <div className="bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-full p-2">
                          <Flame className="h-6 w-6 md:h-8 md:w-8 text-white" />
                        </div>
                      ) : (
                        <div className="bg-gray-100 rounded-full p-2">
                          <Flame className="h-6 w-6 md:h-8 md:w-8 text-gray-400 grayscale" />
                        </div>
                      )}
                      {isToday && (
                        <div className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white">
                          !
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mt-4 text-center">
            {visitHistory.length > 0 
              ? `Keep your streak alive by visiting daily! 🔥`
              : 'Start your streak by visiting the platform daily!'}
          </p>
        </div>

        {/* Virtual Money Balance Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-accent-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Gamepad2 className="h-6 w-6 text-accent-600" />
              <h3 className="text-lg font-semibold text-gray-900">Virtual Money</h3>
            </div>
            <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded">Practice</span>
          </div>
          <div className="mb-4">
            <p className="text-3xl font-bold text-gray-900">£{virtualBalance.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">Available Balance</p>
            {virtualBalance < 1000.00 && (
              <div className="mt-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-800">
                  💡 Complete 2-3 courses to replenish your virtual money!
                </p>
              </div>
            )}
          </div>
          <Link
            href="/invest/simulation"
            className="w-full bg-accent-600 text-white px-4 py-3 rounded-lg hover:bg-accent-700 transition-colors flex items-center justify-center space-x-2 font-semibold"
          >
            <Play className="h-5 w-5" />
            <span>Start Simulation</span>
          </Link>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How Virtual Money Works</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Wallet className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Start with £1,000</h3>
                <p className="text-sm text-gray-600">
                  Every new user starts with £1,000 in virtual money to practice investing without any real financial risk.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <TrendingUp className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Practice Trading</h3>
                <p className="text-sm text-gray-600">
                  Use your virtual money to buy and sell stocks, learn market dynamics, and test different investment strategies.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <BookOpen className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Earn More Virtual Money</h3>
                <p className="text-sm text-gray-600">
                  Complete courses and daily tasks to earn points that convert to virtual money, keeping your practice account funded.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Target className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Learn Risk-Free</h3>
                <p className="text-sm text-gray-600">
                  All trades are simulated with virtual money, so you can learn from mistakes without losing real money.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Tasks Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-accent-600" />
              <h2 className="text-2xl font-bold text-gray-900">Earn Virtual Money</h2>
            </div>
            <div className="flex items-center space-x-2 text-accent-600">
              <Award className="h-5 w-5" />
              <span className="font-semibold">Daily Tasks</span>
            </div>
          </div>
          <div className="space-y-3">
            {dailyTasks.map((task) => (
              <div 
                key={task.id} 
                className={`border rounded-lg p-4 ${
                  task.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-gray-300 rounded-full mt-0.5 flex-shrink-0"></div>
                    )}
                    <div className="flex-1">
                      <p className={`font-medium ${task.completed ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                        {task.task}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-accent-600 font-semibold">+{task.points} points</span>
                        <span className="text-xs text-gray-500">= £{task.points} virtual money</span>
                      </div>
                    </div>
                  </div>
                  {!task.completed && (
                    <button className="ml-2 text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Start
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-accent-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Tip:</strong> Complete daily tasks to earn points and virtual money. Use virtual money to practice investing risk-free!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

