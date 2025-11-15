'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TrendingUp, LogOut, User, ChevronDown, UserCircle } from 'lucide-react'

export default function Navigation() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileMenuOpen])

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
          {isLoggedIn && (
            <Link href="/competitions" className="text-gray-700 hover:text-primary-600 transition-colors">
              Competitions
            </Link>
          )}
          {!isLoggedIn && (
            <Link href="/features" className="text-gray-700 hover:text-primary-600 transition-colors">
              Features
            </Link>
          )}
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
              {/* Profile Menu */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                >
                  <UserCircle className="h-4 w-4" />
                  <span>Profile</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false)
                        // Placeholder for avatar creation - will be implemented later
                        router.push('/profile/avatar')
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                    >
                      <UserCircle className="h-4 w-4" />
                      <span>Create an avatar</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false)
                        handleLogout()
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
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

