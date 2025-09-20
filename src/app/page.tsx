'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Play, Target, TrendingUp, HelpCircle, X, Book, Star, CheckCircle, ArrowRight, Clock, Calendar, RotateCcw, Zap, MessageSquare, Brain, BookOpen, ChevronRight, Gamepad2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const router = useRouter();

  const categories = [
    {
      name: "Present Tense",
      description: "Basic present tense sentences with common verbs",
      levels: "1-8",
      color: "bg-blue-500",
      icon: Clock,
      difficulty: "Beginner"
    },
    {
      name: "Time & Expressions",
      description: "Time expressions with different tenses",
      levels: "9-12",
      color: "bg-green-500",
      icon: Calendar,
      difficulty: "Beginner"
    },
    {
      name: "Past Tense",
      description: "Past tense forms and irregular verbs",
      levels: "13-17",
      color: "bg-purple-500",
      icon: RotateCcw,
      difficulty: "Intermediate"
    },
    {
      name: "Present Perfect",
      description: "Present perfect vs past simple",
      levels: "18-24",
      color: "bg-orange-500",
      icon: CheckCircle,
      difficulty: "Intermediate"
    },
    {
      name: "Future Tenses",
      description: "Will, going to, and present continuous for future",
      levels: "25-29",
      color: "bg-red-500",
      icon: TrendingUp,
      difficulty: "Intermediate"
    },
    {
      name: "Modals & Special",
      description: "Modal verbs and special constructions",
      levels: "30-35",
      color: "bg-indigo-500",
      icon: Zap,
      difficulty: "Advanced"
    },
    {
      name: "Commands",
      description: "Imperatives and suggestions",
      levels: "36-38",
      color: "bg-pink-500",
      icon: MessageSquare,
      difficulty: "Advanced"
    },
    {
      name: "Advanced",
      description: "Complex grammar and sentence structures",
      levels: "39-47",
      color: "bg-gray-500",
      icon: Brain,
      difficulty: "Expert"
    }
  ];

  const gameModes = [
    {
      name: "Learning Mode",
      description: "Perfect for beginners! Get hints, explanations, and unlimited time to build sentences correctly.",
      icon: BookOpen,
      color: "text-blue-400",
      features: ["Unlimited time", "Built-in hints", "Grammar explanations", "Pattern guides"]
    },
    {
      name: "Challenge Mode",
      description: "Test your skills! Build sentences without hints under time pressure - just like real conversations.",
      icon: Zap,
      color: "text-orange-400",
      features: ["Time pressure", "No hints", "Real conversation prep", "Achievement unlocks"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">ESOL Sentence Builder</h1>
                <p className="text-slate-400 text-sm">Master English Grammar Through Practice</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowHelpModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                How it Works
              </Button>
              <Button
                onClick={() => router.push('/game/levels')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Learning
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Hero Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 relative">
            {/* Shadow/outline text */}
            <span
              className="absolute inset-0 text-transparent"
              style={{
                WebkitTextStroke: '2px rgba(255,255,255,0.2)',
                textStroke: '2px rgba(255,255,255,0.2)'
              }}
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

          <p className="text-xl md:text-2xl text-white/90 mb-8 font-medium" style={{ textShadow: '1px 2px 8px rgba(0,0,0,0.8), 0px 1px 3px rgba(0,0,0,0.6)' }}>
            How do you want to practice today?
          </p>
        </div>

        {/* Game Mode Selection */}
        <div className="mb-8">
          <div className="flex gap-4 justify-center flex-wrap max-w-4xl mx-auto">
            <Button
              onClick={() => router.push('/game/sentence-tiles')}
              className="flex items-center gap-3 rounded-2xl px-8 py-6 text-lg font-semibold transition-all duration-300 backdrop-blur-md border border-slate-600/30 bg-gradient-to-r from-green-500/80 to-emerald-500/80 hover:from-green-600/80 hover:to-emerald-600/80 text-white shadow-xl transform hover:scale-110"
              size="lg"
            >
              <Play className="w-6 h-6" />
              Sentence Tiles
            </Button>
            <Button
              onClick={() => router.push('/game/levels')}
              className="flex items-center gap-3 rounded-2xl px-8 py-6 text-lg font-semibold transition-all duration-300 backdrop-blur-md border border-slate-600/30 bg-slate-800/70 hover:bg-slate-700/70 text-slate-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              size="lg"
            >
              <Target className="w-6 h-6" />
              Grammar Levels
            </Button>
          </div>
        </div>

        {/* Grammar Categories */}
        <div className="mb-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 6).map((category, index) => (
              <Card
                key={category.name}
                onClick={() => router.push('/game/levels')}
                className="bg-slate-800/90 backdrop-blur-sm shadow-lg border border-slate-700/50 hover:shadow-2xl transition-all duration-500 rounded-2xl transform hover:scale-105 group cursor-pointer flex flex-col h-full"
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
                        {category.levels.split('-').length > 1 ?
                          `${parseInt(category.levels.split('-')[1]) - parseInt(category.levels.split('-')[0]) + 1} levels` :
                          category.levels}
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
                          style={{ width: index === 0 ? '75%' : '0%' }}
                        />
                      </div>
                      <div className="text-xs text-slate-400 mt-1 text-center">
                        {index === 0 ? '6/8 completed' : `0/${parseInt(category.levels.split('-')[1]) - parseInt(category.levels.split('-')[0]) + 1} completed`}
                      </div>
                    </div>

                    {/* Button */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push('/game/levels');
                      }}
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

        {/* How does this work? Button */}
        <div className="flex justify-center">
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
      </main>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-600 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <HelpCircle className="w-6 h-6 mr-2 text-blue-400" />
                How it Works
              </h2>
              <Button
                onClick={() => setShowHelpModal(false)}
                variant="ghost"
                className="text-slate-400 hover:text-white p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 space-y-6">

              {/* Game Overview */}
              <section>
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Gamepad2 className="w-6 h-6 text-emerald-400 mr-3" />
                  How to Play
                </h3>
                <Card className="p-6 bg-white border-2 border-gray-200">
                  <div className="space-y-4">
                    <p className="text-black text-lg leading-relaxed">
                      Click on word tiles to build sentences. Start simple!
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-black text-lg">
                        <strong>Example:</strong> Click "I" → "eat" → "pizza" to make "I eat pizza"
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-black text-lg">
                        <strong>Tip:</strong> Some words can change! Look for the ↔ symbol and click to switch between forms like
                        <span className="bg-gray-200 px-2 py-1 rounded mx-2 font-mono">eat ↔ eats</span>
                      </p>
                    </div>
                  </div>
                </Card>
              </section>

              {/* Level Categories - Simplified */}
              <section>
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <TrendingUp className="w-6 h-6 text-emerald-400 mr-3" />
                  What You'll Learn
                </h3>
                <div className="grid gap-4">
                  <Card className="p-4 bg-green-50 border-2 border-green-200">
                    <h4 className="font-bold text-black text-xl mb-2">🟢 Beginner (Levels 1-12)</h4>
                    <p className="text-black text-lg">Present tense and basic time words</p>
                    <div className="text-gray-700 text-base mt-2 italic">"I eat pizza" • "She plays soccer" • "Today, always, never"</div>
                  </Card>

                  <Card className="p-4 bg-yellow-50 border-2 border-yellow-200">
                    <h4 className="font-bold text-black text-xl mb-2">🟡 Intermediate (Levels 13-29)</h4>
                    <p className="text-black text-lg">Past tense, present perfect, and future</p>
                    <div className="text-gray-700 text-base mt-2 italic">"I ate pizza yesterday" • "I have eaten pizza" • "I will eat pizza"</div>
                  </Card>

                  <Card className="p-4 bg-orange-50 border-2 border-orange-200">
                    <h4 className="font-bold text-black text-xl mb-2">🟠 Advanced (Levels 30-47)</h4>
                    <p className="text-black text-lg">Special verbs, commands, and complex sentences</p>
                    <div className="text-gray-700 text-base mt-2 italic">"I can swim" • "Eat your breakfast!" • "If I were you..."</div>
                  </Card>
                </div>
              </section>

              {/* Simple Tips */}
              <section>
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <CheckCircle className="w-6 h-6 text-emerald-400 mr-3" />
                  Success Tips
                </h3>
                <Card className="p-6 bg-blue-50 border-2 border-blue-200">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">1️⃣</span>
                      <p className="text-black text-lg">Start with Level 1 - it's easy!</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">2️⃣</span>
                      <p className="text-black text-lg">Read sentences out loud after you build them</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">3️⃣</span>
                      <p className="text-black text-lg">Practice a little bit every day</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">4️⃣</span>
                      <p className="text-black text-lg">Don't worry about mistakes - they help you learn!</p>
                    </div>
                  </div>
                </Card>
              </section>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-600 bg-slate-700/30">
              <div className="flex justify-center">
                <Button
                  onClick={() => setShowHelpModal(false)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full"
                >
                  Got it!
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}