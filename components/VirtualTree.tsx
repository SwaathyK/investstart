'use client'

import { useState, useEffect } from 'react'
import { Sprout, Leaf, TreePine, Award } from 'lucide-react'

interface StreakData {
  currentStreak: number
  lastVisitDate: string
  longestStreak: number
}

export default function VirtualTree() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    lastVisitDate: '',
    longestStreak: 0
  })
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkLogin = () => {
      const loggedIn = localStorage.getItem('brokee_logged_in') === 'true'
      setIsLoggedIn(loggedIn)
      
      if (!loggedIn) return

      // Load and update streak data
      const savedStreak = localStorage.getItem('brokee_streak')
      const today = new Date().toDateString()
      
      if (savedStreak) {
        const data: StreakData = JSON.parse(savedStreak)
        const lastVisit = new Date(data.lastVisitDate).toDateString()
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
        
        // Check if user visited today
        if (lastVisit === today) {
          // Already visited today
          setStreakData(data)
        } else if (lastVisit === yesterday) {
          // Continue streak
          const newStreak = data.currentStreak + 1
          const newData: StreakData = {
            currentStreak: newStreak,
            lastVisitDate: today,
            longestStreak: Math.max(newStreak, data.longestStreak)
          }
          localStorage.setItem('brokee_streak', JSON.stringify(newData))
          setStreakData(newData)
          // Trigger streak update event for badges
          window.dispatchEvent(new Event('streakUpdated'))
        } else {
          // Streak broken, reset to 1
          const newData: StreakData = {
            currentStreak: 1,
            lastVisitDate: today,
            longestStreak: data.longestStreak
          }
          localStorage.setItem('brokee_streak', JSON.stringify(newData))
          setStreakData(newData)
          window.dispatchEvent(new Event('streakUpdated'))
        }
      } else {
        // First visit
        const newData: StreakData = {
          currentStreak: 1,
          lastVisitDate: today,
          longestStreak: 1
        }
        localStorage.setItem('brokee_streak', JSON.stringify(newData))
        setStreakData(newData)
        window.dispatchEvent(new Event('streakUpdated'))
      }
    }

    checkLogin()
    window.addEventListener('loginStatusChanged', checkLogin)
    
    return () => {
      window.removeEventListener('loginStatusChanged', checkLogin)
    }
  }, [])

  if (!isLoggedIn) {
    return null
  }

  // Tree growth stages based on streak
  const getTreeStage = (streak: number) => {
    if (streak === 0) return 0
    if (streak <= 3) return 1  // Seedling
    if (streak <= 7) return 2  // Small tree
    if (streak <= 14) return 3 // Medium tree
    if (streak <= 30) return 4 // Large tree
    if (streak <= 60) return 5 // Mature tree
    return 6 // Ancient tree
  }

  const treeStage = getTreeStage(streakData.currentStreak)
  const nextMilestone = streakData.currentStreak < 3 ? 3 : 
                        streakData.currentStreak < 7 ? 7 :
                        streakData.currentStreak < 14 ? 14 :
                        streakData.currentStreak < 30 ? 30 :
                        streakData.currentStreak < 60 ? 60 : 90

  const progressToNext = streakData.currentStreak < 3 ? (streakData.currentStreak / 3) * 100 :
                         streakData.currentStreak < 7 ? ((streakData.currentStreak - 3) / 4) * 100 :
                         streakData.currentStreak < 14 ? ((streakData.currentStreak - 7) / 7) * 100 :
                         streakData.currentStreak < 30 ? ((streakData.currentStreak - 14) / 16) * 100 :
                         streakData.currentStreak < 60 ? ((streakData.currentStreak - 30) / 30) * 100 :
                         ((streakData.currentStreak - 60) / 30) * 100

  const renderTree = () => {
    const size = 200 + (treeStage * 30)
    const trunkHeight = 40 + (treeStage * 10)
    const trunkWidth = 20 + (treeStage * 5)
    
    return (
      <div className="relative flex flex-col items-center justify-end" style={{ height: `${size}px` }}>
        {/* Tree Crown */}
        <div className="relative mb-2">
          {treeStage >= 1 && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <div className="w-16 h-16 bg-green-500 rounded-full opacity-80"></div>
            </div>
          )}
          {treeStage >= 2 && (
            <>
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 -ml-8">
                <div className="w-12 h-12 bg-green-600 rounded-full opacity-90"></div>
              </div>
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 ml-8">
                <div className="w-12 h-12 bg-green-600 rounded-full opacity-90"></div>
              </div>
            </>
          )}
          {treeStage >= 3 && (
            <>
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 -ml-12">
                <div className="w-10 h-10 bg-green-700 rounded-full opacity-80"></div>
              </div>
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 ml-12">
                <div className="w-10 h-10 bg-green-700 rounded-full opacity-80"></div>
              </div>
              <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
                <div className="w-14 h-14 bg-green-500 rounded-full opacity-85"></div>
              </div>
            </>
          )}
          {treeStage >= 4 && (
            <>
              <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 -ml-16">
                <div className="w-12 h-12 bg-green-600 rounded-full opacity-75"></div>
              </div>
              <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 ml-16">
                <div className="w-12 h-12 bg-green-600 rounded-full opacity-75"></div>
              </div>
              <div className="absolute -top-28 left-1/2 transform -translate-x-1/2 -ml-8">
                <div className="w-10 h-10 bg-green-700 rounded-full opacity-80"></div>
              </div>
              <div className="absolute -top-28 left-1/2 transform -translate-x-1/2 ml-8">
                <div className="w-10 h-10 bg-green-700 rounded-full opacity-80"></div>
              </div>
            </>
          )}
          {treeStage >= 5 && (
            <>
              <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 -ml-20">
                <div className="w-14 h-14 bg-green-500 rounded-full opacity-70"></div>
              </div>
              <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 ml-20">
                <div className="w-14 h-14 bg-green-500 rounded-full opacity-70"></div>
              </div>
              <div className="absolute -top-36 left-1/2 transform -translate-x-1/2">
                <div className="w-16 h-16 bg-green-600 rounded-full opacity-75"></div>
              </div>
            </>
          )}
          {treeStage >= 6 && (
            <>
              <div className="absolute -top-40 left-1/2 transform -translate-x-1/2 -ml-24">
                <div className="w-16 h-16 bg-green-700 rounded-full opacity-65"></div>
              </div>
              <div className="absolute -top-40 left-1/2 transform -translate-x-1/2 ml-24">
                <div className="w-16 h-16 bg-green-700 rounded-full opacity-65"></div>
              </div>
              <div className="absolute -top-44 left-1/2 transform -translate-x-1/2 -ml-12">
                <div className="w-12 h-12 bg-green-600 rounded-full opacity-70"></div>
              </div>
              <div className="absolute -top-44 left-1/2 transform -translate-x-1/2 ml-12">
                <div className="w-12 h-12 bg-green-600 rounded-full opacity-70"></div>
              </div>
              <div className="absolute -top-48 left-1/2 transform -translate-x-1/2">
                <div className="w-20 h-20 bg-green-500 rounded-full opacity-70"></div>
              </div>
            </>
          )}
        </div>

        {/* Trunk */}
        <div 
          className="bg-amber-800 rounded-t-lg"
          style={{ 
            width: `${trunkWidth}px`, 
            height: `${trunkHeight}px`,
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)'
          }}
        ></div>

        {/* Ground */}
        <div className="w-64 h-4 bg-green-700 rounded-full mt-2"></div>
      </div>
    )
  }

  const getStageName = (stage: number) => {
    const names = [
      'No Tree',
      'Seedling',
      'Sapling',
      'Young Tree',
      'Growing Tree',
      'Mature Tree',
      'Ancient Tree'
    ]
    return names[stage] || 'No Tree'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <TreePine className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">Your Investment Tree</h2>
        </div>
        {treeStage >= 6 && (
          <Award className="h-6 w-6 text-yellow-500" />
        )}
      </div>

      <p className="text-sm text-gray-600 mb-2">
        Your tree grows with each daily visit! Keep your streak alive to watch it flourish.
      </p>

      {/* Tree Display */}
      <div className="flex justify-center items-center my-6 bg-gradient-to-b from-sky-100 to-green-50 rounded-lg p-8 min-h-[300px] relative">
        {/* Silhouette of fully grown tree (behind) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="relative" style={{ height: '400px', width: '300px' }}>
            {/* Fully grown tree silhouette */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
              {/* Large crown silhouette */}
              <div className="absolute -top-48 left-1/2 transform -translate-x-1/2 -ml-24">
                <div className="w-16 h-16 bg-gray-800 rounded-full"></div>
              </div>
              <div className="absolute -top-48 left-1/2 transform -translate-x-1/2 ml-24">
                <div className="w-16 h-16 bg-gray-800 rounded-full"></div>
              </div>
              <div className="absolute -top-44 left-1/2 transform -translate-x-1/2 -ml-12">
                <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
              </div>
              <div className="absolute -top-44 left-1/2 transform -translate-x-1/2 ml-12">
                <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
              </div>
              <div className="absolute -top-40 left-1/2 transform -translate-x-1/2 -ml-20">
                <div className="w-14 h-14 bg-gray-800 rounded-full"></div>
              </div>
              <div className="absolute -top-40 left-1/2 transform -translate-x-1/2 ml-20">
                <div className="w-14 h-14 bg-gray-800 rounded-full"></div>
              </div>
              <div className="absolute -top-36 left-1/2 transform -translate-x-1/2">
                <div className="w-20 h-20 bg-gray-800 rounded-full"></div>
              </div>
              <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 -ml-16">
                <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
              </div>
              <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 ml-16">
                <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
              </div>
              {/* Trunk silhouette */}
              <div className="w-8 h-20 bg-gray-800 rounded-t-lg"></div>
            </div>
          </div>
        </div>
        
        {treeStage === 0 ? (
          <div className="text-center relative z-10">
            <Sprout className="h-16 w-16 text-green-500 mx-auto mb-4 opacity-50" />
            <p className="text-gray-500">Start your journey to grow your tree!</p>
            <p className="text-sm text-gray-400 mt-2">Visit daily to plant your first seed.</p>
          </div>
        ) : (
          <div className="relative z-10">
            {renderTree()}
          </div>
        )}
      </div>

      {/* Tree Info */}
      <div className="space-y-4">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Current Stage</span>
            <span className="text-lg font-bold text-green-700">{getStageName(treeStage)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Leaf className="h-4 w-4" />
            <span>{streakData.currentStreak} day{streakData.currentStreak !== 1 ? 's' : ''} streak</span>
          </div>
        </div>

        {/* Progress to Next Stage */}
        {treeStage < 6 && (
          <div className="bg-primary-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Next Milestone</span>
              <span className="text-sm font-bold text-primary-700">{nextMilestone} days</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressToNext, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600">
              {nextMilestone - streakData.currentStreak} more day{nextMilestone - streakData.currentStreak !== 1 ? 's' : ''} until {getStageName(treeStage + 1)}
            </p>
          </div>
        )}

        {/* Achievements */}
        {streakData.longestStreak > streakData.currentStreak && (
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">Best Streak</p>
                <p className="text-xs text-yellow-700">{streakData.longestStreak} days - Keep it up!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

