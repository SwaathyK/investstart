'use client'

import { useState, useEffect } from 'react'
import { X, Flame, Trophy, Calendar } from 'lucide-react'

interface StreakData {
  currentStreak: number
  lastVisitDate: string
  longestStreak: number
}

export default function DailyStreak() {
  const [showPopup, setShowPopup] = useState(false)
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    lastVisitDate: '',
    longestStreak: 0
  })

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    const checkAndShowStreak = () => {
      // Check if user is logged in
      const isLoggedIn = localStorage.getItem('brokee_logged_in') === 'true'
      
      // Only show streak popup if user is logged in
      if (!isLoggedIn) {
        setShowPopup(false)
        return
      }

      // Load streak data from localStorage
      const savedStreak = localStorage.getItem('brokee_streak')
      const today = new Date().toDateString()
      
      if (savedStreak) {
        try {
          const data: StreakData = JSON.parse(savedStreak)
          const lastVisit = new Date(data.lastVisitDate).toDateString()
          const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
          
          // Check if user visited today
          if (lastVisit === today) {
            // Already visited today, don't show popup
            setStreakData(data)
            setShowPopup(false)
            return
          }
          
          // Check if user visited yesterday (maintain streak)
          if (lastVisit === yesterday) {
            // Continue streak
            const newStreak = data.currentStreak + 1
            const newData: StreakData = {
              currentStreak: newStreak,
              lastVisitDate: today,
              longestStreak: Math.max(newStreak, data.longestStreak)
            }
            localStorage.setItem('brokee_streak', JSON.stringify(newData))
            setStreakData(newData)
            setShowPopup(true)
          } else {
            // Streak broken, reset to 1
            const newData: StreakData = {
              currentStreak: 1,
              lastVisitDate: today,
              longestStreak: data.longestStreak
            }
            localStorage.setItem('brokee_streak', JSON.stringify(newData))
            setStreakData(newData)
            setShowPopup(true)
          }
        } catch (e) {
          // Invalid data, reset
          const newData: StreakData = {
            currentStreak: 1,
            lastVisitDate: today,
            longestStreak: 1
          }
          localStorage.setItem('brokee_streak', JSON.stringify(newData))
          setStreakData(newData)
          setShowPopup(true)
        }
      } else {
        // First visit ever
        const newData: StreakData = {
          currentStreak: 1,
          lastVisitDate: today,
          longestStreak: 1
        }
        localStorage.setItem('brokee_streak', JSON.stringify(newData))
        setStreakData(newData)
        setShowPopup(true)
      }
    }

    // Check on mount
    checkAndShowStreak()

    // Listen for login event to show streak popup
    const handleShowStreak = () => {
      checkAndShowStreak()
    }

    window.addEventListener('showStreakPopup', handleShowStreak)

    return () => {
      window.removeEventListener('showStreakPopup', handleShowStreak)
    }
  }, [])

  const handleClose = () => {
    setShowPopup(false)
  }

  if (!showPopup) return null

  const isNewStreak = streakData.currentStreak === 1
  const isMilestone = streakData.currentStreak > 0 && streakData.currentStreak % 7 === 0

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-slide-up">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          {/* Fire Icon */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-full p-6 animate-pulse">
                <Flame className="h-12 w-12 text-white" />
              </div>
              {isMilestone && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2 animate-bounce">
                  <Trophy className="h-6 w-6 text-yellow-800" />
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isNewStreak ? 'Welcome Back!' : `${streakData.currentStreak} Day Streak!`}
          </h2>

          {/* Subtitle */}
          <p className="text-lg text-gray-600 mb-6">
            {isNewStreak 
              ? "You're starting your learning journey today! 🔥"
              : isMilestone
              ? `Amazing! You've learned for ${streakData.currentStreak} days in a row! 🎉`
              : `Keep it up! You're on fire! 🔥`
            }
          </p>

          {/* Streak Info */}
          <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-semibold text-gray-700">Current Streak</span>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {streakData.currentStreak} {streakData.currentStreak === 1 ? 'Day' : 'Days'}
            </div>
            {streakData.longestStreak > streakData.currentStreak && (
              <p className="text-sm text-gray-500 mt-2">
                Best: {streakData.longestStreak} days
              </p>
            )}
          </div>

          {/* Motivational Message */}
          <div className="bg-primary-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              {isNewStreak
                ? "Consistency is key to mastering investing. Come back tomorrow to keep your streak alive!"
                : "You're building great habits! Return tomorrow to continue your streak."
              }
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-primary-700 hover:to-accent-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Let&apos;s Keep Learning!
          </button>
        </div>
      </div>
    </div>
  )
}

