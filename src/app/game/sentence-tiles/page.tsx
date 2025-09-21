'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle, XCircle, RotateCcw, Home, BookOpen, Trophy,
  Shuffle, Lightbulb, Users, Zap, Package,
  Flame
} from 'lucide-react'

// Import enhanced systems from the complete version
import { comprehensiveLevels45, getLevelById } from '@/data/comprehensiveLevels45'
import { grammarEngine, WordToken } from '@/lib/grammar-engine'

export default function EnhancedSentenceTilesPage() {
  const router = useRouter()
  const [currentLevel] = useState(1)
  const [selectedTiles, setSelectedTiles] = useState<Array<{ word: string; category: string; originalWord: string; id: string }>>([])
  const [feedback, setFeedback] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [sentencesCompleted, setSentencesCompleted] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  // User stats tracking removed for free play

  // No user stats tracking for free play

  // Get current level data
  const level = getLevelById(currentLevel) || comprehensiveLevels45[0]
  const targetSentences = 5

  // Enhanced word categories with locked tiles
  const getWordCategories = () => {
    const baseCategories = {
      subjects: [
        { word: 'I', category: 'pronoun', locked: false },
        { word: 'you', category: 'pronoun', locked: false },
        { word: 'he', category: 'pronoun', locked: false },
        { word: 'she', category: 'pronoun', locked: false },
        { word: 'it', category: 'pronoun', locked: false },
        { word: 'we', category: 'pronoun', locked: false },
        { word: 'they', category: 'pronoun', locked: false },
        { word: 'everyone', category: 'pronoun', locked: currentLevel < 3 }
      ],

      verbs: [
        { word: 'eat/eats', category: 'verb', toggleable: true, locked: false },
        { word: 'like/likes', category: 'verb', toggleable: true, locked: false },
        { word: 'watch/watches', category: 'verb', toggleable: true, locked: false },
        { word: 'play/plays', category: 'verb', toggleable: true, locked: false },
        { word: 'study/studies', category: 'verb', toggleable: true, locked: false },
        { word: 'work/works', category: 'verb', toggleable: true, locked: false },
        { word: 'create/creates', category: 'verb', toggleable: true, locked: currentLevel < 4 },
        { word: 'understand/understands', category: 'verb', toggleable: true, locked: currentLevel < 5 }
      ],

      objects: [
        { word: 'pizza/pizzas', category: 'countable-noun', toggleable: true, locked: false },
        { word: 'book/books', category: 'countable-noun', toggleable: true, locked: false },
        { word: 'movie/movies', category: 'countable-noun', toggleable: true, locked: false },
        { word: 'music', category: 'uncountable-noun', toggleable: false, locked: false },
        { word: 'water', category: 'uncountable-noun', toggleable: false, locked: false },
        { word: 'coffee', category: 'uncountable-noun', toggleable: false, locked: false },
        { word: 'homework', category: 'uncountable-noun', toggleable: false, locked: currentLevel < 3 },
        { word: 'technology', category: 'uncountable-noun', toggleable: false, locked: currentLevel < 5 }
      ]
    }

    return baseCategories
  }

  const [wordCategories, setWordCategories] = useState(getWordCategories())

  // Shuffle tiles function
  const shuffleTiles = () => {
    const shuffled = {
      subjects: [...wordCategories.subjects].sort(() => Math.random() - 0.5),
      verbs: [...wordCategories.verbs].sort(() => Math.random() - 0.5),
      objects: [...wordCategories.objects].sort(() => Math.random() - 0.5)
    }
    setWordCategories(shuffled)
  }

  // Handle tile clicks with enhanced functionality
  const handleTileClick = (word: string, category: string) => {
    const id = Math.random().toString(36).substr(2, 9)
    const wordObj = { word, category, originalWord: word, id }

    // Handle toggleable words (verbs and objects)
    if (category === 'verb' && word.includes('/')) {
      const [form1, form2] = word.split('/')
      const existingIndex = selectedTiles.findIndex(tile => tile.originalWord === word)

      if (existingIndex !== -1) {
        const currentForm = selectedTiles[existingIndex].word
        const newForm = currentForm === form1 ? form2 : form1
        const newTiles = [...selectedTiles]
        newTiles[existingIndex] = { ...wordObj, word: newForm }
        setSelectedTiles(newTiles)
      } else {
        setSelectedTiles([...selectedTiles, { ...wordObj, word: form1 }])
      }
    } else if (category === 'countable-noun' && word.includes('/')) {
      const [singular, plural] = word.split('/')
      const existingIndex = selectedTiles.findIndex(tile => tile.originalWord === word)

      if (existingIndex !== -1) {
        const currentForm = selectedTiles[existingIndex].word
        const newForm = currentForm === singular ? plural : singular
        const newTiles = [...selectedTiles]
        newTiles[existingIndex] = { ...wordObj, word: newForm }
        setSelectedTiles(newTiles)
      } else {
        setSelectedTiles([...selectedTiles, { ...wordObj, word: singular }])
      }
    } else {
      setSelectedTiles([...selectedTiles, wordObj])
    }

    // Hide hint when user starts building
    setShowHint(false)
  }

  // Enhanced sentence validation with order checking
  const checkSentence = async () => {
    if (selectedTiles.length === 0) {
      setFeedback('Please build a sentence first!')
      setShowFeedback(true)
      return
    }

    // Check word order first
    const subjectIndex = selectedTiles.findIndex(tile => tile.category === 'pronoun')
    const verbIndex = selectedTiles.findIndex(tile => tile.category === 'verb')
    const objectIndex = selectedTiles.findIndex(tile => tile.category.includes('noun'))

    if (subjectIndex > verbIndex && verbIndex !== -1) {
      setFeedback('Try starting with the subject (I, you, she, etc.) 💡')
      setShowFeedback(true)
      return
    }

    // Convert tiles to WordToken format
    const tokens: WordToken[] = selectedTiles.map((tile, index) => ({
      word: tile.word,
      pos: tile.category === 'pronoun' ? 'subject' :
           tile.category === 'verb' ? 'verb' :
           tile.category.includes('noun') ? 'object' :
           tile.category.includes('article') ? 'article' :
           tile.category,
      category: tile.category,
      index
    }))

    const validation = grammarEngine.validateSentence(tokens, { level: currentLevel })

    setFeedback(validation.feedback)
    setShowFeedback(true)

    // Enhanced success effects
    if (validation.isValid) {
      setShowConfetti(true)
      setSentencesCompleted(prev => prev + 1)

      // No user stats tracking for free play

      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 2000)
    }
  }

  const clearSentence = () => {
    setSelectedTiles([])
    setFeedback('')
    setShowFeedback(false)
    setShowHint(false)
  }

  const removeTile = (id: string) => {
    const newTiles = selectedTiles.filter(tile => tile.id !== id)
    setSelectedTiles(newTiles)
  }

  const toggleHint = () => {
    setShowHint(!showHint)
  }

  // Enhanced color coding with gradients
  const getCategoryColor = (category: string, isLocked = false) => {
    if (isLocked) {
      return 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
    }

    const colors = {
      'pronoun': 'bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300 text-blue-800 hover:from-blue-200 hover:to-blue-300',
      'verb': 'bg-gradient-to-r from-purple-100 to-purple-200 border-purple-300 text-purple-800 hover:from-purple-200 hover:to-purple-300',
      'countable-noun': 'bg-gradient-to-r from-orange-100 to-orange-200 border-orange-300 text-orange-800 hover:from-orange-200 hover:to-orange-300',
      'uncountable-noun': 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300 text-yellow-800 hover:from-yellow-200 hover:to-yellow-300'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 border-gray-300 text-gray-800'
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const icons = {
      'subjects': Users,
      'verbs': Zap,
      'objects': Package
    }
    return icons[category as keyof typeof icons] || Package
  }

  return (
    <div className="min-h-screen bg-[#0B1528] text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/game/levels')}
            className="text-white hover:bg-[#1E293B] rounded-full px-4 py-2 flex items-center"
          >
            <span className="mr-2">←</span>
            Levels
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="text-white hover:bg-[#1E293B] rounded-full px-4 py-2"
          >
            Home
          </Button>
        </div>

        {/* Level Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Level 1 of 47</span>
            <span>2%</span>
          </div>
          <div className="w-full h-1 bg-[#1E293B] rounded-full">
            <div className="w-[2%] h-full bg-purple-500 rounded-full"></div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-[#1E293B]/50 rounded-xl p-6">
          {/* Title and Help */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Basic Affirmative</h1>
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              How to use
            </Button>
          </div>

          {/* Pattern and Grammar Guide */}
          <div className="flex justify-between items-center gap-4 mb-6">
            <div className="flex-1 bg-[#2D3B4E] rounded-xl p-3 flex items-center">
              <span className="text-gray-400 mr-3">✏️ Pattern</span>
              <span className="text-white">subject + verb + object</span>
              <span className="ml-2 text-gray-400">▼</span>
            </div>
            <div className="flex-1 bg-[#2D3B4E] rounded-xl p-3 flex items-center cursor-pointer">
              <span className="text-gray-400 mr-3">💡 Quick Grammar Guide</span>
              <span className="ml-auto text-gray-400">▼</span>
            </div>
          </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
          {/* Primary Canvas - Sentence Builder */}
          <div className="flex-1 space-y-6 min-w-0">
            {/* Title and Progress */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">📚</span>
                <h2 className="text-xl">Build Your Sentence</h2>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-400">Learn with Categories</span>
                <span className="text-gray-400">•</span>
                <span>0/5 correct</span>
              </div>
            </div>

            {/* Sentence Display Area - Hero Section */}
            <div className="bg-[#2D3B4E] rounded-xl p-8 min-h-[200px] flex items-center justify-center">
              {selectedTiles.length === 0 ? (
                <div className="text-center">
                  <span className="text-3xl mb-4 block">✨</span>
                  <p className="text-gray-400 text-lg">Tap tiles from the toolbox to build your sentence...</p>
                  <p className="text-gray-500 text-sm mt-2">Your sentence will appear here</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3 justify-center">
                  <AnimatePresence>
                    {selectedTiles.map((tile) => (
                      <motion.div
                        key={tile.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        layout
                      >
                        <Badge
                          variant="secondary"
                          className="cursor-pointer text-lg px-6 py-3 bg-[#3E4E67] text-white hover:bg-[#4A5B76] transition-all rounded-xl"
                          onClick={() => removeTile(tile.id)}
                        >
                          {tile.word}
                          <span className="ml-2 text-sm opacity-70">×</span>
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={checkSentence}
                className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white py-4 rounded-xl font-medium text-lg"
                disabled={selectedTiles.length === 0}
              >
                <span className="mr-2">✓</span>
                Check Sentence
              </Button>
              <Button
                onClick={clearSentence}
                className="flex-1 bg-white hover:bg-gray-100 text-gray-800 py-4 rounded-xl font-medium text-lg"
              >
                Clear
              </Button>
            </div>

            {/* Feedback Area */}
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#2D3B4E] rounded-xl p-4"
              >
                <p className="text-center">{feedback}</p>
              </motion.div>
            )}

            {/* Tip Section */}
            <div className="bg-[#2D3B4E] rounded-xl p-4">
              <div className="flex items-center text-gray-400 text-sm">
                <span className="mr-2">💡</span>
                <span>Tip:</span>
                <span className="ml-2">Click verb tiles to toggle forms</span>
                <div className="ml-4 bg-[#3E4E67] rounded-xl px-3 py-1">
                  eat <span className="text-gray-400">↔</span> eats
                </div>
              </div>
            </div>
          </div>

          {/* Right Toolbox - Word Categories */}
          <div className="w-full lg:w-80 lg:space-y-4 lg:max-h-[600px] lg:overflow-y-auto lg:scrollbar-thin lg:scrollbar-thumb-gray-600 lg:scrollbar-track-gray-800">
            <div className="lg:sticky lg:top-0 bg-[#0B1528] pb-2 z-10">
              <h3 className="text-lg font-semibold text-gray-300 flex items-center">
                <span className="mr-2">🧰</span>
                Word Toolbox
              </h3>
            </div>

            {/* Mobile: Horizontal scroll layout */}
            <div className="lg:hidden flex gap-4 overflow-x-auto pb-4">
              {/* Subjects Panel - Mobile */}
              <div className="bg-[#2D3B4E] rounded-xl p-4 min-w-[200px] flex-shrink-0">
                <h4 className="text-gray-400 mb-3 flex items-center font-medium">
                  <span className="mr-2">😊</span>
                  Subjects
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {['i', 'you', 'he', 'she', 'it', 'we', 'they'].map((word) => (
                    <Button
                      key={word}
                      onClick={() => handleTileClick(word, 'pronoun')}
                      className="bg-[#3E4E67] hover:bg-[#4A5B76] text-white rounded-lg px-3 py-2 text-sm w-full"
                    >
                      {word}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Verbs Panel - Mobile */}
              <div className="bg-[#2D3B4E] rounded-xl p-4 min-w-[250px] flex-shrink-0">
                <h4 className="text-gray-400 mb-3 flex items-center font-medium">
                  <span className="mr-2">⚡</span>
                  Verbs
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    'eat/eats',
                    'like/likes',
                    'watch/watches',
                    'play/plays',
                    'study/studies',
                    'work/works'
                  ].map((word) => (
                    <Button
                      key={word}
                      onClick={() => handleTileClick(word, 'verb')}
                      className="bg-[#3E4E67] hover:bg-[#4A5B76] text-white rounded-lg px-3 py-2 text-sm w-full text-left justify-start"
                    >
                      {word.split('/')[0]}
                      <span className="text-xs text-gray-400 ml-auto">/{word.split('/')[1]}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Objects Panel - Mobile */}
              <div className="bg-[#2D3B4E] rounded-xl p-4 min-w-[200px] flex-shrink-0">
                <h4 className="text-gray-400 mb-3 flex items-center font-medium">
                  <span className="mr-2">📦</span>
                  Objects
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'pizza',
                    'soccer',
                    'basketball',
                    'music',
                    'water',
                    'coffee'
                  ].map((word) => (
                    <Button
                      key={word}
                      onClick={() => handleTileClick(word, 'noun')}
                      className="bg-[#3E4E67] hover:bg-[#4A5B76] text-white rounded-lg px-3 py-2 text-sm w-full"
                    >
                      {word}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop: Vertical layout */}
            <div className="hidden lg:block space-y-4">
              {/* Subjects Panel - Desktop */}
              <div className="bg-[#2D3B4E] rounded-xl p-4">
                <h4 className="text-gray-400 mb-3 flex items-center font-medium">
                  <span className="mr-2">😊</span>
                  Subjects
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {['i', 'you', 'he', 'she', 'it', 'we', 'they'].map((word) => (
                    <Button
                      key={word}
                      onClick={() => handleTileClick(word, 'pronoun')}
                      className="bg-[#3E4E67] hover:bg-[#4A5B76] text-white rounded-lg px-3 py-2 text-sm w-full"
                    >
                      {word}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Verbs Panel - Desktop */}
              <div className="bg-[#2D3B4E] rounded-xl p-4">
                <h4 className="text-gray-400 mb-3 flex items-center font-medium">
                  <span className="mr-2">⚡</span>
                  Verbs
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    'eat/eats',
                    'like/likes',
                    'watch/watches',
                    'play/plays',
                    'study/studies',
                    'work/works'
                  ].map((word) => (
                    <Button
                      key={word}
                      onClick={() => handleTileClick(word, 'verb')}
                      className="bg-[#3E4E67] hover:bg-[#4A5B76] text-white rounded-lg px-3 py-2 text-sm w-full text-left justify-start"
                    >
                      {word.split('/')[0]}
                      <span className="text-xs text-gray-400 ml-auto">/{word.split('/')[1]}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Objects Panel - Desktop */}
              <div className="bg-[#2D3B4E] rounded-xl p-4">
                <h4 className="text-gray-400 mb-3 flex items-center font-medium">
                  <span className="mr-2">📦</span>
                  Objects
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'pizza',
                    'soccer',
                    'basketball',
                    'music',
                    'water',
                    'coffee'
                  ].map((word) => (
                    <Button
                      key={word}
                      onClick={() => handleTileClick(word, 'noun')}
                      className="bg-[#3E4E67] hover:bg-[#4A5B76] text-white rounded-lg px-3 py-2 text-sm w-full"
                    >
                      {word}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Toolbox Actions - Desktop */}
              <div className="bg-[#2D3B4E] rounded-xl p-4">
                <Button
                  onClick={shuffleTiles}
                  className="w-full bg-[#3E4E67] hover:bg-[#4A5B76] text-white rounded-lg py-2 text-sm"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Shuffle Words
                </Button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}