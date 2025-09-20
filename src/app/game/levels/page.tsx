'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Home, Play, Star, Trophy, CheckCircle, TrendingUp } from 'lucide-react'
import { comprehensiveLevels45 } from '@/data/comprehensiveLevels45'

export default function GrammarLevelsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get('category')

  const [userStats, setUserStats] = useState({
    completedLevels: [1],
    currentLevel: 1,
    points: 180,
    streak: 3
  })

  useEffect(() => {
    const savedStats = localStorage.getItem('userStats')
    if (savedStats) {
      setUserStats(JSON.parse(savedStats))
    }
  }, [])

  const categories = [
    {
      id: 'present-basics',
      name: 'Present Tense Basics',
      description: 'Foundation present tense structures',
      icon: Play,
      color: 'from-green-400/80 to-emerald-500/80',
      levels: comprehensiveLevels45.filter(level => level.category === 'present-basics')
    },
    {
      id: 'time-expressions',
      name: 'Time & Expressions',
      description: 'Critical time concepts and natural frequency',
      icon: Star,
      color: 'from-yellow-400/80 to-orange-500/80',
      levels: comprehensiveLevels45.filter(level => level.category === 'time-expressions')
    },
    {
      id: 'past-tense',
      name: 'Past Tense',
      description: 'Complete past tense including passive forms',
      icon: Trophy,
      color: 'from-red-400/80 to-pink-500/80',
      levels: comprehensiveLevels45.filter(level => level.category === 'past-tense')
    },
    {
      id: 'present-perfect',
      name: 'Present Perfect',
      description: 'Connect past actions to now: experiences, recent events, and ongoing situations',
      icon: Star,
      color: 'from-purple-400/80 to-indigo-500/80',
      levels: comprehensiveLevels45.filter(level => level.category === 'present-perfect')
    },
    {
      id: 'future-tenses',
      name: 'Future Tenses',
      description: 'Plans, predictions, and conditions',
      icon: TrendingUp,
      color: 'from-blue-400/80 to-indigo-500/80',
      levels: comprehensiveLevels45.filter(level => level.category === 'future-tenses')
    },
    {
      id: 'modals-special',
      name: 'Modals & Special Verbs',
      description: 'Essential for real-world communication',
      icon: CheckCircle,
      color: 'from-orange-400/80 to-red-500/80',
      levels: comprehensiveLevels45.filter(level => level.category === 'modals-special')
    },
    {
      id: 'commands-suggestions',
      name: 'Commands & Suggestions',
      description: 'Imperatives and polite suggestions',
      icon: Star,
      color: 'from-amber-400/80 to-yellow-500/80',
      levels: comprehensiveLevels45.filter(level => level.category === 'commands-suggestions')
    },
    {
      id: 'comparisons',
      name: 'Comparisons',
      description: 'Comparative forms and indefinite pronouns',
      icon: TrendingUp,
      color: 'from-gray-400/80 to-slate-500/80',
      levels: comprehensiveLevels45.filter(level => level.category === 'comparisons')
    },
    {
      id: 'advanced',
      name: 'Advanced Structures',
      description: 'Relative clauses, conditionals, and reported speech',
      icon: Trophy,
      color: 'from-purple-500/80 to-pink-600/80',
      levels: comprehensiveLevels45.filter(level => level.category === 'advanced')
    }
  ]

  const handleLevelSelect = (levelId: number) => {
    router.push(`/game/level/${levelId}`)
  }

  const isLevelCompleted = (levelId: number) => {
    return userStats.completedLevels.includes(levelId)
  }

  const getCategoryProgress = (levels: any[]) => {
    const completed = levels.filter(level => userStats.completedLevels.includes(level.id)).length
    return { completed, total: levels.length }
  }

  // Filter categories based on URL parameter
  const displayedCategories = selectedCategory
    ? categories.filter(category => category.id === selectedCategory)
    : categories

  const pageTitle = selectedCategory
    ? categories.find(cat => cat.id === selectedCategory)?.name || 'Grammar Levels'
    : 'Grammar Levels'

  const pageDescription = selectedCategory
    ? categories.find(cat => cat.id === selectedCategory)?.description || 'Choose a category to practice specific grammar skills'
    : 'Choose a category to practice specific grammar skills'

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      {/* Subtle Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/30 to-purple-900/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-600/10 to-yellow-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-green-600/10 to-teal-600/10 rounded-full filter blur-3xl"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Header */}
          <Card className="bg-slate-800/90 backdrop-blur-sm shadow-lg border border-slate-700/50 rounded-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/')}
                    className="flex items-center space-x-2 bg-slate-800/70 text-slate-200 border-slate-600/30 hover:bg-slate-700/70 rounded-2xl backdrop-blur-sm"
                  >
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </Button>
                </div>

                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="flex items-center space-x-1 bg-slate-700/60 text-slate-200 border-0 rounded-full px-3 py-1 backdrop-blur-sm">
                    <Trophy className="w-4 h-4" />
                    <span>{userStats.points} XP</span>
                  </Badge>
                </div>
              </div>

              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-2">{pageTitle}</h1>
                <p className="text-slate-300">{pageDescription}</p>
                {selectedCategory && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/game/levels')}
                    className="mt-3 bg-slate-700/50 text-slate-200 border-slate-600/30 hover:bg-slate-600/50 rounded-xl"
                  >
                    ← View All Categories
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Categories */}
          <div className="space-y-8">
            {displayedCategories.map((category) => (
              <Card key={category.id} className="p-6 bg-slate-800/90 backdrop-blur-sm shadow-lg border border-slate-700/50 rounded-2xl">
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300`}>
                      <category.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-white">
                          {category.name}
                        </h3>
                      </div>
                      <p className="text-slate-300 mb-3 text-base">
                        {category.description}
                      </p>
                      <div className="space-y-2">
                        <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${category.color} transition-all duration-700 rounded-full`}
                            style={{ width: `${(getCategoryProgress(category.levels).completed / getCategoryProgress(category.levels).total) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-400">
                          {getCategoryProgress(category.levels).completed} of {getCategoryProgress(category.levels).total} levels completed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Levels Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {category.levels.map((level, levelIndex) => {
                    const completed = isLevelCompleted(level.id)

                    return (
                      <Card
                        key={level.id}
                        className={`p-4 cursor-pointer transition-all duration-300 transform hover:scale-105 border border-slate-600/30 rounded-2xl group ${
                          completed
                            ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 backdrop-blur-sm shadow-lg'
                            : 'bg-slate-700/60 hover:bg-slate-600/60 backdrop-blur-sm shadow-lg hover:shadow-xl'
                        }`}
                        onClick={() => handleLevelSelect(level.id)}
                      >
                        <div className="text-center space-y-3">
                          <div className="flex items-center justify-center">
                            {completed ? (
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400/80 to-emerald-500/80 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                <CheckCircle className="w-6 h-6 text-white" />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400/80 to-indigo-500/80 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                <span className="text-white font-bold text-base">{level.id}</span>
                              </div>
                            )}
                          </div>

                          <div>
                            <h4 className="font-bold text-sm text-white mb-1 group-hover:text-white/90 transition-colors">
                              Level {level.id}
                            </h4>
                            <p className="text-xs text-slate-300 leading-tight">
                              {level.shortDescription}
                            </p>
                          </div>

                          <div className="flex items-center justify-center">
                            <Badge
                              variant="outline"
                              className={`text-xs border border-slate-600/30 px-2 py-1 rounded-full font-medium ${
                                completed
                                  ? 'bg-green-500/20 text-green-200'
                                  : 'bg-slate-600/40 text-slate-300'
                              }`}
                            >
                              {level.points} pts
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}