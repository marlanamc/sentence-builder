'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Play, Target, TrendingUp, HelpCircle, X, Book, Star, CheckCircle, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const router = useRouter()
  const [showHelpModal, setShowHelpModal] = useState(false)
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
      icon: TrendingUp,
      color: 'from-orange-400/80 to-red-500/80',
      progress: 0,
      total: 6,
      route: `/game/levels?category=modals-special`
    },
    {
      id: 'commands-suggestions',
      name: 'Commands & Suggestions',
      description: 'Imperatives and polite suggestions',
      icon: Target,
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

          {/* How does this work? Button */}
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => setShowHelpModal(true)}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 bg-slate-800/70 text-slate-200 border-slate-600/30 hover:bg-slate-700/70 rounded-full backdrop-blur-sm transition-all duration-300"
            >
              <HelpCircle className="w-4 h-4" />
              <span>How does this work?</span>
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

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-y-auto m-4 border border-slate-600">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-600">
              <div className="flex items-center space-x-3">
                <Book className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">How to Use the Sentence Builder</h2>
              </div>
              <Button
                onClick={() => setShowHelpModal(false)}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-8">

              {/* Game Modes Section */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Play className="w-5 h-5 text-green-400 mr-2" />
                  Game Modes
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4 bg-slate-700/50">
                    <h4 className="font-bold text-green-400 mb-2">Sentence Tiles</h4>
                    <p className="text-slate-300 text-sm">
                      Free practice mode. Build sentences using word tiles without time pressure. Perfect for exploring grammar and vocabulary.
                    </p>
                  </Card>
                  <Card className="p-4 bg-slate-700/50">
                    <h4 className="font-bold text-blue-400 mb-2">Grammar Levels</h4>
                    <p className="text-slate-300 text-sm">
                      Structured progression through 47 levels. Master specific grammar topics step by step, from basic present tense to advanced structures.
                    </p>
                  </Card>
                </div>
              </section>

              {/* How Levels Work */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Target className="w-5 h-5 text-purple-400 mr-2" />
                  How Levels Work - Dual Learning System
                </h3>
                <div className="space-y-4">
                  <Card className="p-4 bg-blue-500/10 border border-blue-500/30">
                    <h4 className="font-bold text-blue-400 mb-2 flex items-center">
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs mr-2">1</span>
                      Learn with Categories (5 sentences)
                    </h4>
                    <p className="text-slate-300 text-sm">
                      Words are organized by type: Subjects (I, you, she), Verbs (eat, play, study), Objects (pizza, soccer).
                      This helps you understand sentence structure: Subject + Verb + Object.
                    </p>
                  </Card>
                  <div className="flex justify-center">
                    <ArrowRight className="w-6 h-6 text-slate-400" />
                  </div>
                  <Card className="p-4 bg-purple-500/10 border border-purple-500/30">
                    <h4 className="font-bold text-purple-400 mb-2 flex items-center">
                      <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs mr-2">2</span>
                      Challenge Mode - Mixed Words (5 sentences)
                    </h4>
                    <p className="text-slate-300 text-sm">
                      Like Duolingo! All words are shuffled together without categories.
                      Test what you learned by building sentences without help from word groupings.
                    </p>
                  </Card>
                </div>
              </section>

              {/* Verb Forms Section */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-2" />
                  Understanding Verb Forms
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="p-4 bg-slate-700/50">
                    <h4 className="font-bold text-green-400 mb-2">V1 - Base Form</h4>
                    <p className="text-slate-300 text-sm mb-2">Present tense, infinitive</p>
                    <div className="space-y-1 text-xs">
                      <div className="bg-slate-600/50 p-2 rounded">eat, play, study, work</div>
                      <div className="text-slate-400">Used with: I, you, we, they</div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-slate-700/50">
                    <h4 className="font-bold text-orange-400 mb-2">V2 - Past Form</h4>
                    <p className="text-slate-300 text-sm mb-2">Simple past tense</p>
                    <div className="space-y-1 text-xs">
                      <div className="bg-slate-600/50 p-2 rounded">ate, played, studied, worked</div>
                      <div className="text-slate-400">Used for completed actions</div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-slate-700/50">
                    <h4 className="font-bold text-blue-400 mb-2">V3 - Past Participle</h4>
                    <p className="text-slate-300 text-sm mb-2">Perfect tenses, passive voice</p>
                    <div className="space-y-1 text-xs">
                      <div className="bg-slate-600/50 p-2 rounded">eaten, played, studied, worked</div>
                      <div className="text-slate-400">Used with: have, has, had</div>
                    </div>
                  </Card>
                </div>
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <h5 className="font-bold text-yellow-400 mb-2">💡 Pro Tip: Toggleable Verbs</h5>
                  <p className="text-slate-300 text-sm">
                    Look for the ↔ symbol on verb tiles! Click them to switch between forms:
                    <span className="bg-slate-600/50 px-2 py-1 rounded mx-1">eat ↔ eats</span>
                    This helps you match verbs with different subjects.
                  </p>
                </div>
              </section>

              {/* Level Progression */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 text-emerald-400 mr-2" />
                  Level Progression (47 Levels)
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Card className="p-3 bg-green-500/10 border border-green-500/30">
                      <h5 className="font-bold text-green-400 text-sm">Levels 1-8: Present Tense Basics</h5>
                      <p className="text-slate-300 text-xs">I eat pizza, She plays soccer</p>
                    </Card>
                    <Card className="p-3 bg-yellow-500/10 border border-yellow-500/30">
                      <h5 className="font-bold text-yellow-400 text-sm">Levels 9-12: Time & Expressions</h5>
                      <p className="text-slate-300 text-xs">Today, always, never, usually</p>
                    </Card>
                    <Card className="p-3 bg-red-500/10 border border-red-500/30">
                      <h5 className="font-bold text-red-400 text-sm">Levels 13-17: Past Tense</h5>
                      <p className="text-slate-300 text-xs">I ate pizza yesterday</p>
                    </Card>
                    <Card className="p-3 bg-purple-500/10 border border-purple-500/30">
                      <h5 className="font-bold text-purple-400 text-sm">Levels 18-24: Present Perfect</h5>
                      <p className="text-slate-300 text-xs">I have eaten pizza today</p>
                    </Card>
                  </div>
                  <div className="space-y-3">
                    <Card className="p-3 bg-blue-500/10 border border-blue-500/30">
                      <h5 className="font-bold text-blue-400 text-sm">Levels 25-29: Future Tenses</h5>
                      <p className="text-slate-300 text-xs">I will eat pizza tomorrow</p>
                    </Card>
                    <Card className="p-3 bg-orange-500/10 border border-orange-500/30">
                      <h5 className="font-bold text-orange-400 text-sm">Levels 30-35: Modals & Special</h5>
                      <p className="text-slate-300 text-xs">I can eat, I should study</p>
                    </Card>
                    <Card className="p-3 bg-amber-500/10 border border-amber-500/30">
                      <h5 className="font-bold text-amber-400 text-sm">Levels 36-38: Commands</h5>
                      <p className="text-slate-300 text-xs">Eat your breakfast!</p>
                    </Card>
                    <Card className="p-3 bg-gray-500/10 border border-gray-500/30">
                      <h5 className="font-bold text-gray-400 text-sm">Levels 39-47: Advanced</h5>
                      <p className="text-slate-300 text-xs">Comparisons, conditionals, complex structures</p>
                    </Card>
                  </div>
                </div>
              </section>

              {/* Tips for Success */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
                  Tips for Success
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>Start with basic sentences: Subject + Verb + Object</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>Pay attention to verb forms - click toggleable verbs to match subjects</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>Use the Pattern box to understand sentence structure</span>
                    </li>
                  </ul>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>Read the Grammar Guide for detailed explanations</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>Practice makes perfect - complete both learning phases!</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>Challenge mode prepares you for real conversations</span>
                    </li>
                  </ul>
                </div>
              </section>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-600 bg-slate-700/30">
              <div className="flex justify-center">
                <Button
                  onClick={() => setShowHelpModal(false)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full"
                >
                  Got it! Let&apos;s start learning
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}