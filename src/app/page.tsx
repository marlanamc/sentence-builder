'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Play, Target, Zap, Gift, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

export default function HomePage() {
  const router = useRouter()
  const [userStats, setUserStats] = useState({
    streak: 3,
    xp: 180,
    completedLevels: 1,
    totalLevels: 8,
    correctAnswers: 11
  })

  // Load user stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('userStats')
    if (savedStats) {
      setUserStats(JSON.parse(savedStats))
    }
  }, [])

  const gameModes = [
    {
      id: 'sentence-tiles',
      name: 'Sentence Tiles',
      icon: Play,
      primary: true,
      route: '/game/sentence-tiles'
    },
    {
      id: 'grammar-levels',
      name: 'Grammar Levels',
      icon: Target,
      route: '/game/levels'
    },
    {
      id: 'quick-match',
      name: 'Quick Match',
      icon: Zap,
      route: '/game/quick-match',
      disabled: false
    }
  ]

  const categories = [
    {
      id: 'present-basics',
      name: 'Present Tense Basics',
      description: 'Foundation present tense structures',
      icon: Play,
      color: 'from-green-400/80 to-emerald-500/80',
      progress: userStats.completedLevels,
      total: 8,
      route: `/game/levels?category=present-basics`
    },
    {
      id: 'time-expressions',
      name: 'Time & Expressions',
      description: 'Critical time concepts and natural frequency',
      icon: Target,
      color: 'from-yellow-400/80 to-orange-500/80',
      progress: 0,
      total: 4,
      route: `/game/levels?category=time-expressions`
    },
    {
      id: 'past-tense',
      name: 'Past Tense',
      description: 'Complete past tense including passive forms',
      icon: TrendingUp,
      color: 'from-red-400/80 to-pink-500/80',
      progress: 0,
      total: 5,
      route: `/game/levels?category=past-tense`
    },
    {
      id: 'present-perfect',
      name: 'Present Perfect',
      description: 'Connect past actions to now: experiences, recent events, and ongoing situations',
      icon: TrendingUp,
      color: 'from-purple-400/80 to-indigo-500/80',
      progress: 0,
      total: 7,
      route: `/game/levels?category=present-perfect`
    },
    {
      id: 'future-tenses',
      name: 'Future Tenses',
      description: 'Plans, predictions, and conditions',
      icon: TrendingUp,
      color: 'from-blue-400/80 to-indigo-500/80',
      progress: 0,
      total: 5,
      route: `/game/levels?category=future-tenses`
    },
    {
      id: 'modals-special',
      name: 'Modals & Special Verbs',
      description: 'Essential for real-world communication',
      icon: Zap,
      color: 'from-orange-400/80 to-red-500/80',
      progress: 0,
      total: 6,
      route: `/game/levels?category=modals-special`
    },
    {
      id: 'commands-suggestions',
      name: 'Commands & Suggestions',
      description: 'Imperatives and polite suggestions',
      icon: Gift,
      color: 'from-amber-400/80 to-yellow-500/80',
      progress: 0,
      total: 3,
      route: `/game/levels?category=commands-suggestions`
    },
    {
      id: 'comparisons',
      name: 'Comparisons',
      description: 'Comparative forms and indefinite pronouns',
      icon: TrendingUp,
      color: 'from-gray-400/80 to-slate-500/80',
      progress: 0,
      total: 3,
      route: `/game/levels?category=comparisons`
    },
    {
      id: 'advanced',
      name: 'Advanced Structures',
      description: 'Relative clauses, conditionals, and reported speech',
      icon: TrendingUp,
      color: 'from-purple-500/80 to-pink-600/80',
      progress: 0,
      total: 6,
      route: `/game/levels?category=advanced`
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      {/* Subtle Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/30 to-purple-900/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-600/10 to-yellow-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-green-600/10 to-teal-600/10 rounded-full filter blur-3xl"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="p-6 text-center">
          <div className="relative mb-6">
            {/* Background glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-emerald-600/30 rounded-2xl blur-xl opacity-70"></div>

            {/* Main title */}
            <h1 className="relative text-6xl md:text-7xl font-black mb-3">
              {/* Shadow layer */}
              <span
                className="absolute inset-0 text-slate-800/40 blur-sm"
                style={{ transform: 'translate(2px, 2px)' }}
              >
                Sentence Builder Game
              </span>

              {/* Main gradient text */}
              <span
                className="relative bg-gradient-to-r from-blue-300 via-purple-400 to-emerald-300 bg-clip-text text-transparent"
                style={{
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Sentence Builder Game
              </span>
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-white/90 mb-1 font-medium" style={{ textShadow: '1px 2px 8px rgba(0,0,0,0.8), 0px 1px 3px rgba(0,0,0,0.6)' }}>
            How do you want to practice today?
          </p>
        </div>

        {/* Game Mode Selection */}
        <div className="px-6 pb-4">
          <div className="flex gap-4 justify-center flex-wrap max-w-3xl mx-auto">
            {gameModes.map((mode) => (
              <Button
                key={mode.id}
                onClick={() => !mode.disabled && router.push(mode.route)}
                variant={mode.primary ? "default" : "secondary"}
                size="lg"
                disabled={mode.disabled}
                className={`
                  flex items-center gap-3 rounded-2xl px-8 py-6 text-lg font-semibold transition-all duration-300 backdrop-blur-md border border-slate-600/30
                  ${mode.primary
                    ? 'bg-gradient-to-r from-green-500/80 to-emerald-500/80 hover:from-green-600/80 hover:to-emerald-600/80 text-white shadow-xl transform hover:scale-110'
                    : mode.disabled
                    ? 'bg-slate-800/40 text-slate-400 cursor-not-allowed border-slate-700/30'
                    : 'bg-slate-800/70 hover:bg-slate-700/70 text-slate-200 shadow-lg hover:shadow-xl transform hover:scale-105'
                  }
                `}
              >
                <mode.icon className="w-6 h-6" />
                {mode.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 pb-6">
          <div className="max-w-3xl mx-auto flex gap-4 justify-center">
            <Button
              onClick={() => router.push('/game/quick-match')}
              variant="secondary"
              size="lg"
              className="rounded-2xl bg-slate-800/70 hover:bg-slate-700/70 text-slate-200 font-semibold shadow-lg backdrop-blur-md border border-slate-600/30 transform hover:scale-105 transition-all duration-300"
            >
              Quick Match
            </Button>
            <Button
              onClick={() => router.push('/bonus-packs')}
              variant="ghost"
              size="lg"
              className="text-slate-200 font-semibold hover:bg-slate-800/50 rounded-2xl backdrop-blur-md transform hover:scale-105 transition-all duration-300 border border-slate-600/30"
            >
              <Gift className="w-5 h-5 mr-2" />
              Bonus Packs
            </Button>
          </div>
        </div>

        {/* Category Cards */}
        <div className="px-6 pb-10">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Card
                key={category.id}
                className="bg-slate-800/90 backdrop-blur-sm shadow-lg border border-slate-700/50 hover:shadow-2xl transition-all duration-500 rounded-2xl transform hover:scale-105 group cursor-pointer flex flex-col h-full"
                onClick={() => router.push(category.route)}
              >
                <div className="p-6 flex flex-col h-full">
                  {/* Header with Icon, Title, and Number */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0 shadow-lg transform group-hover:scale-110 transition-transform duration-300 relative`}>
                      <category.icon className="w-8 h-8 text-white" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-h-[60px] flex flex-col justify-center">
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-white/90 transition-colors leading-tight">
                        {category.name}
                      </h3>
                      <div className="text-xs text-slate-300 font-medium">
                        {category.total} levels
                      </div>
                    </div>
                  </div>

                  {/* Description - Fixed Height */}
                  <div className="mb-4 flex-1">
                    <p className="text-slate-300 text-sm leading-relaxed h-[40px] overflow-hidden">
                      {category.description}
                    </p>
                  </div>

                  {/* Progress Section - Fixed Position */}
                  <div className="space-y-3 mt-auto">
                    <div className="relative">
                      <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${category.color} transition-all duration-700 rounded-full`}
                          style={{ width: `${(category.progress / category.total) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-400 mt-1 text-center">
                        {category.progress}/{category.total} completed
                      </div>
                    </div>

                    {/* Button */}
                    <Button
                      className="w-full bg-slate-700/60 hover:bg-slate-600/60 text-slate-200 font-semibold rounded-2xl shadow-lg backdrop-blur-sm border border-slate-600/30 transform transition-all duration-300 group-hover:scale-105"
                      size="lg"
                    >
                      Start Practice
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}