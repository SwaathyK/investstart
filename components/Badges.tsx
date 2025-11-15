'use client'

import { useState, useEffect } from 'react'
import { Award, Trophy, Star, Medal, Crown, BookOpen, Target, TrendingUp } from 'lucide-react'

interface Badge {
  id: string
  name: string
  description: string
  iconName: string
  color: string
  earned: boolean
  earnedDate?: string
}

const iconMap: { [key: string]: any } = {
  BookOpen,
  Trophy,
  Star,
  Medal,
  Crown,
  Target,
  TrendingUp
}

export default function Badges() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkLogin = () => {
      const loggedIn = localStorage.getItem('brokee_logged_in') === 'true'
      setIsLoggedIn(loggedIn)
      
      if (!loggedIn) return

      // Load badges from localStorage
      const savedBadges = localStorage.getItem('brokee_badges')
      if (savedBadges) {
        try {
          const parsed = JSON.parse(savedBadges)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBadges(parsed)
          } else {
            initializeBadges()
          }
        } catch {
          initializeBadges()
        }
      } else {
        initializeBadges()
      }
    }

    const initializeBadges = () => {
      // Initialize default badges
      const defaultBadges: Badge[] = [
          {
            id: 'first_course',
            name: 'First Steps',
            description: 'Complete your first course',
            iconName: 'BookOpen',
            color: 'blue',
            earned: false
          },
          {
            id: 'course_master',
            name: 'Course Master',
            description: 'Complete 3 courses',
            iconName: 'Trophy',
            color: 'gold',
            earned: false
          },
          {
            id: 'knowledge_seeker',
            name: 'Knowledge Seeker',
            description: 'Complete 5 courses',
            iconName: 'Star',
            color: 'purple',
            earned: false
          },
          {
            id: 'investment_guru',
            name: 'Investment Guru',
            description: 'Complete 10 courses',
            iconName: 'Crown',
            color: 'red',
            earned: false
          },
          {
            id: 'streak_7',
            name: 'Week Warrior',
            description: 'Maintain a 7-day streak',
            iconName: 'Target',
            color: 'green',
            earned: false
          },
          {
            id: 'streak_30',
            name: 'Monthly Master',
            description: 'Maintain a 30-day streak',
            iconName: 'Medal',
            color: 'orange',
            earned: false
          },
          {
            id: 'virtual_trader',
            name: 'Virtual Trader',
            description: 'Make your first virtual trade',
            iconName: 'TrendingUp',
            color: 'teal',
            earned: false
          }
        ]
        localStorage.setItem('brokee_badges', JSON.stringify(defaultBadges))
        setBadges(defaultBadges)
    }

    // Badge checking function
    const checkAndUpdateBadges = () => {
      const savedBadges = localStorage.getItem('brokee_badges')
      if (!savedBadges) return
      
      try {
        let badges = JSON.parse(savedBadges)
        
        // Check course completion badges
        const completedCourses = parseInt(localStorage.getItem('brokee_completed_courses') || '0')
        badges = badges.map((badge: Badge) => {
          if (badge.id === 'first_course' && completedCourses >= 1 && !badge.earned) {
            return { ...badge, earned: true, earnedDate: new Date().toISOString() }
          }
          if (badge.id === 'course_master' && completedCourses >= 3 && !badge.earned) {
            return { ...badge, earned: true, earnedDate: new Date().toISOString() }
          }
          if (badge.id === 'knowledge_seeker' && completedCourses >= 5 && !badge.earned) {
            return { ...badge, earned: true, earnedDate: new Date().toISOString() }
          }
          if (badge.id === 'investment_guru' && completedCourses >= 10 && !badge.earned) {
            return { ...badge, earned: true, earnedDate: new Date().toISOString() }
          }
          return badge
        })
        
        // Check streak badges
        const savedStreak = localStorage.getItem('brokee_streak')
        if (savedStreak) {
          try {
            const streakData = JSON.parse(savedStreak)
            badges = badges.map((badge: Badge) => {
              if (badge.id === 'streak_7' && streakData.currentStreak >= 7 && !badge.earned) {
                return { ...badge, earned: true, earnedDate: new Date().toISOString() }
              }
              if (badge.id === 'streak_30' && streakData.currentStreak >= 30 && !badge.earned) {
                return { ...badge, earned: true, earnedDate: new Date().toISOString() }
              }
              return badge
            })
          } catch {
            // Ignore streak parse errors
          }
        }
        
        // Check trading badges
        const tradesCount = parseInt(localStorage.getItem('brokee_trades_count') || '0')
        badges = badges.map((badge: Badge) => {
          if (badge.id === 'virtual_trader' && tradesCount >= 1 && !badge.earned) {
            return { ...badge, earned: true, earnedDate: new Date().toISOString() }
          }
          return badge
        })
        
        localStorage.setItem('brokee_badges', JSON.stringify(badges))
        setBadges(badges)
      } catch {
        // Ignore parse errors
      }
    }

    checkLogin()
    
    // Check badges after login check
    setTimeout(() => {
      if (localStorage.getItem('brokee_logged_in') === 'true') {
        checkAndUpdateBadges()
      }
    }, 100)
    
    const handleLoginChange = () => {
      checkLogin()
      setTimeout(() => {
        if (localStorage.getItem('brokee_logged_in') === 'true') {
          checkAndUpdateBadges()
        }
      }, 100)
    }
    
    window.addEventListener('loginStatusChanged', handleLoginChange)
    window.addEventListener('courseCompleted', checkAndUpdateBadges)
    window.addEventListener('streakUpdated', checkAndUpdateBadges)
    window.addEventListener('tradingActivity', checkAndUpdateBadges)
    
    return () => {
      window.removeEventListener('loginStatusChanged', handleLoginChange)
      window.removeEventListener('courseCompleted', checkAndUpdateBadges)
      window.removeEventListener('streakUpdated', checkAndUpdateBadges)
      window.removeEventListener('tradingActivity', checkAndUpdateBadges)
    }
  }, [])

  if (!isLoggedIn) {
    return null
  }

  const earnedBadges = badges.filter(b => b.earned)
  const unearnedBadges = badges.filter(b => !b.earned)

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Award className="h-6 w-6 text-yellow-500" />
        <h2 className="text-2xl font-bold text-gray-900">Your Badges</h2>
      </div>

      {earnedBadges.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Earned ({earnedBadges.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {earnedBadges.map((badge) => {
              const Icon = iconMap[badge.iconName] || Award
              return (
                <div
                  key={badge.id}
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border-2 border-yellow-300 transform hover:scale-105 transition-all"
                >
                  <div className={`p-3 rounded-full mb-2 ${
                    badge.color === 'blue' ? 'bg-blue-500' :
                    badge.color === 'gold' ? 'bg-yellow-500' :
                    badge.color === 'purple' ? 'bg-purple-500' :
                    badge.color === 'red' ? 'bg-red-500' :
                    badge.color === 'green' ? 'bg-green-500' :
                    badge.color === 'orange' ? 'bg-orange-500' :
                    'bg-teal-500'
                  }`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 text-center">{badge.name}</p>
                  <p className="text-xs text-gray-600 text-center mt-1">{badge.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {unearnedBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Locked ({unearnedBadges.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {unearnedBadges.map((badge) => {
              const Icon = iconMap[badge.iconName] || Award
              return (
                <div
                  key={badge.id}
                  className="flex flex-col items-center p-4 bg-gray-100 rounded-lg border-2 border-gray-300 opacity-60"
                >
                  <div className="bg-gray-400 p-3 rounded-full mb-2">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 text-center">{badge.name}</p>
                  <p className="text-xs text-gray-500 text-center mt-1">{badge.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

