'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { 
  Trophy, 
  Users, 
  Building2, 
  GraduationCap, 
  Target, 
  TrendingUp,
  Award,
  Calendar,
  Filter,
  Search,
  Plus,
  Crown,
  Medal,
  ArrowRight,
  CheckCircle2
} from 'lucide-react'

interface Competition {
  id: number
  name: string
  type: 'local' | 'university' | 'monthly'
  category?: string
  university?: string
  participants: number
  prize: string
  endDate: string
  status: 'active' | 'upcoming' | 'ended'
  description: string
  challenge?: {
    startAmount: number
    targetAmount: number
    currentAmount?: number
  }
}

interface Clan {
  id: number
  name: string
  university: string
  members: number
  maxMembers: number
  category?: string
  rank: number
  totalPoints: number
}

export default function CompetitionsPage() {
  const [activeTab, setActiveTab] = useState<'competitions' | 'clans'>('competitions')
  const [filterType, setFilterType] = useState<'all' | 'local' | 'university' | 'monthly'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock competitions data
  const competitions: Competition[] = [
    {
      id: 1,
      name: 'Warwick MBA Investment Challenge',
      type: 'local',
      category: 'MBA',
      university: 'University of Warwick',
      participants: 45,
      prize: '£500 + Trophy',
      endDate: '2024-12-31',
      status: 'active',
      description: 'Exclusive competition for MBA students at Warwick. Test your investment skills!'
    },
    {
      id: 2,
      name: 'MSc Finance Championship',
      type: 'local',
      category: 'MSc',
      university: 'University of Warwick',
      participants: 32,
      prize: '£300 + Certificate',
      endDate: '2024-12-25',
      status: 'active',
      description: 'MSc Finance students compete for the top spot in virtual trading.'
    },
    {
      id: 3,
      name: 'Warwick Investment Championship',
      type: 'university',
      university: 'University of Warwick',
      participants: 156,
      prize: '£1,000 + University Trophy',
      endDate: '2025-01-15',
      status: 'active',
      description: 'University-wide competition for all Warwick students. Compete for the top spot!'
    },
    {
      id: 5,
      name: 'Warwick Business School Challenge',
      type: 'university',
      university: 'University of Warwick',
      participants: 89,
      prize: '£750 + Recognition',
      endDate: '2024-12-20',
      status: 'active',
      description: 'Open to all Warwick Business School students.'
    },
    {
      id: 6,
      name: 'Monthly Challenge: Double Your Money',
      type: 'monthly',
      university: 'University of Warwick',
      participants: 234,
      prize: '£100 + Badge',
      endDate: '2025-01-31',
      status: 'active',
      description: 'Turn £5 into £10 using virtual money. Complete this challenge to earn rewards!',
      challenge: {
        startAmount: 5,
        targetAmount: 10,
        currentAmount: 5
      }
    },
    {
      id: 7,
      name: 'Monthly Challenge: 10x Growth',
      type: 'monthly',
      university: 'University of Warwick',
      participants: 156,
      prize: '£200 + Premium Badge',
      endDate: '2025-01-31',
      status: 'active',
      description: 'Grow £10 into £100. Master advanced strategies to complete this challenge!',
      challenge: {
        startAmount: 10,
        targetAmount: 100,
        currentAmount: 10
      }
    },
    {
      id: 8,
      name: 'Monthly Challenge: Steady Growth',
      type: 'monthly',
      university: 'University of Warwick',
      participants: 189,
      prize: '£50 + Badge',
      endDate: '2025-01-31',
      status: 'active',
      description: 'Turn £20 into £30 with consistent, low-risk investments.',
      challenge: {
        startAmount: 20,
        targetAmount: 30,
        currentAmount: 20
      }
    }
  ]

  // Mock clans data
  const clans: Clan[] = [
    {
      id: 1,
      name: 'Warwick Warriors',
      university: 'University of Warwick',
      members: 12,
      maxMembers: 15,
      category: 'MBA',
      rank: 1,
      totalPoints: 15420
    },
    {
      id: 2,
      name: 'Warwick Finance Elite',
      university: 'University of Warwick',
      members: 15,
      maxMembers: 15,
      category: 'Mixed',
      rank: 2,
      totalPoints: 14230
    },
    {
      id: 3,
      name: 'MSc Masters',
      university: 'University of Warwick',
      members: 10,
      maxMembers: 12,
      category: 'MSc',
      rank: 3,
      totalPoints: 12890
    },
    {
      id: 4,
      name: 'Warwick Champions',
      university: 'University of Warwick',
      members: 14,
      maxMembers: 15,
      category: 'Mixed',
      rank: 4,
      totalPoints: 11560
    }
  ]

  const filteredCompetitions = competitions.filter(comp => {
    const matchesType = filterType === 'all' || comp.type === filterType
    const matchesCategory = filterCategory === 'all' || comp.category === filterCategory
    const matchesSearch = searchQuery === '' || 
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.university?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesCategory && matchesSearch
  })

  const filteredClans = clans.filter(clan => {
    const matchesCategory = filterCategory === 'all' || clan.category === filterCategory
    const matchesSearch = searchQuery === '' || 
      clan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clan.university.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Format date consistently to avoid hydration mismatch
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    // Use consistent format that works on both server and client
    const day = date.getDate()
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Investment Competitions</h1>
          <p className="text-gray-600">Compete with students from your university or across the UK</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('competitions')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'competitions'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-primary-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span>Competitions</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('clans')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'clans'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-primary-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Clans</span>
            </div>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search competitions or clans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
              >
                <option value="all">All Types</option>
                <option value="local">Local (Department)</option>
                <option value="university">University-wide</option>
                <option value="monthly">Monthly Challenges</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
              >
                <option value="all">All Categories</option>
                <option value="MBA">MBA</option>
                <option value="MSc">MSc</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Competitions Tab */}
        {activeTab === 'competitions' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Available Competitions</h2>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Create Competition</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompetitions.map((competition) => (
                <div
                  key={competition.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {competition.type === 'local' && (
                          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                            Local
                          </span>
                        )}
                        {competition.type === 'university' && (
                          <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded">
                            University
                          </span>
                        )}
                        {competition.type === 'monthly' && (
                          <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-1 rounded">
                            Monthly Challenge
                          </span>
                        )}
                        {competition.category && (
                          <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded">
                            {competition.category}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{competition.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{competition.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="h-4 w-4 mr-2" />
                      <span>{competition.university}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{competition.participants} participants</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Trophy className="h-4 w-4 mr-2" />
                      <span>{competition.prize}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Ends: {formatDate(competition.endDate)}</span>
                    </div>
                    {competition.challenge && (
                      <div className="mt-3 p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-orange-800">Challenge Progress</span>
                          <span className="text-xs font-bold text-orange-700">
                            £{competition.challenge.currentAmount || competition.challenge.startAmount} / £{competition.challenge.targetAmount}
                          </span>
                        </div>
                        <div className="w-full bg-orange-200 rounded-full h-2 mb-1">
                          <div 
                            className="bg-orange-600 h-2 rounded-full transition-all"
                            style={{ 
                              width: `${Math.min(((competition.challenge.currentAmount || competition.challenge.startAmount) / competition.challenge.targetAmount) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-orange-700 mt-1">
                          Start: £{competition.challenge.startAmount} → Target: £{competition.challenge.targetAmount}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        competition.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : competition.status === 'upcoming'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {competition.status.charAt(0).toUpperCase() + competition.status.slice(1)}
                    </span>
                    <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-semibold flex items-center space-x-1">
                      <span>Join</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clans Tab */}
        {activeTab === 'clans' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Join a Clan</h2>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Create Clan</span>
              </button>
            </div>

            <div className="space-y-4">
              {filteredClans.map((clan) => (
                <div
                  key={clan.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        {clan.rank === 1 && (
                          <Crown className="h-6 w-6 text-yellow-500" />
                        )}
                        {clan.rank === 2 && (
                          <Medal className="h-6 w-6 text-gray-400" />
                        )}
                        {clan.rank === 3 && (
                          <Medal className="h-6 w-6 text-orange-500" />
                        )}
                        <h3 className="text-xl font-bold text-gray-900">{clan.name}</h3>
                        <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-1 rounded">
                          #{clan.rank}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Building2 className="h-4 w-4 mr-2" />
                          <span>{clan.university}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{clan.members}/{clan.maxMembers} members</span>
                        </div>
                        {clan.category && (
                          <div className="flex items-center text-sm text-gray-600">
                            <GraduationCap className="h-4 w-4 mr-2" />
                            <span>{clan.category}</span>
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-600">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          <span>{clan.totalPoints.toLocaleString()} points</span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      {clan.members < clan.maxMembers ? (
                        <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center space-x-2">
                          <span>Join Clan</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          disabled
                          className="bg-gray-300 text-gray-500 px-6 py-3 rounded-lg cursor-not-allowed font-semibold"
                        >
                          Full
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Target className="h-6 w-6" />
              </div>
              <h4 className="font-semibold mb-2">Join Competitions</h4>
              <p className="text-sm opacity-90">
                Participate in local, university-wide, or inter-university competitions. Compete for prizes and recognition!
              </p>
            </div>
            <div>
              <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h4 className="font-semibold mb-2">Form Clans</h4>
              <p className="text-sm opacity-90">
                Create or join clans with your peers. Work together to climb the leaderboard and earn rewards.
              </p>
            </div>
            <div>
              <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6" />
              </div>
              <h4 className="font-semibold mb-2">Win Prizes</h4>
              <p className="text-sm opacity-90">
                Top performers win cash prizes, trophies, and recognition. Build your investment portfolio while competing!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

