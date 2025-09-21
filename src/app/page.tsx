'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp, HelpCircle, X, Clock, RotateCcw, Zap, MessageSquare, BookOpen, Gamepad2, Play, Calendar, LogIn, LogOut, Target, CheckCircle, Brain } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const router = useRouter();
  const { user, signOut } = useAuth();
  // Authentication is available but not required for playing

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
      icon: Clock,
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
      icon: BookOpen,
      difficulty: "Expert"
    }
  ];


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
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-bold text-white truncate">ESOL Sentence Builder</h1>
                <p className="text-slate-400 text-xs md:text-sm hidden sm:block">Master English Grammar Through Practice</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 md:space-x-3 flex-shrink-0">
              <Button
                onClick={() => setShowHelpModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm"
              >
                <HelpCircle className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                <span className="hidden md:inline">How It Works</span>
              </Button>
              <Button
                onClick={() => router.push('/game/levels')}
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white shadow-lg rounded-full px-3 md:px-6 py-1 md:py-2 text-xs md:text-sm"
              >
                <Play className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                <span className="hidden sm:inline">Start Learning</span>
                <span className="sm:hidden">Start</span>
              </Button>
              {user ? (
                <div className="flex items-center space-x-1 md:space-x-2">
                  <span className="text-white text-xs md:text-sm hidden md:inline">Hi, {user.email?.split('@')[0]}</span>
                  <Button
                    onClick={() => signOut()}
                    className="bg-red-500 hover:bg-red-600 text-white shadow-lg px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm"
                  >
                    <LogOut className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                    <span className="hidden md:inline">Sign Out</span>
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => router.push('/auth')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm"
                >
                  <LogIn className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                  <span className="hidden md:inline">Sign In</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-6 md:py-8">
        {/* Hero Title */}
        <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 relative">
            {/* Shadow/outline text */}
            <span
              className="absolute inset-0 text-transparent"
              style={{
                WebkitTextStroke: '1px rgba(255,255,255,0.3)',
                textStroke: '1px rgba(255,255,255,0.3)'
              }}
            >
              Master Sentence Building
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
              Master Sentence Building
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 md:mb-8 font-medium max-w-2xl mx-auto leading-relaxed px-2" style={{ textShadow: '1px 2px 8px rgba(0,0,0,0.8), 0px 1px 3px rgba(0,0,0,0.6)' }}>
            Build perfect English sentences with interactive word tiles. Learn grammar naturally through practice, not memorization - just click and construct sentences correctly.
          </p>

        </div>

        {/* Grammar Levels CTA */}
        <div className="mb-12 md:mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 rounded-2xl p-6 md:p-8 group cursor-pointer"
                 onClick={() => router.push('/game/levels')}>
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4 group-hover:text-blue-300 transition-colors">
                Start Building Sentences
              </h2>
              <p className="text-white/80 text-sm sm:text-base md:text-lg mb-4 md:mb-6 max-w-2xl mx-auto leading-relaxed px-2">
                Learn to construct perfect English sentences through interactive practice. No confusing grammar rules - just click, build, and learn what works.
              </p>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-4 md:mb-6">
                <span className="bg-emerald-500/20 text-emerald-200 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">Perfect Grammar</span>
                <span className="bg-blue-500/20 text-blue-200 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">Click & Build</span>
                <span className="bg-purple-500/20 text-purple-200 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">Instant Correction</span>
              </div>
              <Button
                onClick={() => router.push('/game/levels')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-bold shadow-lg transform hover:scale-105 transition-all duration-200 text-sm md:text-lg"
              >
                <Target className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                <span className="hidden sm:inline">Start Building Sentences</span>
                <span className="sm:hidden">Start Building</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Grammar Categories */}
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4 px-2" style={{ textShadow: '1px 2px 8px rgba(0,0,0,0.8)' }}>
              Learn English Grammar Through Practice
            </h2>
            <p className="text-white/80 text-sm sm:text-base max-w-3xl mx-auto px-4">
              Start with basic sentence construction and progress to complex structures. Each level teaches you to write English correctly and confidently.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <Card
                key={category.name}
                onClick={() => {
                  const categoryMapping = {
                    'Present Tense': 'present-basics',
                    'Time & Expressions': 'time-expressions',
                    'Past Tense': 'past-tense',
                    'Present Perfect': 'present-perfect',
                    'Future Tenses': 'future-tenses',
                    'Modals & Special': 'modals-special',
                    'Commands': 'commands-suggestions',
                    'Advanced': 'advanced'
                  };
                  router.push(`/game/levels?category=${categoryMapping[category.name]}`);
                }}
                className="bg-slate-800/90 backdrop-blur-sm shadow-lg border border-slate-700/50 hover:shadow-2xl transition-all duration-500 rounded-2xl transform hover:scale-105 group cursor-pointer flex flex-col h-full overflow-hidden"
              >
                <div className="p-4 md:p-6 flex flex-col h-full">
                  {/* Header with Icon, Title, and Number */}
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0 shadow-lg transform group-hover:scale-110 transition-transform duration-300 relative`}>
                      <category.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-lg font-bold text-white mb-1 group-hover:text-white/90 transition-colors leading-tight">
                        {category.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          category.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                          category.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                          category.difficulty === 'Advanced' ? 'bg-orange-500/20 text-orange-300' :
                          'bg-purple-500/20 text-purple-300'
                        }`}>
                          {category.difficulty}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">
                          {category.levels.split('-').length > 1 ?
                            `${parseInt(category.levels.split('-')[1]) - parseInt(category.levels.split('-')[0]) + 1} levels` :
                            category.levels}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4 md:mb-6 flex-1">
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  {/* Progress Section */}
                  <div className="space-y-3 md:space-y-4">
                    <div className="relative">
                      <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${category.color} transition-all duration-700 rounded-full`}
                          style={{ width: index === 0 ? '75%' : '0%' }}
                        />
                      </div>
                      <div className="text-xs text-slate-400 mt-2">
                        {index === 0 ? '6/8 completed' : `0/${parseInt(category.levels.split('-')[1]) - parseInt(category.levels.split('-')[0]) + 1} completed`}
                      </div>
                    </div>

                    {/* Button */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        const categoryMapping = {
                          'Present Tense': 'present-basics',
                          'Time & Expressions': 'time-expressions',
                          'Past Tense': 'past-tense',
                          'Present Perfect': 'present-perfect',
                          'Future Tenses': 'future-tenses',
                          'Modals & Special': 'modals-special',
                          'Commands': 'commands-suggestions',
                          'Advanced': 'advanced'
                        };
                        router.push(`/game/levels?category=${categoryMapping[category.name]}`);
                      }}
                      className="w-full bg-slate-700/60 hover:bg-slate-600/60 text-slate-200 font-semibold rounded-2xl shadow-lg backdrop-blur-sm border border-slate-600/30 transform transition-all duration-300 group-hover:scale-105 py-2 md:py-3 text-sm"
                    >
                      Start Practice
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 max-w-6xl mx-auto">
            <div className="text-center md:text-left">
              <p className="text-white/90 text-sm md:text-base font-medium">
                Ready to write better English?
              </p>
              <p className="text-white/70 text-xs md:text-sm mt-1 px-2 md:px-0">
                Join learners who are mastering sentence construction through interactive practice
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => setShowHelpModal(true)}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 bg-slate-800/70 text-slate-200 border-slate-600/30 hover:bg-slate-700/70 rounded-full backdrop-blur-sm transition-all duration-300 text-xs md:text-sm px-3 md:px-4 py-1 md:py-2"
              >
                <HelpCircle className="w-3 h-3 md:w-4 md:h-4" />
                <span>How It Works</span>
              </Button>
            </div>
          </div>
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
                How to Build Sentences
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
                  How to Build Sentences
                </h3>
                <Card className="p-6 bg-white border-2 border-gray-200">
                  <div className="space-y-4">
                    <p className="text-black text-lg leading-relaxed">
                      Click on word tiles to construct correct English sentences. Start with simple ones and learn grammar naturally through practice.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-black text-lg">
                        <strong>Getting Started:</strong> Click &ldquo;I&rdquo; → &ldquo;eat&rdquo; → &ldquo;pizza&rdquo; to make &ldquo;I eat pizza&rdquo;
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-black text-lg">
                        <strong>Pro Tip:</strong> Some words have multiple forms! Look for the ↔ symbol and click to switch between forms like
                        <span className="bg-gray-200 px-2 py-1 rounded mx-2 font-mono">eat ↔ eats</span>
                        - this teaches you correct verb agreement.
                      </p>
                    </div>
                  </div>
                </Card>
              </section>

              {/* Grammar Levels Overview */}
              <section>
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <TrendingUp className="w-6 h-6 text-emerald-400 mr-3" />
                  Grammar Learning Levels
                </h3>
                <div className="grid gap-4">
                  <Card className="p-4 bg-green-50 border-2 border-green-200">
                    <h4 className="font-bold text-black text-xl mb-2">🟢 Basics (Levels 1-12)</h4>
                    <p className="text-black text-lg">Learn basic sentence structure and simple tenses</p>
                    <div className="text-gray-700 text-base mt-2 italic">&ldquo;I eat pizza&rdquo; • &ldquo;She plays soccer&rdquo; • &ldquo;Today, always, never&rdquo;</div>
                  </Card>

                  <Card className="p-4 bg-yellow-50 border-2 border-yellow-200">
                    <h4 className="font-bold text-black text-xl mb-2">🟡 Intermediate (Levels 13-29)</h4>
                    <p className="text-black text-lg">Master past, present, and future tense structures</p>
                    <div className="text-gray-700 text-base mt-2 italic">&ldquo;I ate pizza yesterday&rdquo; • &ldquo;I have eaten pizza&rdquo; • &ldquo;I will eat pizza&rdquo;</div>
                  </Card>

                  <Card className="p-4 bg-orange-50 border-2 border-orange-200">
                    <h4 className="font-bold text-black text-xl mb-2">🟠 Advanced (Levels 30-47)</h4>
                    <p className="text-black text-lg">Learn modal verbs, commands, and complex sentences</p>
                    <div className="text-gray-700 text-base mt-2 italic">&ldquo;I can swim&rdquo; • &ldquo;Eat your breakfast!&rdquo; • &ldquo;If I were you...&rdquo;</div>
                  </Card>
                </div>
              </section>

              {/* Success Tips */}
              <section>
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <CheckCircle className="w-6 h-6 text-emerald-400 mr-3" />
                  Tips for Learning Grammar
                </h3>
                <Card className="p-6 bg-blue-50 border-2 border-blue-200">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">1️⃣</span>
                      <p className="text-black text-lg">Start with Level 1 - master basic sentence structure first</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">2️⃣</span>
                      <p className="text-black text-lg">Read sentences aloud - practice your pronunciation as you learn</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">3️⃣</span>
                      <p className="text-black text-lg">Use the Pattern guide - understand correct sentence structure</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">4️⃣</span>
                      <p className="text-black text-lg">Learn from mistakes - every correction teaches you grammar rules</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">5️⃣</span>
                      <p className="text-black text-lg">Complete levels in order - each level builds on the previous</p>
                    </div>
                  </div>
                </Card>
              </section>

              {/* Benefits Section */}
              <section>
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Brain className="w-6 h-6 text-purple-400 mr-3" />
                  How It Teaches Grammar
                </h3>
                <Card className="p-6 bg-purple-50 border-2 border-purple-200">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-white p-4 rounded-lg border border-purple-100">
                      <h4 className="font-bold text-purple-800 text-lg mb-2">🧠 Interactive Practice</h4>
                      <p className="text-gray-700">Build sentences by clicking word tiles. Learn grammar through hands-on practice, not memorization.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-purple-100">
                      <h4 className="font-bold text-purple-800 text-lg mb-2">🎯 Grammar Rules</h4>
                      <p className="text-gray-700">Each level focuses on specific grammar concepts. You&apos;ll master sentence structure step by step.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-purple-100">
                      <h4 className="font-bold text-purple-800 text-lg mb-2">⚡ Instant Feedback</h4>
                      <p className="text-gray-700">Know immediately if your sentence is correct. Learn from mistakes and understand why sentences work.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-purple-100">
                      <h4 className="font-bold text-purple-800 text-lg mb-2">📈 Progressive Learning</h4>
                      <p className="text-gray-700">Start with simple sentences and advance to complex ones. Each level builds on grammar concepts you&apos;ve learned.</p>
                    </div>
                  </div>
                </Card>
              </section>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-600 bg-slate-700/30">
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    setShowHelpModal(false);
                    router.push('/game/levels');
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-full font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Start Building Sentences! 🎯
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}