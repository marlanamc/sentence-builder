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

  const [userStats, setUserStats] = useState({
    points: 180,
    streak: 3,
    correctAnswers: 11,
    completedLevels: [1],
    currentStreak: 3,
    nextLevelXP: 250,
    currentLevelProgress: 72
  })

  // Load user stats
  useEffect(() => {
    const savedStats = localStorage.getItem('userStats')
    if (savedStats) {
      setUserStats(JSON.parse(savedStats))
    }
  }, [])

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

      // Update stats with animations
      const newStats = {
        ...userStats,
        points: userStats.points + Math.round(validation.score * 20),
        correctAnswers: userStats.correctAnswers + 1,
        currentStreak: userStats.currentStreak + 1,
        currentLevelProgress: Math.min(userStats.currentLevelProgress + 15, 100)
      }

      if (!userStats.completedLevels.includes(currentLevel)) {
        newStats.completedLevels = [...userStats.completedLevels, currentLevel]
      }

      setUserStats(newStats)
      localStorage.setItem('userStats', JSON.stringify(newStats))

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Enhanced Header with Progress */}
        <Card className="border-2 border-blue-200 bg-white/80 backdrop-blur">
          <div className="p-6">
            {/* Navigation and Stats */}
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
                <div className="text-sm text-gray-600">Level {currentLevel}</div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Enhanced XP with progress bar */}
                <div className="flex flex-col items-end">
                  <motion.div
                    animate={{ scale: userStats.points > 180 ? [1, 1.1, 1] : 1 }}
                    className="flex items-center space-x-1"
                  >
                    <Trophy className="w-4 h-4 text-yellow-600" />
                    <span className="font-semibold text-yellow-800">{userStats.points} XP</span>
                  </motion.div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Progress value={userStats.currentLevelProgress} className="w-16 h-1" />
                    <span>{userStats.nextLevelXP - userStats.points} to next</span>
                  </div>
                </div>

                {/* Animated Streak */}
                <motion.div
                  animate={{
                    scale: userStats.streak > 3 ? [1, 1.1, 1] : 1,
                    boxShadow: userStats.streak > 5 ? ['0 0 0 rgba(236, 72, 153, 0)', '0 0 20px rgba(236, 72, 153, 0.5)', '0 0 0 rgba(236, 72, 153, 0)'] : 'none'
                  }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center space-x-1 bg-pink-100 text-pink-800 px-3 py-1 rounded-full"
                >
                  <Flame className="w-4 h-4" />
                  <span className="font-semibold">{userStats.streak}</span>
                </motion.div>
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Session Progress</span>
                <span className="font-semibold text-gray-800">{sentencesCompleted}/{targetSentences} sentences</span>
              </div>
              <Progress value={(sentencesCompleted / targetSentences) * 100} className="h-2" />
            </div>

            {/* Level Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">{level.name}</h1>
                <Badge variant="outline" className="bg-white/80 text-xs">{level.formula}</Badge>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">{level.explanation}</p>

              <div className="flex flex-wrap gap-2 text-xs">
                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
                  <strong>Examples:</strong> She eats pizza • I like books • They watch movies
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Enhanced Sentence Building Area */}
        <Card className="border border-gray-200 bg-white/80 backdrop-blur">
          <div className="p-6 space-y-6">
            {/* Header with Hint Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Build Your Sentence</h2>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={toggleHint}
                className="flex items-center space-x-1 text-xs"
              >
                <Lightbulb className="w-3 h-3" />
                <span>Hint</span>
              </Button>
            </div>

            {/* Hint Display */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800"
                >
                  <strong>Formula:</strong> Subject + Verb + Object
                  <br />
                  <strong>Example:</strong> I + eat + pizza = &quot;I eat pizza&quot;
                  <br />
                  <strong>Remember:</strong> he/she/it → adds -s (eats, likes, watches)
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sentence Display with Drop Zones */}
            <div className="min-h-[60px] p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 relative">
              {selectedTiles.length === 0 ? (
                <div className="text-center py-2">
                  <p className="text-gray-500">Click word tiles below to build your sentence...</p>
                  <div className="flex justify-center space-x-4 mt-2 text-xs text-gray-400">
                    <span className="bg-blue-100 px-2 py-1 rounded">Subject</span>
                    <span className="bg-purple-100 px-2 py-1 rounded">Verb</span>
                    <span className="bg-orange-100 px-2 py-1 rounded">Object</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
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
                          className={`${getCategoryColor(tile.category)} cursor-pointer hover:opacity-80 text-base px-3 py-2 shadow-sm rounded-full transition-all hover:shadow-md`}
                          onClick={() => removeTile(tile.id)}
                        >
                          {tile.word}
                          <span className="ml-2 text-xs opacity-70">×</span>
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Confetti Effect */}
              <AnimatePresence>
                {showConfetti && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{
                          opacity: 1,
                          scale: 0,
                          x: '50%',
                          y: '50%'
                        }}
                        animate={{
                          opacity: 0,
                          scale: 1,
                          x: `${50 + (Math.random() - 0.5) * 200}%`,
                          y: `${50 + (Math.random() - 0.5) * 200}%`,
                          rotate: Math.random() * 360
                        }}
                        transition={{ duration: 1.5, delay: i * 0.1 }}
                        className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full"
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex space-x-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={checkSentence}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full px-6 py-2 shadow-lg hover:shadow-xl transition-all"
                  disabled={selectedTiles.length === 0}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Check Sentence</span>
                </Button>
              </motion.div>

              <Button
                variant="outline"
                onClick={clearSentence}
                className="flex items-center space-x-2 bg-white hover:bg-gray-50 rounded-full px-6 py-2 shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Clear</span>
              </Button>
            </div>

            {/* Enhanced Feedback Display */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-4 rounded-xl ${
                    feedback.includes('Perfect') || feedback.includes('Correct') || feedback.includes('Excellent') || feedback.includes('Well done') || feedback.includes('Great') || feedback.includes('Fantastic') || feedback.includes('Outstanding')
                      ? 'bg-green-50 border border-green-200 text-green-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {feedback.includes('Perfect') || feedback.includes('Correct') || feedback.includes('Excellent') || feedback.includes('Well done') || feedback.includes('Great') || feedback.includes('Fantastic') || feedback.includes('Outstanding') ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5"
                      >
                        <CheckCircle className="w-4 h-4 text-white" />
                      </motion.div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <XCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <p className="font-medium leading-relaxed">{feedback}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>

        {/* Enhanced Word Categories */}
        <Card className="border border-gray-200 bg-white/80 backdrop-blur">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Word Tiles</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={shuffleTiles}
                className="flex items-center space-x-1 text-xs"
              >
                <Shuffle className="w-3 h-3" />
                <span>Shuffle</span>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Enhanced Categories with Icons */}
              {Object.entries(wordCategories).map(([categoryKey, words]) => {
                const Icon = getCategoryIcon(categoryKey)
                const categoryName = categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)

                return (
                  <div key={categoryKey}>
                    <div className="flex items-center space-x-2 mb-3">
                      <Icon className="w-4 h-4 text-gray-600" />
                      <h4 className="font-semibold text-gray-800">{categoryName}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {words.map((wordObj: { word: string; category: string; locked?: boolean }, index: number) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: wordObj.locked ? 1 : 1.05 }}
                          whileTap={{ scale: wordObj.locked ? 1 : 0.95 }}
                        >
                          <Button
                            variant="outline"
                            onClick={() => !wordObj.locked && handleTileClick(wordObj.word, wordObj.category)}
                            disabled={wordObj.locked}
                            className={`${getCategoryColor(wordObj.category, wordObj.locked)} transition-all shadow-sm hover:shadow-md relative`}
                          >
                            {wordObj.word}
                            {wordObj.toggleable && !wordObj.locked && (
                              <span className="ml-1 text-xs opacity-70">↔</span>
                            )}
                            {wordObj.locked && (
                              <div className="absolute -top-1 -right-1 text-xs bg-gray-500 text-white px-1 rounded-full">
                                L{currentLevel + 2}
                              </div>
                            )}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}