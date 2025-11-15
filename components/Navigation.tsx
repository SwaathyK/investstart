'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TrendingUp, LogOut, User } from 'lucide-react'

export default function Navigation() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check login status from localStorage
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem('brokee_logged_in') === 'true'
      setIsLoggedIn(loggedIn)
    }

    // Only check on client side
    if (typeof window !== 'undefined') {
      checkLoginStatus()

      // Listen for storage changes (in case user logs in/out in another tab)
      window.addEventListener('storage', checkLoginStatus)
      
      // Listen for custom login/logout events
      window.addEventListener('loginStatusChanged', checkLoginStatus)

      return () => {
        window.removeEventListener('storage', checkLoginStatus)
        window.removeEventListener('loginStatusChanged', checkLoginStatus)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('brokee_logged_in')
    setIsLoggedIn(false)
    // Trigger custom event for navigation update
    window.dispatchEvent(new Event('loginStatusChanged'))
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <TrendingUp className="h-8 w-8 text-primary-600" />
          <span className="text-2xl font-bold text-gray-900">Brokee</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/courses" className="text-gray-700 hover:text-primary-600 transition-colors">
            Courses
          </Link>
          {!isLoggedIn && (
            <Link href="/features" className="text-gray-700 hover:text-primary-600 transition-colors">
              Features
            </Link>
          )}
          <Link href="/competitions" className="text-gray-700 hover:text-primary-600 transition-colors">
            Competitions
          </Link>
          {isLoggedIn ? (
            <>
              <Link href="/simulation" className="text-gray-700 hover:text-primary-600 transition-colors">
                Simulation
              </Link>
              <Link 
                href="/dashboard" 
                className="text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-1"
              >
                <User className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                Login
              </Link>
              <Link 
                href="/signup" 
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

