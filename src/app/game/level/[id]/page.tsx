'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, RotateCcw, Home, BookOpen, Star, Trophy, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import { comprehensiveLevels45, getLevelById } from '@/data/comprehensiveLevels45'
import { grammarEngine } from '@/lib/grammar-engine-instance'

export default function LevelPage() {
  const router = useRouter()
  const params = useParams()
  const levelId = parseInt(params.id as string)

  const [selectedTiles, setSelectedTiles] = useState<Array<{ word: string; category: string; originalWord: string }>>([])
  const [feedback, setFeedback] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [userStats, setUserStats] = useState({
    points: 180,
    streak: 3,
    correctAnswers: 11,
    completedLevels: [1, 2], // Include levels 1-2 as completed for users who reached level 3
    currentStreak: 3
  })
  const [levelProgress, setLevelProgress] = useState(0) // Track correct sentences for current level
  const [showLevelComplete, setShowLevelComplete] = useState(false) // Show completion animation
  const [grammarTipOpen, setGrammarTipOpen] = useState(false) // Control grammar tip visibility
  const [patternOpen, setPatternOpen] = useState(false) // Control pattern box visibility
  const [isEvaluating, setIsEvaluating] = useState(false) // Show evaluation animation
  const [usedPronouns, setUsedPronouns] = useState<string[]>([]) // Track used pronouns for variety
  const [lastCheckTime, setLastCheckTime] = useState(0) // Prevent double-checking

  // Load user stats
  useEffect(() => {
    const savedStats = localStorage.getItem('userStats')
    if (savedStats) {
      setUserStats(JSON.parse(savedStats))
    }
  }, [])

  // Get current level data
  const level = getLevelById(levelId)

  if (!level) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-2xl mx-auto text-center py-20">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Level Not Found</h1>
          <p className="text-gray-600 mb-6">The level you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/game/levels')}>
            Back to Levels
          </Button>
        </div>
      </div>
    )
  }

  // Enhanced word categories for this level with pronoun elimination
  const getWordCategories = () => {
    const allPronouns = [
      { word: 'I', category: 'pronoun', person: 'first', number: 'singular' },
      { word: 'you', category: 'pronoun', person: 'second', number: 'singular/plural' },
      { word: 'he', category: 'pronoun', person: 'third', number: 'singular' },
      { word: 'she', category: 'pronoun', person: 'third', number: 'singular' },
      { word: 'it', category: 'pronoun', person: 'third', number: 'singular' },
      { word: 'we', category: 'pronoun', person: 'first', number: 'plural' },
      { word: 'they', category: 'pronoun', person: 'third', number: 'plural' }
    ]

    // Filter out used pronouns to force variety
    const availablePronouns = allPronouns.filter(pronoun => !usedPronouns.includes(pronoun.word))

    const baseCategories = {
      subjects: availablePronouns,

      verbs: [
        { word: 'eat/eats', baseForm: 'eat', thirdPersonForm: 'eats', category: 'verb', toggleable: true },
        { word: 'like/likes', baseForm: 'like', thirdPersonForm: 'likes', category: 'verb', toggleable: true },
        { word: 'watch/watches', baseForm: 'watch', thirdPersonForm: 'watches', category: 'verb', toggleable: true },
        { word: 'play/plays', baseForm: 'play', thirdPersonForm: 'plays', category: 'verb', toggleable: true },
        { word: 'study/studies', baseForm: 'study', thirdPersonForm: 'studies', category: 'verb', toggleable: true },
        { word: 'work/works', baseForm: 'work', thirdPersonForm: 'works', category: 'verb', toggleable: true }
      ],

      objects: [
        { word: 'pizza', category: 'uncountable-noun', toggleable: false },
        { word: 'soccer', category: 'uncountable-noun', toggleable: false },
        { word: 'basketball', category: 'uncountable-noun', toggleable: false },
        { word: 'music', category: 'uncountable-noun', toggleable: false },
        { word: 'water', category: 'uncountable-noun', toggleable: false },
        { word: 'coffee', category: 'uncountable-noun', toggleable: false }
      ],

      articles: [
        { word: 'a', category: 'indefinite-article' },
        { word: 'an', category: 'indefinite-article' },
        { word: 'the', category: 'definite-article' }
      ],

      helpers: [
        { word: 'do', category: 'auxiliary', usage: 'I, you, we, they' },
        { word: 'does', category: 'auxiliary', usage: 'he, she, it' },
        { word: 'am', category: 'be-verb', usage: 'I' },
        { word: 'is', category: 'be-verb', usage: 'he, she, it' },
        { word: 'are', category: 'be-verb', usage: 'you, we, they' }
      ],

      negatives: [
        { word: 'not', category: 'negation' },
        { word: "don't", category: 'negative-contraction' },
        { word: "doesn't", category: 'negative-contraction' },
        { word: "isn't", category: 'negative-contraction' },
        { word: "aren't", category: 'negative-contraction' }
      ],

      'question-words': [
        { word: 'what', category: 'wh-question', asks: 'things' },
        { word: 'who', category: 'wh-question', asks: 'people' },
        { word: 'where', category: 'wh-question', asks: 'places' },
        { word: 'when', category: 'wh-question', asks: 'time' },
        { word: 'why', category: 'wh-question', asks: 'reasons' },
        { word: 'how', category: 'wh-question', asks: 'manner' }
      ]
    }

    return baseCategories
  }

  const wordCategories = getWordCategories()

  // Handle tile clicks with toggle functionality
  const handleTileClick = (word: string, category: string) => {
    const wordObj = { word, category, originalWord: word }

    // Handle toggleable words (verbs and objects)
    if (category === 'verb' && word.includes('/')) {
      const [form1, form2] = word.split('/')
      const currentForm = selectedTiles.find(tile => tile.originalWord === word)?.word || form1
      const newForm = currentForm === form1 ? form2 : form1

      const existingIndex = selectedTiles.findIndex(tile => tile.originalWord === word)
      if (existingIndex !== -1) {
        const newTiles = [...selectedTiles]
        newTiles[existingIndex] = { ...wordObj, word: newForm }
        setSelectedTiles(newTiles)
      } else {
        setSelectedTiles([...selectedTiles, { ...wordObj, word: form1 }])
      }
    } else if (category === 'countable-noun' && word.includes('/')) {
      const [singular, plural] = word.split('/')
      const currentForm = selectedTiles.find(tile => tile.originalWord === word)?.word || singular
      const newForm = currentForm === singular ? plural : singular

      const existingIndex = selectedTiles.findIndex(tile => tile.originalWord === word)
      if (existingIndex !== -1) {
        const newTiles = [...selectedTiles]
        newTiles[existingIndex] = { ...wordObj, word: newForm }
        setSelectedTiles(newTiles)
      } else {
        setSelectedTiles([...selectedTiles, { ...wordObj, word: singular }])
      }
    } else {
      setSelectedTiles([...selectedTiles, wordObj])
    }
  }

  // Check sentence using enhanced grammar engine
  const checkSentence = async () => {
    // Prevent double-checking within 500ms
    const now = Date.now()
    if (now - lastCheckTime < 500) {
      return
    }
    setLastCheckTime(now)

    if (selectedTiles.length === 0) {
      setFeedback('Please build a sentence first!')
      setShowFeedback(true)
      return
    }

    try {
      // Show evaluation animation
      setIsEvaluating(true)
      setShowFeedback(false)

      // Convert tiles to the format expected by grammar engine
      const tokens = selectedTiles.map(tile => ({
        word: tile.word,
        pos: tile.category,
        category: tile.category
      }))

      // Add small delay to show evaluation state
      await new Promise(resolve => setTimeout(resolve, 300))

      const validation = await grammarEngine.validateSentence(tokens, { levelId })

      // Check for semantic issues in grammatically correct sentences
      let finalFeedback = validation.feedback
      if (validation.isValid) {
        const sentenceText = tokens.map(t => t.word).join(' ').toLowerCase()

        // Check for illogical verb-object combinations
        if ((sentenceText.includes('eat') && (sentenceText.includes('soccer') || sentenceText.includes('basketball') || sentenceText.includes('music'))) ||
            (sentenceText.includes('play') && (sentenceText.includes('pizza') || sentenceText.includes('water') || sentenceText.includes('coffee')))) {
          finalFeedback = "Great grammar structure! 👍 But think about meaning: 'eat' goes with food (pizza, water), 'play' goes with sports (soccer, basketball). Try 'like' - it works with everything!"
        }
      }

      // Stop evaluation animation and show results
      setIsEvaluating(false)
      setFeedback(finalFeedback)
      setShowFeedback(true)

      // Update stats
      if (validation.isValid) {
        const newProgress = levelProgress + 1
        setLevelProgress(newProgress)

        // Track used pronouns for variety enforcement
        const usedPronoun = selectedTiles.find(tile => tile.category.includes('pronoun'))
        if (usedPronoun && !usedPronouns.includes(usedPronoun.word)) {
          setUsedPronouns([...usedPronouns, usedPronoun.word])
        }

        const pointsEarned = validation.pointsEarned || Math.round(validation.score * level.points) || 10

        const newStats = {
          ...userStats,
          points: userStats.points + pointsEarned,
          correctAnswers: userStats.correctAnswers + 1,
          currentStreak: userStats.currentStreak + 1
        }

        // Mark level as completed after 5 correct sentences
        if (newProgress >= 5 && !userStats.completedLevels.includes(levelId)) {
          newStats.completedLevels = [...userStats.completedLevels, levelId]
          setFeedback(`🎉 Level Complete! You've mastered ${level.name}. Ready for the next challenge?`)
          setShowLevelComplete(true)

          // Hide the animation after 4 seconds
          setTimeout(() => {
            setShowLevelComplete(false)
          }, 4000)
        }

        setUserStats(newStats)
        localStorage.setItem('userStats', JSON.stringify(newStats))
      }
    } catch (error) {
      console.error('Error checking sentence:', error)
      setIsEvaluating(false)
      setFeedback('Something went wrong. Please try again.')
      setShowFeedback(true)
    }
  }

  const clearSentence = () => {
    setSelectedTiles([])
    setFeedback('')
    setShowFeedback(false)
    setIsEvaluating(false)
  }

  const resetLevel = () => {
    setSelectedTiles([])
    setFeedback('')
    setShowFeedback(false)
    setIsEvaluating(false)
    setLevelProgress(0)
    setUsedPronouns([])
  }

  const removeTile = (index: number) => {
    const newTiles = selectedTiles.filter((_, i) => i !== index)
    setSelectedTiles(newTiles)
  }

  // Helper function to render markdown bold text in feedback
  const renderFeedbackText = (text: string) => {
    // Simple markdown bold rendering
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2)
        return <strong key={index}>{boldText}</strong>
      }
      return part
    })
  }

  // Color coding for word categories with icons (low-saturation pastels with black text)
  const getCategoryColor = (category: string) => {
    const colors = {
      'pronoun': 'bg-sky-200/80 border-sky-300/50 text-gray-900 hover:bg-sky-300/80',
      'verb': 'bg-purple-200/80 border-purple-300/50 text-gray-900 hover:bg-purple-300/80',
      'countable-noun': 'bg-orange-200/80 border-orange-300/50 text-gray-900 hover:bg-orange-300/80',
      'uncountable-noun': 'bg-orange-200/80 border-orange-300/50 text-gray-900 hover:bg-orange-300/80',
      'indefinite-article': 'bg-pink-200/80 border-pink-300/50 text-gray-900 hover:bg-pink-300/80',
      'definite-article': 'bg-pink-200/80 border-pink-300/50 text-gray-900 hover:bg-pink-300/80',
      'auxiliary': 'bg-violet-200/80 border-violet-300/50 text-gray-900 hover:bg-violet-300/80',
      'be-verb': 'bg-violet-200/80 border-violet-300/50 text-gray-900 hover:bg-violet-300/80',
      'negation': 'bg-red-200/80 border-red-300/50 text-gray-900 hover:bg-red-300/80',
      'negative-contraction': 'bg-red-200/80 border-red-300/50 text-gray-900 hover:bg-red-300/80',
      'wh-question': 'bg-emerald-200/80 border-emerald-300/50 text-gray-900 hover:bg-emerald-300/80'
    }
    return colors[category as keyof typeof colors] || 'bg-slate-200/80 border-slate-300/50 text-gray-900 hover:bg-slate-300/80'
  }

  const getCategoryIcon = (categoryName: string) => {
    const icons = {
      'subjects': '🙂',
      'verbs': '⚡',
      'objects': '📘',
      'articles': '📝',
      'helpers': '🔧',
      'negatives': '❌',
      'question-words': '❓'
    }
    return icons[categoryName as keyof typeof icons] || '📝'
  }

  // Generate clearer visual grammar cards for each level
  const getVisualGrammarCards = () => {
    const visualCards = {
      1: {
        title: "Basic Sentence Pattern",
        cards: [
          {
            explanation: "With I, you, we, they:",
            example: ['I', 'eat', 'pizza'],
            colors: ['bg-sky-200/80', 'bg-purple-200/80', 'bg-orange-200/80'],
            labels: ['Subject', 'Verb (base)', 'Object']
          },
          {
            explanation: "With he, she, it:",
            example: ['She', 'likes', 'music'],
            colors: ['bg-sky-200/80', 'bg-purple-200/80', 'bg-orange-200/80'],
            labels: ['Subject', 'Verb (+s)', 'Object']
          }
        ]
      },
      2: {
        title: "Articles Before Nouns",
        cards: [
          {
            explanation: "Use 'a' before consonant sounds:",
            example: ['I', 'eat', 'a', 'sandwich'],
            colors: ['bg-sky-200/80', 'bg-purple-200/80', 'bg-pink-200/80', 'bg-orange-200/80'],
            labels: ['Subject', 'Verb', 'Article', 'Noun']
          },
          {
            explanation: "Use 'an' before vowel sounds:",
            example: ['She', 'drinks', 'an', 'orange'],
            colors: ['bg-sky-200/80', 'bg-purple-200/80', 'bg-pink-200/80', 'bg-orange-200/80'],
            labels: ['Subject', 'Verb', 'Article', 'Noun']
          },
          {
            explanation: "Use 'the' for specific things:",
            example: ['We', 'read', 'the', 'book'],
            colors: ['bg-sky-200/80', 'bg-purple-200/80', 'bg-pink-200/80', 'bg-orange-200/80'],
            labels: ['Subject', 'Verb', 'Article', 'Noun']
          }
        ]
      },
      3: {
        title: "Making Negative Sentences",
        cards: [
          {
            explanation: "With I, you, we, they:",
            example: ['I', "don't", 'like', 'vegetables'],
            colors: ['bg-sky-200/80', 'bg-red-200/80', 'bg-purple-200/80', 'bg-orange-200/80'],
            labels: ['Subject', "don't", 'Base Verb', 'Object']
          },
          {
            explanation: "With he, she, it:",
            example: ['She', "doesn't", 'eat', 'meat'],
            colors: ['bg-sky-200/80', 'bg-red-200/80', 'bg-purple-200/80', 'bg-orange-200/80'],
            labels: ['Subject', "doesn't", 'Base Verb', 'Object']
          }
        ]
      },
      4: {
        title: "Yes/No Questions",
        cards: [
          {
            explanation: "With I, you, we, they:",
            example: ['Do', 'you', 'like', 'pizza?'],
            colors: ['bg-violet-200/80', 'bg-sky-200/80', 'bg-purple-200/80', 'bg-orange-200/80'],
            labels: ['Do', 'Subject', 'Base Verb', 'Object']
          },
          {
            explanation: "With he, she, it:",
            example: ['Does', 'she', 'eat', 'breakfast?'],
            colors: ['bg-violet-200/80', 'bg-sky-200/80', 'bg-purple-200/80', 'bg-orange-200/80'],
            labels: ['Does', 'Subject', 'Base Verb', 'Object']
          }
        ]
      },
      5: {
        title: "Wh-Questions (What)",
        cards: [
          {
            explanation: "Start with question word:",
            example: ['What', 'do', 'you', 'eat?'],
            colors: ['bg-emerald-200/80', 'bg-violet-200/80', 'bg-sky-200/80', 'bg-purple-200/80'],
            labels: ['Question', 'Helper', 'Subject', 'Verb']
          },
          {
            explanation: "With he, she, it:",
            example: ['What', 'does', 'she', 'study?'],
            colors: ['bg-emerald-200/80', 'bg-violet-200/80', 'bg-sky-200/80', 'bg-purple-200/80'],
            labels: ['Question', 'Helper', 'Subject', 'Verb']
          }
        ]
      },
      6: {
        title: "Wh-Questions (Who/Where/When)",
        cards: [
          {
            explanation: "Different question words:",
            example: ['Where', 'do', 'you', 'live?'],
            colors: ['bg-emerald-200/80', 'bg-violet-200/80', 'bg-sky-200/80', 'bg-purple-200/80'],
            labels: ['Where', 'Helper', 'Subject', 'Verb']
          },
          {
            explanation: "Who asks about people:",
            example: ['Who', 'does', 'she', 'know?'],
            colors: ['bg-emerald-200/80', 'bg-violet-200/80', 'bg-sky-200/80', 'bg-purple-200/80'],
            labels: ['Who', 'Helper', 'Subject', 'Verb']
          }
        ]
      },
      7: {
        title: "Present Continuous",
        cards: [
          {
            explanation: "Actions happening now:",
            example: ['I', 'am', 'eating', 'lunch'],
            colors: ['bg-sky-200/80', 'bg-violet-200/80', 'bg-purple-200/80', 'bg-orange-200/80'],
            labels: ['Subject', 'am/is/are', 'Verb-ing', 'Object']
          },
          {
            explanation: "With he, she, it:",
            example: ['She', 'is', 'studying', 'English'],
            colors: ['bg-sky-200/80', 'bg-violet-200/80', 'bg-purple-200/80', 'bg-orange-200/80'],
            labels: ['Subject', 'is', 'Verb-ing', 'Object']
          }
        ]
      },
      8: {
        title: "Present Continuous Questions",
        cards: [
          {
            explanation: "What are you doing?",
            example: ['What', 'are', 'you', 'doing?'],
            colors: ['bg-emerald-200/80', 'bg-violet-200/80', 'bg-sky-200/80', 'bg-purple-200/80'],
            labels: ['Question', 'are', 'Subject', 'Verb-ing']
          },
          {
            explanation: "Where is she going?",
            example: ['Where', 'is', 'she', 'going?'],
            colors: ['bg-emerald-200/80', 'bg-violet-200/80', 'bg-sky-200/80', 'bg-purple-200/80'],
            labels: ['Question', 'is', 'Subject', 'Verb-ing']
          }
        ]
      },
      // Levels 9-12: Time Expressions
      9: {
        title: "Time Prepositions",
        cards: [
          {
            explanation: "Use 'at' for specific times:",
            example: ['I', 'work', 'at', '9 AM'],
            colors: ['bg-sky-200/80', 'bg-purple-200/80', 'bg-yellow-200/80', 'bg-orange-200/80'],
            labels: ['Subject', 'Verb', 'At', 'Time']
          },
          {
            explanation: "Use 'on' for days and dates:",
            example: ['She', 'studies', 'on', 'Monday'],
            colors: ['bg-sky-200/80', 'bg-purple-200/80', 'bg-yellow-200/80', 'bg-orange-200/80'],
            labels: ['Subject', 'Verb', 'On', 'Day']
          }
        ]
      },
      10: {
        title: "Frequency Adverbs",
        cards: [
          {
            explanation: "Adverbs before main verbs:",
            example: ['I', 'always', 'eat', 'breakfast'],
            colors: ['bg-sky-200/80', 'bg-yellow-200/80', 'bg-purple-200/80', 'bg-orange-200/80'],
            labels: ['Subject', 'Always', 'Verb', 'Object']
          },
          {
            explanation: "But after 'be' verbs:",
            example: ['She', 'is', 'usually', 'happy'],
            colors: ['bg-sky-200/80', 'bg-violet-200/80', 'bg-yellow-200/80', 'bg-orange-200/80'],
            labels: ['Subject', 'Be', 'Usually', 'Adjective']
          }
        ]
      },
      // Levels 13-17: Past Tense
      13: {
        title: "Past Simple Affirmative",
        cards: [
          {
            explanation: "Regular verbs add -ed:",
            example: ['I', 'played', 'soccer', 'yesterday'],
            colors: ['bg-sky-200/80', 'bg-purple-200/80', 'bg-orange-200/80', 'bg-yellow-200/80'],
            labels: ['Subject', 'V2 (-ed)', 'Object', 'Time']
          },
          {
            explanation: "Irregular verbs change:",
            example: ['She', 'went', 'home', 'early'],
            colors: ['bg-sky-200/80', 'bg-purple-200/80', 'bg-orange-200/80', 'bg-yellow-200/80'],
            labels: ['Subject', 'V2 (went)', 'Object', 'Time']
          }
        ]
      },
      14: {
        title: "Past Simple Negative",
        cards: [
          {
            explanation: "Use didn't + base verb:",
            example: ['I', "didn't", 'go', 'yesterday'],
            colors: ['bg-sky-200/80', 'bg-red-200/80', 'bg-purple-200/80', 'bg-yellow-200/80'],
            labels: ['Subject', "Didn't", 'Base Verb', 'Time']
          },
          {
            explanation: "Same for all subjects:",
            example: ['She', "didn't", 'eat', 'lunch'],
            colors: ['bg-sky-200/80', 'bg-red-200/80', 'bg-purple-200/80', 'bg-orange-200/80'],
            labels: ['Subject', "Didn't", 'Base Verb', 'Object']
          }
        ]
      },
      15: {
        title: "Past Simple Questions",
        cards: [
          {
            explanation: "Did + subject + base verb:",
            example: ['Did', 'you', 'see', 'the movie?'],
            colors: ['bg-violet-200/80', 'bg-sky-200/80', 'bg-purple-200/80', 'bg-orange-200/80'],
            labels: ['Did', 'Subject', 'Base Verb', 'Object']
          },
          {
            explanation: "Same structure for all:",
            example: ['Did', 'she', 'finish', 'homework?'],
            colors: ['bg-violet-200/80', 'bg-sky-200/80', 'bg-purple-200/80', 'bg-orange-200/80'],
            labels: ['Did', 'Subject', 'Base Verb', 'Object']
          }
        ]
      },
      // Levels 18-24: Present Perfect
      18: {
        title: "Present Perfect Introduction",
        cards: [
          {
            explanation: "Have/has + past participle:",
            example: ['I', 'have', 'visited', 'Paris'],
            colors: ['bg-sky-200/80', 'bg-violet-200/80', 'bg-purple-200/80', 'bg-orange-200/80'],
            labels: ['Subject', 'Have', 'V3', 'Object']
          },
          {
            explanation: "Has with he/she/it:",
            example: ['She', 'has', 'finished', 'work'],
            colors: ['bg-sky-200/80', 'bg-violet-200/80', 'bg-purple-200/80', 'bg-orange-200/80'],
            labels: ['Subject', 'Has', 'V3', 'Object']
          }
        ]
      },
      19: {
        title: "Present Perfect Experience",
        cards: [
          {
            explanation: "Ever in questions:",
            example: ['Have', 'you', 'ever', 'been', 'to Japan?'],
            colors: ['bg-violet-200/80', 'bg-sky-200/80', 'bg-emerald-200/80', 'bg-purple-200/80', 'bg-orange-200/80'],
            labels: ['Have', 'Subject', 'Ever', 'V3', 'Place']
          },
          {
            explanation: "Never in answers:",
            example: ['I', 'have', 'never', 'seen', 'snow'],
            colors: ['bg-sky-200/80', 'bg-violet-200/80', 'bg-red-200/80', 'bg-purple-200/80', 'bg-orange-200/80'],
            labels: ['Subject', 'Have', 'Never', 'V3', 'Object']
          }
        ]
      },
      // Levels 20-24: Advanced Present Perfect
      20: {
        title: "Present Perfect Recent Actions",
        cards: [
          {
            explanation: "Just for very recent actions:",
            example: ['I', 'have', 'just', 'finished', 'homework'],
            colors: ['bg-sky-200/80', 'bg-violet-200/80', 'bg-emerald-200/80', 'bg-purple-200/80', 'bg-orange-200/80'],
            labels: ['Subject', 'Have', 'Just', 'V3', 'Object']
          },
          {
            explanation: "Already for completed actions:",
            example: ['She', 'has', 'already', 'eaten', 'lunch'],
            colors: ['bg-sky-200/80', 'bg-violet-200/80', 'bg-emerald-200/80', 'bg-purple-200/80', 'bg-orange-200/80'],
            labels: ['Subject', 'Has', 'Already', 'V3', 'Object']
          }
        ]
      },
      21: {
        title: "Present Perfect Duration",
        cards: [
          {
            explanation: "For + period of time:",
            example: ['I', 'have', 'lived', 'here', 'for 5 years'],
            colors: ['bg-sky-200/80', 'bg-violet-200/80', 'bg-purple-200/80', 'bg-orange-200/80', 'bg-yellow-200/80'],
            labels: ['Subject', 'Have', 'V3', 'Place', 'For + Period']
          },
          {
            explanation: "Since + starting point:",
            example: ['She', 'has', 'worked', 'here', 'since 2019'],
            colors: ['bg-sky-200/80', 'bg-violet-200/80', 'bg-purple-200/80', 'bg-orange-200/80', 'bg-yellow-200/80'],
            labels: ['Subject', 'Has', 'V3', 'Place', 'Since + Start']
          }
        ]
      },
      22: {
        title: "Present Perfect vs Past Simple",
        cards: [
          {
            explanation: "Finished time = Past Simple:",
            example: ['I', 'ate', 'pizza', 'yesterday'],
            colors: ['bg-sky-200/80', 'bg-purple-200/80', 'bg-orange-200/80', 'bg-red-200/80'],
            labels: ['Subject', 'V2', 'Object', 'Finished Time']
          },
          {
            explanation: "Unfinished time = Present Perfect:",
            example: ['I', 'have', 'eaten', 'pizza', 'today'],
            colors: ['bg-sky-200/80', 'bg-violet-200/80', 'bg-purple-200/80', 'bg-orange-200/80', 'bg-green-200/80'],
            labels: ['Subject', 'Have', 'V3', 'Object', 'Unfinished Time']
          }
        ]
      },
      23: {
        title: "Present Perfect with Yet/Still",
        cards: [
          {
            explanation: "Yet in questions:",
            example: ['Have', 'you', 'finished', 'yet?'],
            colors: ['bg-violet-200/80', 'bg-sky-200/80', 'bg-purple-200/80', 'bg-emerald-200/80'],
            labels: ['Have', 'Subject', 'V3', 'Yet']
          },
          {
            explanation: "Yet in negatives:",
            example: ['I', "haven't", 'finished', 'yet'],
            colors: ['bg-sky-200/80', 'bg-red-200/80', 'bg-purple-200/80', 'bg-emerald-200/80'],
            labels: ['Subject', "Haven't", 'V3', 'Yet']
          }
        ]
      },
      // Levels 25-28: Future Tenses
      25: {
        title: "Going to Future",
        cards: [
          {
            explanation: "Plans and intentions:",
            example: ['I', 'am', 'going to', 'study', 'tonight'],
            colors: ['bg-sky-200/80', 'bg-violet-200/80', 'bg-indigo-200/80', 'bg-purple-200/80', 'bg-yellow-200/80'],
            labels: ['Subject', 'Am/Is/Are', 'Going to', 'V1', 'Time']
          },
          {
            explanation: "Predictions with evidence:",
            example: ['It', 'is', 'going to', 'rain', 'soon'],
            colors: ['bg-sky-200/80', 'bg-violet-200/80', 'bg-indigo-200/80', 'bg-purple-200/80', 'bg-yellow-200/80'],
            labels: ['Subject', 'Is', 'Going to', 'V1', 'Time']
          }
        ]
      },
      26: {
        title: "Will Future",
        cards: [
          {
            explanation: "Spontaneous decisions:",
            example: ['I', 'will', 'help', 'you', 'tomorrow'],
            colors: ['bg-sky-200/80', 'bg-indigo-200/80', 'bg-purple-200/80', 'bg-orange-200/80', 'bg-yellow-200/80'],
            labels: ['Subject', 'Will', 'V1', 'Object', 'Time']
          },
          {
            explanation: "Promises and predictions:",
            example: ['She', 'will', 'arrive', 'at 6 PM'],
            colors: ['bg-sky-200/80', 'bg-indigo-200/80', 'bg-purple-200/80', 'bg-yellow-200/80'],
            labels: ['Subject', 'Will', 'V1', 'Time']
          }
        ]
      },
      27: {
        title: "Future Questions",
        cards: [
          {
            explanation: "Will questions:",
            example: ['Will', 'you', 'come', 'to the party?'],
            colors: ['bg-indigo-200/80', 'bg-sky-200/80', 'bg-purple-200/80', 'bg-orange-200/80'],
            labels: ['Will', 'Subject', 'V1', 'Object']
          },
          {
            explanation: "Going to questions:",
            example: ['Are', 'you', 'going to', 'study?'],
            colors: ['bg-violet-200/80', 'bg-sky-200/80', 'bg-indigo-200/80', 'bg-purple-200/80'],
            labels: ['Are', 'Subject', 'Going to', 'V1']
          }
        ]
      },
      // Levels 29-35: Conditionals & Modal Verbs
      29: {
        title: "Zero Conditional",
        cards: [
          {
            explanation: "Facts and general truths:",
            example: ['If', 'you', 'heat', 'water,', 'it boils'],
            colors: ['bg-yellow-200/80', 'bg-sky-200/80', 'bg-purple-200/80', 'bg-orange-200/80', 'bg-green-200/80'],
            labels: ['If', 'Subject', 'V1', 'Object,', 'Result']
          },
          {
            explanation: "Rules and instructions:",
            example: ['If', 'you', 'press', 'this,', 'it works'],
            colors: ['bg-yellow-200/80', 'bg-sky-200/80', 'bg-purple-200/80', 'bg-orange-200/80', 'bg-green-200/80'],
            labels: ['If', 'Subject', 'V1', 'Object,', 'Result']
          }
        ]
      },
      30: {
        title: "First Conditional",
        cards: [
          {
            explanation: "Real future possibilities:",
            example: ['If', 'it', 'rains,', 'I', 'will stay home'],
            colors: ['bg-yellow-200/80', 'bg-sky-200/80', 'bg-purple-200/80', 'bg-sky-200/80', 'bg-indigo-200/80'],
            labels: ['If', 'Subject', 'V1,', 'Subject', 'Will + V1']
          },
          {
            explanation: "Likely future results:",
            example: ['If', 'you', 'study,', 'you', 'will pass'],
            colors: ['bg-yellow-200/80', 'bg-sky-200/80', 'bg-purple-200/80', 'bg-sky-200/80', 'bg-indigo-200/80'],
            labels: ['If', 'Subject', 'V1,', 'Subject', 'Will + V1']
          }
        ]
      },
      31: {
        title: "Can for Ability",
        cards: [
          {
            explanation: "Things you're able to do:",
            example: ['I', 'can', 'speak', 'three', 'languages'],
            colors: ['bg-sky-200/80', 'bg-indigo-200/80', 'bg-purple-200/80', 'bg-orange-200/80', 'bg-orange-200/80'],
            labels: ['Subject', 'Can', 'V1', 'Number', 'Object']
          },
          {
            explanation: "Asking about ability:",
            example: ['Can', 'you', 'drive', 'a car?'],
            colors: ['bg-indigo-200/80', 'bg-sky-200/80', 'bg-purple-200/80', 'bg-orange-200/80'],
            labels: ['Can', 'Subject', 'V1', 'Object']
          }
        ]
      },
      32: {
        title: "Should for Advice",
        cards: [
          {
            explanation: "Giving advice:",
            example: ['You', 'should', 'exercise', 'more', 'often'],
            colors: ['bg-sky-200/80', 'bg-indigo-200/80', 'bg-purple-200/80', 'bg-yellow-200/80', 'bg-yellow-200/80'],
            labels: ['Subject', 'Should', 'V1', 'More', 'Frequency']
          },
          {
            explanation: "Asking for advice:",
            example: ['Should', 'I', 'call', 'the', 'doctor?'],
            colors: ['bg-indigo-200/80', 'bg-sky-200/80', 'bg-purple-200/80', 'bg-pink-200/80', 'bg-orange-200/80'],
            labels: ['Should', 'Subject', 'V1', 'Article', 'Object']
          }
        ]
      },
      33: {
        title: "Must for Obligation",
        cards: [
          {
            explanation: "Strong obligation:",
            example: ['You', 'must', 'wear', 'a', 'seatbelt'],
            colors: ['bg-sky-200/80', 'bg-indigo-200/80', 'bg-purple-200/80', 'bg-pink-200/80', 'bg-orange-200/80'],
            labels: ['Subject', 'Must', 'V1', 'Article', 'Object']
          },
          {
            explanation: "Rules and laws:",
            example: ['Students', 'must', 'attend', 'all', 'classes'],
            colors: ['bg-sky-200/80', 'bg-indigo-200/80', 'bg-purple-200/80', 'bg-yellow-200/80', 'bg-orange-200/80'],
            labels: ['Subject', 'Must', 'V1', 'All', 'Object']
          }
        ]
      },
      // Levels 36-40: Advanced Grammar
      36: {
        title: "Past Perfect",
        cards: [
          {
            explanation: "Action before another past action:",
            example: ['I', 'had', 'finished', 'before', 'she arrived'],
            colors: ['bg-sky-200/80', 'bg-violet-200/80', 'bg-purple-200/80', 'bg-yellow-200/80', 'bg-red-200/80'],
            labels: ['Subject', 'Had', 'V3', 'Before', 'Past Event']
          },
          {
            explanation: "Earlier past action:",
            example: ['She', 'had', 'left', 'when', 'I called'],
            colors: ['bg-sky-200/80', 'bg-violet-200/80', 'bg-purple-200/80', 'bg-yellow-200/80', 'bg-red-200/80'],
            labels: ['Subject', 'Had', 'V3', 'When', 'Past Event']
          }
        ]
      },
      37: {
        title: "Second Conditional",
        cards: [
          {
            explanation: "Imaginary present situations:",
            example: ['If', 'I', 'were', 'rich,', 'I would travel'],
            colors: ['bg-yellow-200/80', 'bg-sky-200/80', 'bg-purple-200/80', 'bg-orange-200/80', 'bg-indigo-200/80'],
            labels: ['If', 'Subject', 'Were/V2,', 'Object,', 'Would + V1']
          },
          {
            explanation: "Unlikely situations:",
            example: ['If', 'it', 'rained,', 'we', 'would stay home'],
            colors: ['bg-yellow-200/80', 'bg-sky-200/80', 'bg-purple-200/80', 'bg-sky-200/80', 'bg-indigo-200/80'],
            labels: ['If', 'Subject', 'V2,', 'Subject', 'Would + V1']
          }
        ]
      },
      38: {
        title: "Third Conditional",
        cards: [
          {
            explanation: "Imaginary past situations:",
            example: ['If', 'I', 'had', 'studied,', 'I would have passed'],
            colors: ['bg-yellow-200/80', 'bg-sky-200/80', 'bg-violet-200/80', 'bg-purple-200/80', 'bg-indigo-200/80'],
            labels: ['If', 'Subject', 'Had', 'V3,', 'Would Have + V3']
          },
          {
            explanation: "Regrets about the past:",
            example: ['If', 'she', 'had', 'come,', 'we would have won'],
            colors: ['bg-yellow-200/80', 'bg-sky-200/80', 'bg-violet-200/80', 'bg-purple-200/80', 'bg-indigo-200/80'],
            labels: ['If', 'Subject', 'Had', 'V3,', 'Would Have + V3']
          }
        ]
      },
      // Levels 41-47: Advanced Topics
      41: {
        title: "Passive Voice - Present",
        cards: [
          {
            explanation: "Present passive structure:",
            example: ['The', 'cake', 'is', 'made', 'by Maria'],
            colors: ['bg-pink-200/80', 'bg-sky-200/80', 'bg-violet-200/80', 'bg-purple-200/80', 'bg-gray-200/80'],
            labels: ['Article', 'Subject', 'Is/Are', 'V3', 'By + Agent']
          },
          {
            explanation: "Focus on the action:",
            example: ['English', 'is', 'spoken', 'here'],
            colors: ['bg-sky-200/80', 'bg-violet-200/80', 'bg-purple-200/80', 'bg-orange-200/80'],
            labels: ['Subject', 'Is', 'V3', 'Location']
          }
        ]
      },
      42: {
        title: "Reported Speech",
        cards: [
          {
            explanation: "Reporting statements:",
            example: ['She', 'said', 'that', 'she', 'was tired'],
            colors: ['bg-sky-200/80', 'bg-purple-200/80', 'bg-gray-200/80', 'bg-sky-200/80', 'bg-orange-200/80'],
            labels: ['Subject', 'Said', 'That', 'Subject', 'Past Tense']
          },
          {
            explanation: "Reporting questions:",
            example: ['He', 'asked', 'where', 'I', 'lived'],
            colors: ['bg-sky-200/80', 'bg-purple-200/80', 'bg-emerald-200/80', 'bg-sky-200/80', 'bg-purple-200/80'],
            labels: ['Subject', 'Asked', 'Wh-word', 'Subject', 'V2']
          }
        ]
      },
      43: {
        title: "Relative Clauses",
        cards: [
          {
            explanation: "Who for people:",
            example: ['The', 'man', 'who', 'called', 'is here'],
            colors: ['bg-pink-200/80', 'bg-sky-200/80', 'bg-emerald-200/80', 'bg-purple-200/80', 'bg-orange-200/80'],
            labels: ['Article', 'Person', 'Who', 'V2', 'Location']
          },
          {
            explanation: "Which for things:",
            example: ['The', 'book', 'which', 'I', 'read was good'],
            colors: ['bg-pink-200/80', 'bg-sky-200/80', 'bg-emerald-200/80', 'bg-sky-200/80', 'bg-orange-200/80'],
            labels: ['Article', 'Thing', 'Which', 'Subject', 'Description']
          }
        ]
      }
    }

    return visualCards[levelId as keyof typeof visualCards] || {
      title: "Grammar Pattern",
      cards: [{
        explanation: "Follow the word order:",
        example: ['Subject', 'Verb', 'Object'],
        colors: ['bg-gray-200/80', 'bg-gray-200/80', 'bg-gray-200/80'],
        labels: ['Who', 'Action', 'What']
      }]
    }
  }

  const nextLevel = () => {
    const nextLevelId = levelId + 1
    const nextLevelData = getLevelById(nextLevelId)
    if (nextLevelData) {
      router.push(`/game/level/${nextLevelId}`)
    } else {
      router.push('/game/levels')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      <style jsx>{`
        @keyframes bounce-once {
          0%, 20%, 53%, 80%, 100% {
            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
            transform: translate3d(0, 0, 0);
          }
          40%, 43% {
            animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
            transform: translate3d(0, -30px, 0);
          }
          70% {
            animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
            transform: translate3d(0, -15px, 0);
          }
          90% {
            transform: translate3d(0, -4px, 0);
          }
        }
        .animate-bounce-once {
          animation: bounce-once 0.6s ease-out;
        }
      `}</style>
      {/* Subtle Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/30 to-purple-900/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-600/10 to-yellow-600/10 rounded-full filter blur-3xl"></div>
      </div>


      {/* Level Complete Animation */}
      {showLevelComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-8 rounded-3xl shadow-2xl transform animate-pulse">
            <div className="text-center space-y-4">
              <div className="text-6xl animate-bounce">🎉</div>
              <h2 className="text-3xl font-bold text-white">Good Job!</h2>
              <p className="text-xl text-white/90">You've completed {level.name}!</p>
              <div className="text-2xl animate-pulse">Let's continue! 🚀</div>
            </div>
          </div>
        </div>
      )}

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen p-2 pt-16">
        <div className="max-w-5xl mx-auto space-y-3">

          {/* Header with navigation */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/game/levels')}
                className="flex items-center space-x-2 bg-gray-800/80 text-gray-200 border-gray-600 hover:bg-gray-700 hover:shadow-md rounded-full backdrop-blur-sm transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Levels</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/')}
                className="flex items-center space-x-2 bg-gray-800/80 text-gray-200 border-gray-600 hover:bg-gray-700 hover:shadow-md rounded-full backdrop-blur-sm transition-all"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-full p-1 shadow-sm border border-slate-600/30">
            <div className="flex items-center justify-between px-3 py-1">
              <span className="text-xs font-medium text-slate-300">Level {level.id} of 47</span>
              <div className="flex-1 mx-3 bg-slate-700/50 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-sky-400 to-purple-400 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${(level.id / 47) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-slate-400">{Math.round((level.id / 47) * 100)}%</span>
            </div>
          </div>

          {/* Lesson Card */}
          <Card className="bg-slate-800/90 backdrop-blur-sm shadow-lg border-0 rounded-2xl border border-slate-700/50">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                    {level.name}
                  </h1>
                  {userStats.completedLevels.includes(levelId) && (
                    <Badge className="bg-green-200/80 text-green-800 border-green-300 rounded-full px-2 py-0.5 text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      ✓
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                <div className="bg-blue-100/80 rounded-xl border border-blue-200/50 overflow-hidden">
                  <button
                    onClick={() => setPatternOpen(!patternOpen)}
                    className="w-full p-3 flex items-center justify-between hover:bg-blue-200/40 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-sm">📝</span>
                      <strong className="text-gray-900 text-sm">Pattern</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-200/70 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
                        {level.formula}
                      </div>
                      {patternOpen ? (
                        <ChevronUp className="w-4 h-4 text-gray-700" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-700" />
                      )}
                    </div>
                  </button>
                  {patternOpen && (
                    <div className="px-3 pb-3">
                      <div className="bg-blue-50/80 rounded-lg p-4 border border-blue-200/60">
                        <div className="space-y-2">
                          <div className="text-xs text-gray-700">
                            <strong>How to build:</strong>
                          </div>
                          {(() => {
                            // Smart pattern detection system for all 47 levels
                            const getPatternForLevel = () => {
                              const levelName = level.name.toLowerCase()
                              const formula = level.formula.toLowerCase()

                              // Helper function to create pattern components
                              const createComponent = (text: string, color: string, label: string) => (
                                <div className="text-center">
                                  <div className={`${color} border border-gray-300/50 text-gray-900 px-2 py-1 rounded-full text-xs font-medium`}>
                                    {text}
                                  </div>
                                  <div className="text-xs text-gray-600 mt-0.5">{label}</div>
                                </div>
                              )

                              // Pattern templates based on formula and level characteristics
                              if (levelName.includes('negative') || formula.includes('not')) {
                                const contractions = levelName.includes('past') ?
                                  [{ from: "did not", to: "didn't" }] :
                                  [{ from: "do not", to: "don't" }, { from: "does not", to: "doesn't" }]

                                return (
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-center space-x-1">
                                      {createComponent('Subject', 'bg-sky-200/80', 'Who')}
                                      <span className="text-gray-500 text-xs">+</span>
                                      {createComponent(levelName.includes('past') ? "didn't" : 'do/does', 'bg-violet-200/80', 'Helper')}
                                      <span className="text-gray-500 text-xs">+</span>
                                      {createComponent('not', 'bg-red-200/80', 'Negative')}
                                      <span className="text-gray-500 text-xs">+</span>
                                      {createComponent('Verb', 'bg-purple-200/80', 'Action')}
                                      <span className="text-gray-500 text-xs">+</span>
                                      {createComponent('Object', 'bg-orange-200/80', 'What')}
                                    </div>
                                    <div className="text-center">
                                      <div className="text-xs text-gray-600 mb-1">💡 <strong>Tip:</strong> You can use contractions for natural speech</div>
                                      <div className="flex items-center justify-center space-x-2 text-xs">
                                        {contractions.map((c, i) => (
                                          <span key={i} className="bg-gray-100 px-2 py-1 rounded text-gray-700">{c.from} → {c.to}</span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )
                              }

                              if (levelName.includes('question') || formula.includes('?')) {
                                if (levelName.includes('yes/no') || levelName.includes('yes') || levelName.includes('no')) {
                                  const helper = levelName.includes('past') ? 'Did' :
                                                levelName.includes('continuous') ? 'am/is/are' :
                                                levelName.includes('perfect') ? 'Have/Has' : 'Do/Does'

                                  return (
                                    <div className="flex items-center justify-center space-x-1">
                                      {createComponent(helper, 'bg-violet-200/80', 'Helper')}
                                      <span className="text-gray-500 text-xs">+</span>
                                      {createComponent('Subject', 'bg-sky-200/80', 'Who')}
                                      <span className="text-gray-500 text-xs">+</span>
                                      {createComponent('Verb', 'bg-purple-200/80', 'Action')}
                                      <span className="text-gray-500 text-xs">+</span>
                                      {createComponent('Object?', 'bg-orange-200/80', 'What')}
                                    </div>
                                  )
                                } else {
                                  // Wh-questions
                                  const helper = levelName.includes('past') ? 'did' :
                                                levelName.includes('continuous') ? 'am/is/are' :
                                                levelName.includes('perfect') ? 'have/has' : 'do/does'

                                  return (
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-center space-x-1">
                                        {createComponent('Wh-word', 'bg-emerald-200/80', 'Question')}
                                        <span className="text-gray-500 text-xs">+</span>
                                        {createComponent(helper, 'bg-violet-200/80', 'Helper')}
                                        <span className="text-gray-500 text-xs">+</span>
                                        {createComponent('Subject', 'bg-sky-200/80', 'Who')}
                                        <span className="text-gray-500 text-xs">+</span>
                                        {createComponent('Verb', 'bg-purple-200/80', 'Action')}
                                      </div>
                                      <div className="text-center">
                                        <div className="text-xs text-gray-600 mb-1">
                                          💡 <strong>Tip:</strong> {levelName.includes('what') ? 'What asks about things or actions' :
                                                                   'Who = people, Where = places, When = time, Why = reasons'}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                }
                              }

                              if (levelName.includes('continuous') || formula.includes('ing')) {
                                const helper = levelName.includes('past') ? 'was/were' : 'am/is/are'
                                return (
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-center space-x-1">
                                      {createComponent('Subject', 'bg-sky-200/80', 'Who')}
                                      <span className="text-gray-500 text-xs">+</span>
                                      {createComponent(helper, 'bg-violet-200/80', 'Be verb')}
                                      <span className="text-gray-500 text-xs">+</span>
                                      {createComponent('Verb-ing', 'bg-purple-200/80', 'Action')}
                                      <span className="text-gray-500 text-xs">+</span>
                                      {createComponent('Object', 'bg-orange-200/80', 'What')}
                                    </div>
                                    <div className="text-center">
                                      <div className="text-xs text-gray-600 mb-1">
                                        💡 <strong>Tip:</strong> {levelName.includes('past') ? 'For ongoing actions in the past' : 'For actions happening now! Add -ing to verbs'}
                                      </div>
                                      {!levelName.includes('past') && (
                                        <div className="flex items-center justify-center space-x-2 text-xs">
                                          <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">I am → I'm</span>
                                          <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">You are → You're</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )
                              }

                              if (levelName.includes('perfect') || formula.includes('have') || formula.includes('has')) {
                                return (
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-center space-x-1">
                                      {createComponent('Subject', 'bg-sky-200/80', 'Who')}
                                      <span className="text-gray-500 text-xs">+</span>
                                      {createComponent('have/has', 'bg-violet-200/80', 'Helper')}
                                      <span className="text-gray-500 text-xs">+</span>
                                      {createComponent('V3', 'bg-purple-200/80', 'Past Participle')}
                                      <span className="text-gray-500 text-xs">+</span>
                                      {createComponent('Object', 'bg-orange-200/80', 'What')}
                                    </div>
                                    <div className="text-center">
                                      <div className="text-xs text-gray-600 mb-1">💡 <strong>Tip:</strong> For experiences or actions with present relevance</div>
                                      <div className="flex items-center justify-center space-x-2 text-xs">
                                        <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">I have → I've</span>
                                        <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">She has → She's</span>
                                      </div>
                                    </div>
                                  </div>
                                )
                              }

                              if (levelName.includes('past') || formula.includes('v2') || levelName.includes('did')) {
                                if (levelName.includes('passive')) {
                                  return (
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-center space-x-1">
                                        {createComponent('Subject', 'bg-sky-200/80', 'Who/What')}
                                        <span className="text-gray-500 text-xs">+</span>
                                        {createComponent('was/were', 'bg-violet-200/80', 'Be verb')}
                                        <span className="text-gray-500 text-xs">+</span>
                                        {createComponent('V3', 'bg-purple-200/80', 'Past Participle')}
                                        <span className="text-gray-500 text-xs">+</span>
                                        {createComponent('by + agent', 'bg-gray-200/80', 'Who did it')}
                                      </div>
                                      <div className="text-center">
                                        <div className="text-xs text-gray-600 mb-1">💡 <strong>Tip:</strong> Focus on the action, not who did it</div>
                                      </div>
                                    </div>
                                  )
                                } else {
                                  return (
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-center space-x-1">
                                        {createComponent('Subject', 'bg-sky-200/80', 'Who')}
                                        <span className="text-gray-500 text-xs">+</span>
                                        {createComponent('V2', 'bg-purple-200/80', 'Past Verb')}
                                        <span className="text-gray-500 text-xs">+</span>
                                        {createComponent('Object', 'bg-orange-200/80', 'What')}
                                        <span className="text-gray-500 text-xs">+</span>
                                        {createComponent('Time', 'bg-yellow-200/80', 'When')}
                                      </div>
                                      <div className="text-center">
                                        <div className="text-xs text-gray-600 mb-1">💡 <strong>Tip:</strong> For completed actions in the past</div>
                                        <div className="text-xs text-gray-600">Regular verbs: +ed | Irregular verbs: special forms</div>
                                      </div>
                                    </div>
                                  )
                                }
                              }

                              if (levelName.includes('future') || formula.includes('will') || levelName.includes('going to')) {
                                if (levelName.includes('going to')) {
                                  return (
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-center space-x-1">
                                        {createComponent('Subject', 'bg-sky-200/80', 'Who')}
                                        <span className="text-gray-500 text-xs">+</span>
                                        {createComponent('am/is/are', 'bg-violet-200/80', 'Be verb')}
                                        <span className="text-gray-500 text-xs">+</span>
                                        {createComponent('going to', 'bg-indigo-200/80', 'Future')}
                                        <span className="text-gray-500 text-xs">+</span>
                                        {createComponent('V1', 'bg-purple-200/80', 'Base Verb')}
                                      </div>
                                      <div className="text-center">
                                        <div className="text-xs text-gray-600 mb-1">💡 <strong>Tip:</strong> For planned future actions</div>
                                      </div>
                                    </div>
                                  )
                                } else {
                                  return (
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-center space-x-1">
                                        {createComponent('Subject', 'bg-sky-200/80', 'Who')}
                                        <span className="text-gray-500 text-xs">+</span>
                                        {createComponent('will', 'bg-indigo-200/80', 'Future')}
                                        <span className="text-gray-500 text-xs">+</span>
                                        {createComponent('V1', 'bg-purple-200/80', 'Base Verb')}
                                        <span className="text-gray-500 text-xs">+</span>
                                        {createComponent('Object', 'bg-orange-200/80', 'What')}
                                      </div>
                                      <div className="text-center">
                                        <div className="text-xs text-gray-600 mb-1">💡 <strong>Tip:</strong> For predictions and promises</div>
                                      </div>
                                    </div>
                                  )
                                }
                              }

                              if (levelName.includes('conditional') || formula.includes('if')) {
                                return (
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-center space-x-1">
                                      {createComponent('If', 'bg-yellow-200/80', 'Condition')}
                                      <span className="text-gray-500 text-xs">+</span>
                                      {createComponent('condition', 'bg-sky-200/80', 'Situation')}
                                      <span className="text-gray-500 text-xs">,</span>
                                      {createComponent('result', 'bg-green-200/80', 'What happens')}
                                    </div>
                                    <div className="text-center">
                                      <div className="text-xs text-gray-600 mb-1">
                                        💡 <strong>Tip:</strong> {levelName.includes('zero') ? 'For facts and general truths' :
                                                                 levelName.includes('first') ? 'For real future possibilities' :
                                                                 'For hypothetical situations'}
                                      </div>
                                    </div>
                                  </div>
                                )
                              }

                              if (levelName.includes('modal') || levelName.includes('can') || levelName.includes('should') || levelName.includes('must')) {
                                return (
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-center space-x-1">
                                      {createComponent('Subject', 'bg-sky-200/80', 'Who')}
                                      <span className="text-gray-500 text-xs">+</span>
                                      {createComponent('Modal', 'bg-indigo-200/80', 'Can/Should/Must')}
                                      <span className="text-gray-500 text-xs">+</span>
                                      {createComponent('V1', 'bg-purple-200/80', 'Base Verb')}
                                      <span className="text-gray-500 text-xs">+</span>
                                      {createComponent('Object', 'bg-orange-200/80', 'What')}
                                    </div>
                                    <div className="text-center">
                                      <div className="text-xs text-gray-600 mb-1">
                                        💡 <strong>Tip:</strong> {levelName.includes('can') ? 'For ability and permission' :
                                                                 levelName.includes('should') ? 'For advice and recommendations' :
                                                                 'For obligation and necessity'}
                                      </div>
                                    </div>
                                  </div>
                                )
                              }

                              // Default pattern for basic affirmative sentences
                              return (
                                <div className="space-y-3">
                                  <div className="flex items-center justify-center space-x-2">
                                    {createComponent('Subject', 'bg-sky-200/80', 'Who')}
                                    <span className="text-gray-500 text-xs">+</span>
                                    {createComponent('Verb', 'bg-purple-200/80', 'Action')}
                                    <span className="text-gray-500 text-xs">+</span>
                                    {createComponent('Object', 'bg-orange-200/80', 'What')}
                                  </div>
                                  <div className="text-center">
                                    <div className="text-xs text-gray-600 mb-1">💡 <strong>Tip:</strong> Basic sentence structure - who does what</div>
                                  </div>
                                </div>
                              )
                            }

                            return getPatternForLevel()
                          })()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-green-100/60 rounded-xl border border-green-200/40 overflow-hidden">
                  <button
                    onClick={() => setGrammarTipOpen(!grammarTipOpen)}
                    className="w-full p-3 flex items-center justify-between hover:bg-green-200/40 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">💡</span>
                      <strong className="text-gray-900 text-sm">Quick Grammar Guide</strong>
                    </div>
                    {grammarTipOpen ? (
                      <ChevronUp className="w-4 h-4 text-gray-700" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-700" />
                    )}
                  </button>

                  {grammarTipOpen && (
                    <div className="px-3 pb-3">
                      <div className="bg-green-50/80 rounded-lg p-4 border border-green-200/60">
                        <h4 className="font-semibold text-gray-900 text-sm mb-3">{getVisualGrammarCards().title}</h4>
                        <div className="space-y-4">
                          {getVisualGrammarCards().cards.map((card, index) => (
                            <div key={index} className="space-y-2">
                              <p className="text-xs text-gray-700 font-medium">{card.explanation}</p>
                              <div className="flex items-center justify-center">
                                <div className="flex items-center space-x-2">
                                  {card.example.map((word, wordIndex) => (
                                    <div key={wordIndex} className="text-center">
                                      <div className={`${card.colors[wordIndex]} border border-gray-300/50 text-gray-900 px-3 py-2 rounded-full text-sm font-medium shadow-sm`}>
                                        {word}
                                      </div>
                                      <div className="text-xs text-gray-600 mt-1">
                                        {card.labels[wordIndex]}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Sentence Building Area */}
          <Card className="bg-slate-800/90 backdrop-blur-sm shadow-lg border-2 border-slate-600 rounded-2xl">
            <div className="p-4">
              <div className="text-center mb-3">
                <div className="flex items-center justify-center space-x-2">
                  <BookOpen className="w-4 h-4 text-white" />
                  <h2 className="text-lg font-bold text-white">Build Your Sentence</h2>
                </div>

                {/* Level Goal Progress Bar with Integrated Feedback */}
                <div className="mt-2 max-w-md mx-auto">
                  <div className="flex items-center justify-between text-xs text-gray-300 mb-1">
                    <span>Progress</span>
                    <span>{levelProgress}/5 correct</span>
                  </div>
                  <div className={`bg-slate-700/50 rounded-full h-1.5 transition-all duration-300 ${
                    isEvaluating ? 'ring-2 ring-blue-400/50 animate-pulse' : ''
                  }`}>
                    <div
                      className="bg-gradient-to-r from-green-400 to-emerald-400 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${(levelProgress / 5) * 100}%` }}
                    ></div>
                  </div>

                  {/* Integrated Feedback Display */}
                  {(isEvaluating || showFeedback) && (
                    <div className={`mt-3 p-2 rounded-lg text-center transition-all duration-300 text-xs ${
                      isEvaluating
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30 animate-pulse'
                        : feedback.includes('Perfect') || feedback.includes('Correct') || feedback.includes('Excellent') || feedback.includes('Fantastic') || feedback.includes('mastered') || feedback.includes('Outstanding') || feedback.includes('improving') || feedback.includes('Great') || feedback.includes('Well done') || feedback.includes('🚀')
                        ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                        : feedback.includes('close') || feedback.includes('almost') || feedback.includes('Great grammar structure!')
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
                        : 'bg-red-500/20 text-red-300 border border-red-400/30'
                    }`}>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-sm">
                          {isEvaluating ? '🧠' :
                           feedback.includes('Perfect') || feedback.includes('Correct') || feedback.includes('Excellent') || feedback.includes('Fantastic') || feedback.includes('mastered') || feedback.includes('Outstanding') || feedback.includes('improving') || feedback.includes('Great') || feedback.includes('Well done') || feedback.includes('🚀') ? '✅' :
                           feedback.includes('close') || feedback.includes('almost') || feedback.includes('Great grammar structure!') ? '⚠️' : '❌'}
                        </span>
                        <span className="font-medium">
                          {isEvaluating ? 'Checking grammar...' :
                           feedback.includes('Perfect') || feedback.includes('Correct') || feedback.includes('Excellent') || feedback.includes('Fantastic') || feedback.includes('mastered') || feedback.includes('Outstanding') || feedback.includes('improving') || feedback.includes('Great') || feedback.includes('Well done') || feedback.includes('🚀') ? 'Excellent work!' :
                           feedback.includes('close') || feedback.includes('almost') || feedback.includes('Great grammar structure!') ? 'Good grammar, but think about meaning!' : 'Not quite right.'}
                        </span>
                      </div>
                      {!isEvaluating && (
                        <div className="mt-2 text-xs opacity-90">
                          {feedback.includes('Missing verb') ? (
                            <div>
                              <p className="mb-1">Missing verb in your sentence.</p>
                              <p className="font-medium">Remember:</p>
                              <ul className="list-disc list-inside space-y-0.5 ml-2">
                                <li>Use V1 (base form) with I, you, we, they</li>
                                <li>Use V1-3rd (adds -s/-es) with he, she, it</li>
                              </ul>
                            </div>
                          ) : (
                            <p>{renderFeedbackText(feedback)}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pronoun Variety Indicator */}
                  {usedPronouns.length > 0 && !showFeedback && (
                    <div className="mt-2 text-xs text-gray-400 text-center">
                      <span className="inline-flex items-center space-x-1">
                        <span>Used:</span>
                        {usedPronouns.map((pronoun, index) => (
                          <span key={pronoun} className="bg-slate-600/60 px-2 py-0.5 rounded-full text-xs">
                            {pronoun}
                          </span>
                        ))}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Current Sentence Display */}
              <div className="min-h-[60px] p-4 border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-r from-blue-50/60 to-purple-50/60 mb-4 flex items-center justify-center">
                {selectedTiles.length === 0 ? (
                  <p className="text-gray-600 text-center text-sm">
                    <span className="block text-lg mb-1">✨</span>
                    Tap tiles below to form a sentence...
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {selectedTiles.map((tile, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className={`${getCategoryColor(tile.category)} cursor-pointer hover:scale-105 hover:shadow-lg text-sm px-3 py-2 rounded-full transition-all duration-200 border shadow-sm`}
                        onClick={() => removeTile(index)}
                      >
                        {tile.word}
                        <span className="ml-1 text-xs opacity-60">×</span>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-3 mb-4">
                <Button
                  onClick={checkSentence}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white font-semibold rounded-full px-6 py-2 shadow-lg transform hover:scale-105 transition-all duration-200 text-sm"
                  disabled={selectedTiles.length === 0}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Check Sentence</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={clearSentence}
                  className="flex items-center space-x-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-md rounded-full px-4 py-2 transition-all duration-200 text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Clear</span>
                </Button>

                {(userStats.completedLevels.includes(levelId) || levelProgress > 0) && (
                  <Button
                    onClick={nextLevel}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-full px-4 py-2 shadow-lg transform hover:scale-105 transition-all duration-200 text-sm"
                  >
                    <span>Next Level</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Button>
                )}
              </div>

            </div>
          </Card>

          {/* Word Categories */}
          <div className="space-y-3">
            {/* Helper Instructions and Logical Word Combination Tips */}
            {level.requiredCategories?.includes('verbs') && (
              <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-3 border border-slate-600/30">
                <div className="flex items-center justify-center space-x-2 text-slate-300 text-sm">
                  <span className="text-blue-400">💡</span>
                  <span><strong>Tip:</strong> Click verb tiles to toggle forms</span>
                  <div className="flex items-center space-x-1 ml-2">
                    <span className="bg-purple-200/80 text-gray-900 px-2 py-1 rounded-full text-xs">eat</span>
                    <span className="text-slate-400">↔</span>
                    <span className="bg-purple-200/80 text-gray-900 px-2 py-1 rounded-full text-xs">eats</span>
                  </div>
                </div>
              </div>
            )}



            {/* Main Categories Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {['subjects', 'verbs', 'articles', 'objects', 'helpers', 'negatives'].filter(categoryName =>
                level.requiredCategories?.includes(categoryName)
              ).map(categoryName => {
                const categoryWords = wordCategories[categoryName as keyof typeof wordCategories] || []
                if (categoryWords.length === 0) return null

                const categoryColor = categoryName === 'subjects' ? 'from-sky-200/60 to-sky-300/60' :
                                    categoryName === 'verbs' ? 'from-purple-200/60 to-purple-300/60' :
                                    categoryName === 'articles' ? 'from-pink-200/60 to-pink-300/60' :
                                    categoryName === 'objects' ? 'from-orange-200/60 to-orange-300/60' :
                                    categoryName === 'helpers' ? 'from-violet-200/60 to-violet-300/60' :
                                    categoryName === 'negatives' ? 'from-red-200/60 to-red-300/60' :
                                    'from-gray-200/60 to-gray-300/60'

                return (
                  <Card key={categoryName} className="bg-slate-800/90 backdrop-blur-sm shadow-lg border-0 rounded-2xl overflow-hidden border border-slate-700/50">
                    <div className={`bg-gradient-to-r ${categoryColor} p-2`}>
                      <div className="flex items-center justify-center space-x-1">
                        <span className="text-lg">{getCategoryIcon(categoryName)}</span>
                        <h3 className="text-sm font-bold capitalize text-gray-900">
                          {categoryName.replace('-', ' ')}
                        </h3>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {categoryWords.map((wordObj: any, index: number) => (
                          <Button
                            key={index}
                            variant="outline"
                            onClick={() => handleTileClick(wordObj.word, wordObj.category)}
                            className={`${getCategoryColor(wordObj.category)} transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 rounded-full px-3 py-1.5 font-medium text-xs`}
                          >
                            {wordObj.word}
                            {wordObj.toggleable && (
                              <span className="ml-1 text-xs opacity-70">↔</span>
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}