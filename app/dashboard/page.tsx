'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import VirtualTree from '@/components/VirtualTree'
import Badges from '@/components/Badges'
import { 
  DollarSign, 
  TrendingUp, 
  BookOpen, 
  Gamepad2, 
  Target, 
  ArrowRight,
  Wallet,
  PieChart,
  Zap,
  Award,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showRealMoney, setShowRealMoney] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const checkLogin = () => {
      if (typeof window === 'undefined') return
      const loggedIn = localStorage.getItem('brokee_logged_in') === 'true'
      setIsLoggedIn(loggedIn)
      if (!loggedIn) {
        router.push('/login')
      }
    }

    checkLogin()
    window.addEventListener('loginStatusChanged', checkLogin)
    
    return () => {
      window.removeEventListener('loginStatusChanged', checkLogin)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load real money from localStorage
  const [realBalance, setRealBalance] = useState(0.00)
  const [coursesCompleted, setCoursesCompleted] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Load real money balance
    const savedRealBalance = localStorage.getItem('brokee_real_balance')
    if (savedRealBalance) {
      setRealBalance(parseFloat(savedRealBalance))
    } else {
      setRealBalance(0.00)
      localStorage.setItem('brokee_real_balance', '0.00')
    }

    // Load completed courses count
    const savedCourses = localStorage.getItem('brokee_completed_courses')
    if (savedCourses) {
      setCoursesCompleted(parseInt(savedCourses))
    }

    // Listen for course completion
    const handleCourseComplete = () => {
      const current = parseInt(localStorage.getItem('brokee_completed_courses') || '0')
      const newCount = current + 1
      setCoursesCompleted(newCount)
      localStorage.setItem('brokee_completed_courses', newCount.toString())
      
      // Replenish virtual money if needed (every 2-3 courses)
      if (newCount % 2 === 0 || newCount % 3 === 0) {
        const currentBalance = parseFloat(localStorage.getItem('brokee_virtual_balance') || '1000.00')
        if (currentBalance < 1000.00) {
          const replenishAmount = Math.min(1000.00 - currentBalance, 500.00)
          const newBalance = currentBalance + replenishAmount
          localStorage.setItem('brokee_virtual_balance', newBalance.toFixed(2))
          // Trigger event for simulation page to update
          window.dispatchEvent(new Event('virtualBalanceUpdated'))
        }
      }

      // Trigger badge update event
      window.dispatchEvent(new Event('courseCompleted'))
    }

    window.addEventListener('courseCompleted', handleCourseComplete)
    return () => {
      window.removeEventListener('courseCompleted', handleCourseComplete)
    }
  }, [])

  // Mock data - in real app, this would come from API
  const portfolioValue = 1050.00
  const portfolioChange = 5.0

  // Investment breakdown data (in GBP)
  const investments = {
    stocks: 350.00,
    etfs: 400.00,
    isa: 200.00,
    bonds: 100.00
  }

  const totalInvested = investments.stocks + investments.etfs + investments.isa + investments.bonds

  const dailyTasks = [
    { id: 1, task: 'Complete a mini-course lesson', points: 50, completed: false },
    { id: 2, task: 'Make your first simulation trade', points: 100, completed: false },
    { id: 3, task: 'Check your portfolio', points: 25, completed: true },
    { id: 4, task: 'Read investment tips', points: 30, completed: false },
  ]

  const courses = [
    { id: 1, title: 'Investing Basics', progress: 0, duration: '30 min', level: 'Beginner' },
    { id: 2, title: 'Stock Market Fundamentals', progress: 0, duration: '45 min', level: 'Beginner' },
    { id: 3, title: 'Risk Management', progress: 0, duration: '25 min', level: 'Intermediate' },
  ]

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
          <p className="text-gray-600">Continue your investment learning journey</p>
        </div>

        {/* Balance Card */}
        <div className="mb-8">
          {/* Real Money Balance */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-primary-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Wallet className="h-6 w-6 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">Real Money</h3>
              </div>
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Actual</span>
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-gray-900">
                  {showRealMoney ? `£${realBalance.toFixed(2)}` : '£****'}
                </p>
                <button
                  onClick={() => setShowRealMoney(!showRealMoney)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={showRealMoney ? 'Hide balance' : 'Show balance'}
                >
                  {showRealMoney ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">Available Balance</p>
            </div>
            <Link
              href="/invest/real"
              className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 font-semibold"
            >
              <DollarSign className="h-5 w-5" />
              <span>Invest Real Money</span>
            </Link>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <PieChart className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Portfolio</h2>
            </div>
            <Link href="/portfolio" className="text-primary-600 hover:text-primary-700 flex items-center space-x-1">
              <span>View Details</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-primary-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">£{portfolioValue.toFixed(2)}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Today&apos;s Change</p>
              <p className="text-2xl font-bold text-green-600">+{portfolioChange}%</p>
            </div>
            <div className="bg-accent-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Return</p>
              <p className="text-2xl font-bold text-accent-600">+£50.00</p>
            </div>
          </div>
          
          {/* Investment Breakdown Pie Chart */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Breakdown</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pie Chart Visualization */}
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="20"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="20"
                      strokeDasharray={`${(investments.stocks / totalInvested) * 251.2} 251.2`}
                      strokeDashoffset="0"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#c026d3"
                      strokeWidth="20"
                      strokeDasharray={`${(investments.etfs / totalInvested) * 251.2} 251.2`}
                      strokeDashoffset={`-${(investments.stocks / totalInvested) * 251.2}`}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="20"
                      strokeDasharray={`${(investments.isa / totalInvested) * 251.2} 251.2`}
                      strokeDashoffset={`-${((investments.stocks + investments.etfs) / totalInvested) * 251.2}`}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="20"
                      strokeDasharray={`${(investments.bonds / totalInvested) * 251.2} 251.2`}
                      strokeDashoffset={`-${((investments.stocks + investments.etfs + investments.isa) / totalInvested) * 251.2}`}
                    />
                  </svg>
                </div>
              </div>
              
              {/* Legend */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-primary-600 rounded"></div>
                    <span className="font-medium text-gray-900">Stocks</span>
                  </div>
                  <span className="font-semibold text-gray-900">£{investments.stocks.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-accent-600 rounded"></div>
                    <span className="font-medium text-gray-900">ETFs</span>
                  </div>
                  <span className="font-semibold text-gray-900">£{investments.etfs.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="font-medium text-gray-900">ISA</span>
                  </div>
                  <span className="font-semibold text-gray-900">£{investments.isa.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span className="font-medium text-gray-900">Bonds</span>
                  </div>
                  <span className="font-semibold text-gray-900">£{investments.bonds.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg border-2 border-gray-300">
                  <span className="font-semibold text-gray-900">Total Invested</span>
                  <span className="font-bold text-gray-900">£{totalInvested.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Virtual Tree Section */}
        <div className="mb-8">
          <VirtualTree />
        </div>

        {/* Badges Section */}
        <div className="mb-8">
          <Badges />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Mini Courses Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-primary-600" />
                <h2 className="text-2xl font-bold text-gray-900">Mini Courses</h2>
              </div>
              <Link href="/courses" className="text-primary-600 hover:text-primary-700 text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{course.title}</h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Zap className="h-4 w-4" />
                          <span>{course.duration}</span>
                        </span>
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">{course.level}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <Link
                      href={`/courses/${course.id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <span>Start Learning</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Tasks Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Target className="h-6 w-6 text-accent-600" />
                <h2 className="text-2xl font-bold text-gray-900">Daily Tasks</h2>
              </div>
              <div className="flex items-center space-x-2 text-accent-600">
                <Award className="h-5 w-5" />
                <span className="font-semibold">Earn Points</span>
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
                          <span className="text-xs text-gray-500">= £{task.points} points</span>
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
                <strong>Tip:</strong> Complete daily tasks to earn points. Visit the <Link href="/simulation" className="text-primary-600 hover:text-primary-700 font-semibold">Simulation page</Link> to manage your virtual money and practice investing!
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/simulation"
              className="bg-white/20 hover:bg-white/30 rounded-lg p-4 transition-colors backdrop-blur-sm"
            >
              <Gamepad2 className="h-8 w-8 mb-2" />
              <h4 className="font-semibold mb-1">Virtual Money</h4>
              <p className="text-sm opacity-90">Manage simulation funds</p>
            </Link>
            <Link
              href="/courses"
              className="bg-white/20 hover:bg-white/30 rounded-lg p-4 transition-colors backdrop-blur-sm"
            >
              <BookOpen className="h-8 w-8 mb-2" />
              <h4 className="font-semibold mb-1">Learn More</h4>
              <p className="text-sm opacity-90">Explore courses</p>
            </Link>
            <Link
              href="/portfolio"
              className="bg-white/20 hover:bg-white/30 rounded-lg p-4 transition-colors backdrop-blur-sm"
            >
              <TrendingUp className="h-8 w-8 mb-2" />
              <h4 className="font-semibold mb-1">View Portfolio</h4>
              <p className="text-sm opacity-90">Track performance</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

