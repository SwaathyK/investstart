'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Award, 
  ChevronDown, 
  ChevronRight,
  Play,
  Target,
  TrendingUp,
  Brain,
  Wrench,
  DollarSign
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import { coursesData, simulationScenarios, type Track, type Module } from '@/data/courses'

const trackIcons: Record<string, any> = {
  '💰': DollarSign,
  '📈': TrendingUp,
  '📊': Target,
  '🚀': TrendingUp,
  '🧠': Brain,
  '🛠️': Wrench,
}

export default function CoursesPage() {
  const [completedModules, setCompletedModules] = useState<number[]>([])
  const [expandedTracks, setExpandedTracks] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState<'courses' | 'simulations'>('courses')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('brokee_completed_modules')
      if (saved) {
        setCompletedModules(JSON.parse(saved))
      }
    }
  }, [])

  const handleCompleteModule = (moduleId: number) => {
    if (!completedModules.includes(moduleId)) {
      const newCompleted = [...completedModules, moduleId]
      setCompletedModules(newCompleted)
      localStorage.setItem('brokee_completed_modules', JSON.stringify(newCompleted))
      
      // Trigger course completion event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('courseCompleted'))
      }
    }
  }

  const toggleTrack = (trackId: number) => {
    setExpandedTracks(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    )
  }

  const getTrackColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      green: 'bg-green-50 border-green-200 text-green-700',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      orange: 'bg-orange-50 border-orange-200 text-orange-700',
      red: 'bg-red-50 border-red-200 text-red-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
    }
    return colors[color] || colors.blue
  }

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      Beginner: 'bg-green-100 text-green-700',
      Intermediate: 'bg-yellow-100 text-yellow-700',
      Advanced: 'bg-red-100 text-red-700',
    }
    return colors[level] || colors.Beginner
  }

  const totalModules = coursesData.reduce((sum, track) => sum + track.modules.length, 0)
  const completedCount = completedModules.length
  const progressPercentage = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Investment Courses</h1>
          <p className="text-xl text-gray-600 mb-6">
            Master investing from foundations to advanced strategies. Complete modules to earn badges and replenish virtual money!
          </p>
          
          {/* Progress Bar */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm font-semibold text-gray-900">{completedCount} / {totalModules} modules</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">{progressPercentage}% complete</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'courses'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Courses
            </button>
            <button
              onClick={() => setActiveTab('simulations')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'simulations'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Practice Simulations
            </button>
          </div>
        </div>

        {activeTab === 'courses' ? (
          <div className="space-y-6">
            {coursesData.map((track) => {
              const isExpanded = expandedTracks.includes(track.id)
              const completedInTrack = track.modules.filter(m => completedModules.includes(m.id)).length
              const trackProgress = track.modules.length > 0 
                ? Math.round((completedInTrack / track.modules.length) * 100) 
                : 0
              const TrackIcon = trackIcons[track.icon] || BookOpen

              return (
                <div 
                  key={track.id} 
                  className={`bg-white rounded-xl shadow-lg border-2 ${getTrackColorClasses(track.color)}`}
                >
                  <button
                    onClick={() => toggleTrack(track.id)}
                    className="w-full p-6 flex items-center justify-between hover:bg-opacity-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{track.icon}</div>
                      <div className="text-left">
                        <h2 className="text-2xl font-bold mb-1">{track.title}</h2>
                        <p className="text-sm opacity-80">{track.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs font-medium">
                            {completedInTrack} / {track.modules.length} modules
                          </span>
                          <div className="w-32 bg-white bg-opacity-50 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all ${getTrackColorClasses(track.color).split(' ')[0]}`}
                              style={{ width: `${trackProgress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-6 w-6" />
                    ) : (
                      <ChevronRight className="h-6 w-6" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 space-y-4">
                      {track.modules.map((module) => {
                        const isCompleted = completedModules.includes(module.id)
                        return (
                          <div 
                            key={module.id}
                            className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <BookOpen className="h-5 w-5 text-gray-500" />
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    Module {module.id}: {module.title}
                                  </h3>
                                  {isCompleted && (
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                  )}
                                </div>
                                <p className="text-gray-600 text-sm mb-3">{module.description}</p>
                                
                                <div className="flex flex-wrap gap-2 mb-3">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(module.level)}`}>
                                    {module.level}
                                  </span>
                                  <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                                    <Clock className="h-3 w-3" />
                                    {module.duration}
                                  </span>
                                </div>

                                <div className="mb-3">
                                  <p className="text-xs font-semibold text-gray-700 mb-2">Topics Covered:</p>
                                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    {module.topics.map((topic, idx) => (
                                      <li key={idx}>{topic.title}</li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-3">
                                  <p className="text-xs font-semibold text-blue-900 mb-1">Learning Outcome:</p>
                                  <p className="text-sm text-blue-800">{module.outcome}</p>
                                </div>
                              </div>
                            </div>
                            
                            {isCompleted ? (
                              <div className="flex items-center space-x-2 text-green-600 font-semibold">
                                <Award className="h-5 w-5" />
                                <span>Completed!</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleCompleteModule(module.id)}
                                className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center gap-2"
                              >
                                <Play className="h-4 w-4" />
                                Start Module
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Practice Simulations</h2>
              <p className="text-gray-600">
                Test your knowledge in realistic market scenarios. Make decisions and see how they play out over time.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {simulationScenarios.map((scenario) => {
                const difficultyColors: Record<string, string> = {
                  Beginner: 'bg-green-100 text-green-700',
                  Intermediate: 'bg-yellow-100 text-yellow-700',
                  Advanced: 'bg-red-100 text-red-700',
                }

                return (
                  <div 
                    key={scenario.id}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{scenario.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{scenario.description}</p>
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`px-3 py-1 rounded text-xs font-medium ${difficultyColors[scenario.difficulty]}`}>
                            {scenario.difficulty}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {scenario.duration}
                          </span>
                          <span className="text-xs text-gray-500">
                            {scenario.rounds} rounds
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/practice?scenario=${scenario.id}`}
                      className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      Start Simulation
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

