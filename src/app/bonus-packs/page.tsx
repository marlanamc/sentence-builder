'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Home, Gift, Star, Lock, Trophy, Calendar, Users, Target, Zap } from 'lucide-react'

export default function BonusPacksPage() {
  const router = useRouter()
  const [userStats, setUserStats] = useState({
    points: 180,
    streak: 3,
    completedLevels: [1],
    achievements: [] as string[]
  })

  useEffect(() => {
    const savedStats = localStorage.getItem('userStats')
    if (savedStats) {
      setUserStats(JSON.parse(savedStats))
    }
  }, [])

  const bonusPacks = [
    {
      id: 'daily-challenge',
      name: 'Daily Challenge',
      description: 'Complete today\'s special grammar challenge',
      icon: Calendar,
      color: 'from-blue-400 to-blue-600',
      difficulty: 'Mixed',
      duration: '10 minutes',
      reward: '50 XP + Bonus Badge',
      unlocked: true,
      available: true,
      type: 'daily'
    },
    {
      id: 'speed-round',
      name: 'Speed Round',
      description: 'Answer 20 questions as fast as possible',
      icon: Zap,
      color: 'from-yellow-400 to-orange-500',
      difficulty: 'Easy-Medium',
      duration: '5 minutes',
      reward: '75 XP',
      unlocked: userStats.points >= 200,
      available: true,
      type: 'speed'
    },
    {
      id: 'perfect-streak',
      name: 'Perfect Streak',
      description: 'Get 15 questions correct in a row',
      icon: Target,
      color: 'from-green-400 to-emerald-600',
      difficulty: 'Medium',
      duration: '15 minutes',
      reward: '100 XP + Achievement',
      unlocked: userStats.streak >= 5,
      available: true,
      type: 'challenge'
    },
    {
      id: 'grammar-master',
      name: 'Grammar Master',
      description: 'Advanced mixed grammar challenges',
      icon: Star,
      color: 'from-purple-400 to-indigo-600',
      difficulty: 'Hard',
      duration: '20 minutes',
      reward: '150 XP + Master Badge',
      unlocked: userStats.completedLevels.length >= 10,
      available: true,
      type: 'advanced'
    },
    {
      id: 'team-challenge',
      name: 'Team Challenge',
      description: 'Compete with other learners worldwide',
      icon: Users,
      color: 'from-pink-400 to-red-500',
      difficulty: 'Mixed',
      duration: 'Ongoing',
      reward: 'Leaderboard Position',
      unlocked: false,
      available: false,
      type: 'multiplayer',
      comingSoon: true
    },
    {
      id: 'weekly-tournament',
      name: 'Weekly Tournament',
      description: 'Join this week\'s grammar tournament',
      icon: Trophy,
      color: 'from-amber-400 to-yellow-600',
      difficulty: 'All Levels',
      duration: '1 week',
      reward: 'Tournament Prizes',
      unlocked: false,
      available: false,
      type: 'tournament',
      comingSoon: true
    }
  ]

  const startBonusPack = (packId: string) => {
    switch (packId) {
      case 'daily-challenge':
        router.push('/game/daily-challenge')
        break
      case 'speed-round':
        router.push('/game/quick-match')
        break
      case 'perfect-streak':
        router.push('/game/perfect-streak')
        break
      case 'grammar-master':
        router.push('/game/grammar-master')
        break
      default:
        console.log('Pack not yet implemented:', packId)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Easy-Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Medium': return 'bg-orange-100 text-orange-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      case 'Mixed': return 'bg-purple-100 text-purple-800'
      case 'All Levels': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const availablePacks = bonusPacks.filter(pack => pack.available)
  const comingSoonPacks = bonusPacks.filter(pack => pack.comingSoon)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <Card className="border-2 border-blue-200 bg-white/80 backdrop-blur">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/')}
                  className="flex items-center space-x-2 bg-white/80"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="flex items-center space-x-1 bg-yellow-100 text-yellow-800">
                  <Trophy className="w-4 h-4" />
                  <span>{userStats.points} XP</span>
                </Badge>
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                <Gift className="w-8 h-8 inline-block mr-2" />
                Bonus Packs
              </h1>
              <p className="text-gray-600">Special challenges and extra practice opportunities</p>
            </div>
          </div>
        </Card>

        {/* Available Bonus Packs */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Now</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availablePacks.map((pack) => (
                <Card
                  key={pack.id}
                  className={`p-6 ${pack.unlocked ? 'bg-white/80 hover:shadow-xl cursor-pointer' : 'bg-gray-100/50'} backdrop-blur shadow-lg transition-all transform hover:scale-105`}
                  onClick={() => pack.unlocked && startBonusPack(pack.id)}
                >
                  <div className="space-y-4">
                    {/* Icon and Title */}
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${pack.color} flex items-center justify-center shadow-lg ${!pack.unlocked ? 'grayscale' : ''}`}>
                        {pack.unlocked ? (
                          <pack.icon className="w-8 h-8 text-white" />
                        ) : (
                          <Lock className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold ${pack.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                          {pack.name}
                        </h3>
                        {!pack.unlocked && (
                          <Badge variant="secondary" className="bg-gray-200 text-gray-600 mt-1">
                            <Lock className="w-3 h-3 mr-1" />
                            Locked
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className={`${pack.unlocked ? 'text-gray-600' : 'text-gray-500'}`}>
                      {pack.description}
                    </p>

                    {/* Details */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Difficulty:</span>
                        <Badge className={getDifficultyColor(pack.difficulty)}>
                          {pack.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Duration:</span>
                        <span className="text-sm font-medium">{pack.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Reward:</span>
                        <span className="text-sm font-medium text-green-600">{pack.reward}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    {pack.unlocked ? (
                      <Button
                        className={`w-full bg-gradient-to-r ${pack.color} text-white font-semibold shadow-md hover:shadow-lg`}
                        onClick={(e) => {
                          e.stopPropagation()
                          startBonusPack(pack.id)
                        }}
                      >
                        Start Challenge
                      </Button>
                    ) : (
                      <div className="text-center py-2">
                        <p className="text-xs text-gray-500">
                          {pack.id === 'speed-round' && 'Earn 200 XP to unlock'}
                          {pack.id === 'perfect-streak' && 'Build a 5-day streak to unlock'}
                          {pack.id === 'grammar-master' && 'Complete 10 levels to unlock'}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Coming Soon */}
          {comingSoonPacks.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {comingSoonPacks.map((pack) => (
                  <Card
                    key={pack.id}
                    className="p-6 bg-gray-50/50 backdrop-blur shadow-lg opacity-75"
                  >
                    <div className="space-y-4">
                      {/* Icon and Title */}
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <pack.icon className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-500">
                            {pack.name}
                          </h3>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 mt-1">
                            Coming Soon
                          </Badge>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-500">
                        {pack.description}
                      </p>

                      {/* Placeholder Button */}
                      <Button
                        disabled
                        className="w-full bg-gray-300 text-gray-500 cursor-not-allowed"
                      >
                        Coming Soon
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Daily Progress */}
        <Card className="p-6 bg-white/80 backdrop-blur">
          <h3 className="text-xl font-bold mb-4">Today&apos;s Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{userStats.streak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-3">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{userStats.completedLevels.length}</div>
              <div className="text-sm text-gray-600">Levels Completed</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-yellow-100 flex items-center justify-center mb-3">
                <Trophy className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{userStats.points}</div>
              <div className="text-sm text-gray-600">Total XP</div>
            </div>
          </div>
        </Card>

        {/* Tips */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h3 className="text-xl font-bold mb-4 text-gray-900">💡 Pro Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <strong>Daily Challenge:</strong> Complete it every day to maintain your streak and earn bonus XP!
            </div>
            <div>
              <strong>Speed Round:</strong> Perfect for quick practice sessions when you&apos;re short on time.
            </div>
            <div>
              <strong>Perfect Streak:</strong> Focus on accuracy over speed to build confidence.
            </div>
            <div>
              <strong>Grammar Master:</strong> Challenge yourself with advanced concepts once you&apos;re ready.
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}