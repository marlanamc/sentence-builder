'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, RotateCcw, Home, BookOpen, ArrowLeft, HelpCircle, X, Heart, BookmarkPlus, Bookmark } from 'lucide-react'
import { getLevelById } from '@/data/comprehensiveLevels45'
import { grammarEngine } from '@/lib/grammar-engine-instance'
import { GrammarGuideCard } from '@/components/game/GrammarGuideCard'
import { VerbSystemGuide } from '@/components/game/VerbSystemGuide'
import { WordCategoryList, ShuffledWordGrid } from '@/components/game/WordLists'
import { MobileGameLayout } from '@/components/game/MobileGameLayout'
import { DesktopGameLayout } from '@/components/game/DesktopGameLayout'
import { SimpleMobileLayout } from '@/components/game/SimpleMobileLayout'
import { useMobile } from '@/hooks/useMobile'
import { useStudentProgress } from '@/hooks/useStudentProgress'
import { loadGrammarPatternByLevel, fallbackPatterns, type GrammarPattern } from '@/utils/grammarPatterns'

export default function LevelPage() {
  const router = useRouter()
  const params = useParams()
  const levelId = parseInt(params.id as string)
  const { isMobile, isClient } = useMobile()
  const { progress, completeLevel, recordAttempt, updatePreferences } = useStudentProgress()

  const [selectedTiles, setSelectedTiles] = useState<Array<{ word: string; category: string; originalWord: string }>>([])
  const [feedback, setFeedback] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  // User stats tracking removed for free play
  // removed unused levelProgress state
  const [showLevelComplete, setShowLevelComplete] = useState(false) // Show completion animation
  const [isEvaluating, setIsEvaluating] = useState(false) // Show evaluation animation
  const [usedPronouns, setUsedPronouns] = useState<string[]>([]) // Track used pronouns for variety
  // Removed unused custom scrollbar state/refs
  const [lastCheckTime, setLastCheckTime] = useState(0) // Prevent double-checking
  const [categorizedCorrect, setCategorizedCorrect] = useState(0) // Track correct sentences in categorized mode
  const [shuffledCorrect, setShuffledCorrect] = useState(0) // Track correct sentences in shuffled mode
  const [learningMode, setLearningMode] = useState<'categorized' | 'shuffled'>('categorized') // Current learning mode
  const [showHelpModal, setShowHelpModal] = useState(false) // Control help modal visibility
  const [showVerbGuide, setShowVerbGuide] = useState(false) // Verb system guide modal
  const [savedSentences, setSavedSentences] = useState<Array<{ id: string; sentence: string; level: number; timestamp: number }>>([]) // Saved sentences
  const [showSavedModal, setShowSavedModal] = useState(false) // Control saved sentences modal
  const [justSaved, setJustSaved] = useState(false) // Show temporary save confirmation
  const [csvVerbs, setCsvVerbs] = useState<Array<{ base: string; third: string; ing: string; v2: string; v3: string }>>([])
  const [currentGrammarPattern, setCurrentGrammarPattern] = useState<GrammarPattern | null>(null) // Current level's pattern
  const [grammarPatternLoading, setGrammarPatternLoading] = useState(true) // Loading state for grammar pattern
  const [formattedSentence, setFormattedSentence] = useState<string>('') // Properly formatted sentence for display
  const [pillToast, setPillToast] = useState<string>('') // Toast message for pattern pill actions


  // No user stats tracking for free play

  // Get current level data
  const level = getLevelById(levelId)

  if (!level) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-2xl mx-auto text-center py-20">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Level Not Found</h1>
          <p className="text-gray-600 mb-6">The level you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/game/levels')}>
            Back to Levels
          </Button>
        </div>
      </div>
    )
  }

  // Load saved sentences from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('savedSentences')
    if (saved) {
      try {
        setSavedSentences(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading saved sentences:', error)
      }
    }
  }, [])

  // Load CSV verbs from public data
  useEffect(() => {
    const loadCsv = async () => {
      try {
        const res = await fetch('/data/top_verbs.csv')
        if (!res.ok) return
        const text = await res.text()
        const lines = text.split('\n').slice(1).filter(Boolean)
        const parsed = lines.map(line => {
          const cells = line.split(',').map(c => c.trim())
          // Expect format: Verb,V1,V1-3rd,V1-ing,V2,V3
          const base = (cells[1] || cells[0] || '').toLowerCase()
          const third = (cells[2] || '').toLowerCase()
          const ing = (cells[3] || '').toLowerCase()
          const v2 = (cells[4] || '').toLowerCase()
          const v3 = (cells[5] || '').toLowerCase()
          return { base, third, ing, v2, v3 }
        }).filter(v => v.base && v.third)
        // Dedup by base
        const unique = new Map<string, { base: string; third: string; ing: string; v2: string; v3: string }>()
        parsed.forEach(v => { if (!unique.has(v.base)) unique.set(v.base, v) })
        setCsvVerbs(Array.from(unique.values()))
      } catch (e) {
        console.warn('Failed to load CSV verbs', e)
      }
    }
    loadCsv()
  }, [])

  // Load enhanced grammar pattern from Supabase with caching
  useEffect(() => {
    const loadPattern = async () => {
      setGrammarPatternLoading(true)
      try {
        // Try to get from cache first
        const cacheKey = `grammar-pattern-${levelId}`
        const cached = sessionStorage.getItem(cacheKey)

        if (cached) {
          const pattern = JSON.parse(cached)
          setCurrentGrammarPattern(pattern)
          setGrammarPatternLoading(false)
          return
        }

        // Load from Supabase
        const pattern = await loadGrammarPatternByLevel(levelId.toString())
        if (pattern) {
          setCurrentGrammarPattern(pattern)
          // Cache for session
          sessionStorage.setItem(cacheKey, JSON.stringify(pattern))
        } else {
          // Use fallback pattern if available
          const fallback = fallbackPatterns[levelId.toString()]
          if (fallback) {
            setCurrentGrammarPattern(fallback)
          }
        }
      } catch (error) {
        console.error('Error loading grammar pattern:', error)
        // Use fallback pattern
        const fallback = fallbackPatterns[levelId.toString()]
        if (fallback) {
          setCurrentGrammarPattern(fallback)
        }
      } finally {
        setGrammarPatternLoading(false)
      }
    }
    loadPattern()
  }, [levelId])

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

      // Merge base verbs with CSV verbs
      verbs: [
        { word: 'eat/eats', baseForm: 'eat', thirdPersonForm: 'eats', category: 'verb', toggleable: true },
        { word: 'like/likes', baseForm: 'like', thirdPersonForm: 'likes', category: 'verb', toggleable: true },
        { word: 'watch/watches', baseForm: 'watch', thirdPersonForm: 'watches', category: 'verb', toggleable: true },
        { word: 'play/plays', baseForm: 'play', thirdPersonForm: 'plays', category: 'verb', toggleable: true },
        { word: 'study/studies', baseForm: 'study', thirdPersonForm: 'studies', category: 'verb', toggleable: true },
        { word: 'work/works', baseForm: 'work', thirdPersonForm: 'works', category: 'verb', toggleable: true },
        { word: 'read/reads', baseForm: 'read', thirdPersonForm: 'reads', category: 'verb', toggleable: true },
        { word: 'write/writes', baseForm: 'write', thirdPersonForm: 'writes', category: 'verb', toggleable: true },
        { word: 'drink/drinks', baseForm: 'drink', thirdPersonForm: 'drinks', category: 'verb', toggleable: true },
        { word: 'cook/cooks', baseForm: 'cook', thirdPersonForm: 'cooks', category: 'verb', toggleable: true },
        { word: 'visit/visits', baseForm: 'visit', thirdPersonForm: 'visits', category: 'verb', toggleable: true },
        { word: 'travel/travels', baseForm: 'travel', thirdPersonForm: 'travels', category: 'verb', toggleable: true },
        { word: 'learn/learns', baseForm: 'learn', thirdPersonForm: 'learns', category: 'verb', toggleable: true },
        { word: 'teach/teaches', baseForm: 'teach', thirdPersonForm: 'teaches', category: 'verb', toggleable: true },
        { word: 'try/tries', baseForm: 'try', thirdPersonForm: 'tries', category: 'verb', toggleable: true },
        { word: 'fix/fixes', baseForm: 'fix', thirdPersonForm: 'fixes', category: 'verb', toggleable: true },
        { word: 'go/goes', baseForm: 'go', thirdPersonForm: 'goes', category: 'verb', toggleable: true, v2: 'went', v3: 'gone', ving: 'going' },
        { word: 'see/sees', baseForm: 'see', thirdPersonForm: 'sees', category: 'verb', toggleable: true, v2: 'saw', v3: 'seen', ving: 'seeing' },
        { word: 'make/makes', baseForm: 'make', thirdPersonForm: 'makes', category: 'verb', toggleable: true, v2: 'made', v3: 'made', ving: 'making' },
        { word: 'have/has', baseForm: 'have', thirdPersonForm: 'has', category: 'verb', toggleable: true, v2: 'had', v3: 'had', ving: 'having' },
        { word: 'do/does', baseForm: 'do', thirdPersonForm: 'does', category: 'verb', toggleable: true, v2: 'did', v3: 'done', ving: 'doing' },
        // CSV injected verbs appended below
        ...csvVerbs.map(v => ({
          word: `${v.base}/${v.third}`,
          baseForm: v.base,
          thirdPersonForm: v.third,
          category: 'verb',
          toggleable: true,
          v2: v.v2,
          v3: v.v3,
          ving: v.ing
        }))
      ],

      objects: [
        { word: 'pizza', category: 'uncountable-noun', toggleable: false },
        { word: 'soccer', category: 'uncountable-noun', toggleable: false },
        { word: 'basketball', category: 'uncountable-noun', toggleable: false },
        { word: 'music', category: 'uncountable-noun', toggleable: false },
        { word: 'water', category: 'uncountable-noun', toggleable: false },
        { word: 'coffee', category: 'uncountable-noun', toggleable: false },
        { word: 'book/books', category: 'countable-noun', toggleable: true },
        { word: 'apple/apples', category: 'countable-noun', toggleable: true },
        { word: 'sandwich/sandwiches', category: 'countable-noun', toggleable: true },
        { word: 'movie/movies', category: 'countable-noun', toggleable: true },
        { word: 'game/games', category: 'countable-noun', toggleable: true },
        { word: 'car/cars', category: 'countable-noun', toggleable: true },
        { word: 'dog/dogs', category: 'countable-noun', toggleable: true },
        { word: 'cat/cats', category: 'countable-noun', toggleable: true },
        { word: 'teacher/teachers', category: 'countable-noun', toggleable: true },
        { word: 'student/students', category: 'countable-noun', toggleable: true },
        { word: 'rice', category: 'uncountable-noun', toggleable: false },
        { word: 'homework', category: 'uncountable-noun', toggleable: false }
      ],

      articles: [
        { word: 'a', category: 'indefinite-article' },
        { word: 'an', category: 'indefinite-article' },
        { word: 'the', category: 'definite-article' }
      ],

      helpers: [
        { word: 'do', category: 'auxiliary', usage: 'I, you, we, they' },
        { word: 'does', category: 'auxiliary', usage: 'he, she, it' },
        { word: 'did', category: 'auxiliary', usage: 'past questions/negatives' },
        { word: 'am', category: 'be-verb', usage: 'I' },
        { word: 'is', category: 'be-verb', usage: 'he, she, it' },
        { word: 'are', category: 'be-verb', usage: 'you, we, they' },
        { word: 'was', category: 'be-verb', usage: 'I, he, she, it (past)' },
        { word: 'were', category: 'be-verb', usage: 'you, we, they (past)' },
        { word: 'be', category: 'auxiliary', usage: 'with will: will be' },
        { word: 'been', category: 'auxiliary', usage: 'perfect continuous/passive' },
        { word: 'had', category: 'auxiliary', usage: 'past perfect' },
        { word: 'have', category: 'auxiliary', usage: 'I, you, we, they (perfect)' },
        { word: 'has', category: 'auxiliary', usage: 'he, she, it (perfect)' }
      ],

      negatives: [
        { word: 'not', category: 'negation' },
        { word: "don't", category: 'negative-contraction' },
        { word: "doesn't", category: 'negative-contraction' },
        { word: "didn't", category: 'negative-contraction' },
        { word: "haven't", category: 'negative-contraction' },
        { word: "hasn't", category: 'negative-contraction' },
        { word: "can't", category: 'negative-contraction' },
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
      ],

      modals: [
        { word: 'will', category: 'modal' },
        { word: 'can', category: 'modal' },
        { word: 'should', category: 'modal' },
        { word: 'must', category: 'modal' }
      ],

      conjunctions: [
        { word: 'if', category: 'conjunction' }
      ],

      prepositions: [
        { word: 'by', category: 'preposition' }
      ],

      adjectives: [
        { word: 'big', category: 'adjective' },
        { word: 'small', category: 'adjective' },
        { word: 'interesting', category: 'adjective' },
        { word: 'delicious', category: 'adjective' },
        { word: 'fun', category: 'adjective' },
        { word: 'boring', category: 'adjective' },
        { word: 'new', category: 'adjective' },
        { word: 'old', category: 'adjective' },
        { word: 'easy', category: 'adjective' },
        { word: 'difficult', category: 'adjective' }
      ],

      adverbs: [
        { word: 'quickly', category: 'adverb' },
        { word: 'slowly', category: 'adverb' },
        { word: 'carefully', category: 'adverb' },
        { word: 'well', category: 'adverb' },
        { word: 'badly', category: 'adverb' },
        { word: 'often', category: 'adverb' },
        { word: 'usually', category: 'adverb' },
        { word: 'sometimes', category: 'adverb' },
        { word: 'never', category: 'adverb' }
      ],

      time: [
        { word: 'yesterday', category: 'time-phrase' },
        { word: 'today', category: 'time-phrase' },
        { word: 'tomorrow', category: 'time-phrase' },
        { word: 'tonight', category: 'time-phrase' },
        { word: 'now', category: 'time-phrase' },
        { word: 'later', category: 'time-phrase' },
        { word: 'soon', category: 'time-phrase' }
      ],

      places: [
        { word: 'school', category: 'countable-noun' },
        { word: 'park', category: 'countable-noun' },
        { word: 'office', category: 'countable-noun' },
        { word: 'home', category: 'uncountable-noun' },
        { word: 'store', category: 'countable-noun' },
        { word: 'beach', category: 'countable-noun' }
      ],

      determiners: [
        { word: 'this', category: 'determiner' },
        { word: 'that', category: 'determiner' },
        { word: 'these', category: 'determiner' },
        { word: 'those', category: 'determiner' },
        { word: 'my', category: 'determiner' },
        { word: 'your', category: 'determiner' },
        { word: 'his', category: 'determiner' },
        { word: 'her', category: 'determiner' },
        { word: 'our', category: 'determiner' },
        { word: 'their', category: 'determiner' }
      ]
    }

    return baseCategories
  }

  const wordCategories = getWordCategories()

  // Derive extra categories needed per level so toolbox always has required words
  const activeRequiredCategories = (() => {
    const base = new Set<string>([...(level.requiredCategories || [])])
    const name = (level.name || '').toLowerCase()
    const formula = (level.formula || '').toLowerCase()
    if (name.includes('conditional') || formula.includes('if')) base.add('conjunctions')
    if (name.includes('future') || formula.includes('will') || formula.includes('going to')) base.add('modals')
    if (name.includes('perfect') || formula.includes('have')) base.add('helpers')
    if (name.includes('passive')) base.add('helpers')
    if (name.includes('question') || formula.includes('?') || name.includes('wh')) base.add('question-words')
    // Always enrich with general-purpose categories
    ;['adjectives','adverbs','time','places','determiners'].forEach(c => base.add(c))
    // Keep core categories when appropriate
    return Array.from(base)
  })()

  // Pattern pill styling and interactions
  const getPatternPillClass = () => {
    const name = (level.name || '').toLowerCase()
    const formula = (level.formula || '').toLowerCase()
    if (name.includes('conditional') || formula.includes('if')) {
      return 'bg-gradient-to-r from-teal-500/30 to-emerald-500/30 text-teal-100 border-teal-400/30'
    }
    if (name.includes('future') || formula.includes('will') || formula.includes('going to')) {
      return 'bg-gradient-to-r from-cyan-500/30 to-sky-500/30 text-cyan-100 border-cyan-400/30'
    }
    if (name.includes('past') || formula.includes('v2') || name.includes('did')) {
      return 'bg-gradient-to-r from-violet-500/30 to-purple-500/30 text-violet-100 border-violet-400/30'
    }
    if (name.includes('perfect') || formula.includes('have')) {
      return 'bg-gradient-to-r from-fuchsia-500/30 to-purple-500/30 text-fuchsia-100 border-fuchsia-400/30'
    }
    if (name.includes('modal') || name.includes('can') || name.includes('should') || name.includes('must')) {
      return 'bg-gradient-to-r from-indigo-500/30 to-blue-500/30 text-indigo-100 border-indigo-400/30'
    }
    if (name.includes('passive')) {
      return 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-100 border-purple-400/30'
    }
    return 'bg-blue-400/30 text-blue-100 border-blue-400/30'
  }

  // Category detection for scaffolds
  const detectLevelCategory = () => {
    const name = (level.name || '').toLowerCase()
    const formula = (level.formula || '').toLowerCase()
    const mentions = (kw: string) => name.includes(kw) || formula.includes(kw)
    if (name.includes('conditional') || formula.includes('if')) return 'conditional'

    // Tense detection first
    const tense: 'past' | 'present' | 'future' = name.includes('past') ? 'past' : name.includes('future') ? 'future' : 'present'
    const isPerfect = mentions('perfect') || formula.includes('have')
    const isPerfectContinuous = mentions('perfect continuous') || (isPerfect && (mentions('continuous') || mentions('been')))
    const isContinuous = mentions('continuous') || mentions('progressive') || mentions('v-ing') || mentions('be +')

    if (isPerfectContinuous) return `${tense}-perfect-continuous` as 'past-perfect-continuous' | 'present-perfect-continuous' | 'future-perfect-continuous'
    if (isPerfect) return `${tense}-perfect` as 'past-perfect' | 'present-perfect' | 'future-perfect'
    if (isContinuous) return `${tense}-continuous` as 'past-continuous' | 'present-continuous' | 'future-continuous'

    if (tense === 'future' || formula.includes('will') || formula.includes('going to')) return 'future'
    if (tense === 'past' || formula.includes('v2') || name.includes('did')) return 'past'
    if (name.includes('perfect')) return 'perfect'
    if (name.includes('modal') || name.includes('can') || name.includes('should') || name.includes('must')) return 'modal'
    if (name.includes('passive')) return 'passive'
    return 'default'
  }

  const toPastTense = (base: string) => {
    const b = (base || '').toLowerCase()
    if (b === 'eat') return 'ate'
    if (/[^aeiou]y$/.test(b)) return b.replace(/y$/, 'ied')
    if (/(e)$/.test(b)) return `${b}d`
    return `${b}ed`
  }

  const toPastParticiple = (base: string) => {
    const b = (base || '').toLowerCase()
    if (b === 'eat') return 'eaten'
    return toPastTense(b)
  }

  const chooseBeForm = (subjectLower: string) => {
    if (subjectLower === 'i') return 'am'
    if (['he','she','it'].includes(subjectLower)) return 'is'
    return 'are'
  }

  const chooseHasHave = (subjectLower: string) => {
    return ['he','she','it'].includes(subjectLower) ? 'has' : 'have'
  }

  const insertScaffoldFromFormula = () => {
    const subjects: Array<{ word: string }> = (wordCategories.subjects as Array<{ word: string }>) || []
    const verbs: Array<{ word: string; baseForm?: string; thirdPersonForm?: string }> = (wordCategories.verbs as Array<{ word: string; baseForm?: string; thirdPersonForm?: string }>) || []
    const objects: Array<{ word: string }> = (wordCategories.objects as Array<{ word: string }>) || []

    const preferredSubject = subjects.find(s => ['he','she','it'].includes((s.word||'').toLowerCase()))?.word
      || subjects[0]?.word || 'I'
    const backupSubject = subjects.find(s => !['he','she','it'].includes((s.word||'').toLowerCase()))?.word || 'I'
    const subjectLower = preferredSubject.toLowerCase()
    const isThirdPerson = ['he','she','it'].includes(subjectLower)

    const baseEntry: { baseForm?: string; thirdPersonForm?: string; word?: string } = verbs[0] || { baseForm: 'like', thirdPersonForm: 'likes', word: 'like/likes' }
    const verbBase = baseEntry.baseForm || (baseEntry.word?.split('/')?.[0]) || 'like'
    const verb3rd = baseEntry.thirdPersonForm || (baseEntry.word?.split('/')?.[1]) || 'likes'
    const verbV2 = toPastTense(verbBase)
    const verbV3 = toPastParticiple(verbBase)
    const object = objects[0]?.word || 'pizza'

    const category = detectLevelCategory()

    let exemplar: Array<{ word: string; category: string; originalWord: string }>

    if (category === 'conditional') {
      // If he studies, he plays
      const s1 = preferredSubject
      const s2 = preferredSubject
      const v1 = isThirdPerson ? verb3rd : verbBase
      const v2 = isThirdPerson ? verb3rd : verbBase
      exemplar = [
        { word: 'if', category: 'conjunction', originalWord: 'if' },
        { word: s1, category: 'pronoun', originalWord: s1 },
        { word: v1, category: 'verb', originalWord: `${verbBase}/${verb3rd}` },
        { word: ',', category: 'punctuation', originalWord: ',' },
        { word: s2, category: 'pronoun', originalWord: s2 },
        { word: v2, category: 'verb', originalWord: `${verbBase}/${verb3rd}` },
        { word: object, category: 'noun', originalWord: object }
      ]
    } else if (category === 'future') {
      // He will play soccer
      const s = preferredSubject
      exemplar = [
        { word: s, category: 'pronoun', originalWord: s },
        { word: 'will', category: 'modal', originalWord: 'will' },
        { word: verbBase, category: 'verb', originalWord: `${verbBase}/${verb3rd}` },
        { word: object, category: 'noun', originalWord: object }
      ]
    } else if (category === 'past') {
      // He played soccer
      const s = preferredSubject
      exemplar = [
        { word: s, category: 'pronoun', originalWord: s },
        { word: verbV2, category: 'verb', originalWord: verbV2 },
        { word: object, category: 'noun', originalWord: object }
      ]
    } else if (category === 'perfect') {
      // He has played soccer
      const s = preferredSubject
      const hasHave = chooseHasHave(subjectLower)
      exemplar = [
        { word: s, category: 'pronoun', originalWord: s },
        { word: hasHave, category: 'auxiliary', originalWord: hasHave },
        { word: verbV3, category: 'verb', originalWord: verbV3 },
        { word: object, category: 'noun', originalWord: object }
      ]
    } else if (category === 'modal') {
      // He can play soccer
      const s = preferredSubject
      exemplar = [
        { word: s, category: 'pronoun', originalWord: s },
        { word: 'can', category: 'modal', originalWord: 'can' },
        { word: verbBase, category: 'verb', originalWord: `${verbBase}/${verb3rd}` },
        { word: object, category: 'noun', originalWord: object }
      ]
    } else if (category === 'passive') {
      // The pizza is played/eaten (use be + V3). Prefer 'pizza'.
      const be = chooseBeForm(object.toLowerCase()) // treat object as subject phrase
      exemplar = [
        { word: 'the', category: 'definite-article', originalWord: 'the' },
        { word: object, category: 'noun', originalWord: object },
        { word: be, category: 'be-verb', originalWord: be },
        { word: verbV3, category: 'verb', originalWord: verbV3 }
      ]
    } else {
      // Default present simple
      const chosenVerb = isThirdPerson ? verb3rd : verbBase
      exemplar = [
        { word: preferredSubject, category: 'pronoun', originalWord: preferredSubject },
        { word: chosenVerb, category: 'verb', originalWord: `${verbBase}/${verb3rd}` },
        { word: object, category: 'noun', originalWord: object }
      ]
    }

    setSelectedTiles(exemplar)
  }

  const handlePatternPillClick = async (e: React.MouseEvent) => {
    try {
      await navigator.clipboard.writeText(level.formula)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
    setPillToast('Copied!')
    setTimeout(() => setPillToast(''), 1200)
    if ((e as React.MouseEvent & { shiftKey: boolean }).shiftKey) {
      insertScaffoldFromFormula()
      setPillToast('Example added')
      setTimeout(() => setPillToast(''), 1400)
    }
  }

  // Drag and drop support for sentence tiles
  const onDragStart = (e: React.DragEvent, tileIndex: number) => {
    e.dataTransfer.setData('text/plain', String(tileIndex))
    e.dataTransfer.effectAllowed = 'move'
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const onDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    const sourceIndexStr = e.dataTransfer.getData('text/plain')
    if (sourceIndexStr === '') return
    const sourceIndex = parseInt(sourceIndexStr, 10)
    if (Number.isNaN(sourceIndex) || sourceIndex === targetIndex) return

    setSelectedTiles(prev => {
      const next = [...prev]
      const [moved] = next.splice(sourceIndex, 1)
      next.splice(targetIndex, 0, moved)
      return next
    })
  }

  const onDropToEnd = (e: React.DragEvent) => {
    e.preventDefault()
    const sourceIndexStr = e.dataTransfer.getData('text/plain')
    if (sourceIndexStr === '') return
    const sourceIndex = parseInt(sourceIndexStr, 10)
    if (Number.isNaN(sourceIndex)) return
    setSelectedTiles(prev => {
      const next = [...prev]
      const [moved] = next.splice(sourceIndex, 1)
      next.push(moved)
      return next
    })
  }

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

  // removed unused handleScroll

  // Format sentence with proper capitalization and punctuation
  const formatSentence = (words: string[]): string => {
    if (words.length === 0) return ''

    const sentence = words.join(' ')
    // Capitalize first letter and add period
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
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
      setFormattedSentence('') // Clear previous formatted sentence

      // Convert tiles to the format expected by grammar engine
      const tokens = selectedTiles.map(tile => ({
        word: tile.word,
        pos: tile.category,
        category: tile.category
      }))

      // Add small delay to show evaluation state
      await new Promise(resolve => setTimeout(resolve, 300))

      // Validate sentence using grammar engine
      const validation = await grammarEngine.validateSentence(tokens, { levelId })

      // Check for semantic issues in grammatically correct sentences
      let finalFeedback = validation.feedback
      if (validation.isValid) {
        const sentenceText = tokens.map(t => t.word).join(' ').toLowerCase()

        // Create formatted sentence for display
        const formatted = formatSentence(tokens.map(t => t.word))
        setFormattedSentence(formatted)

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

      // Update stats and handle mode progression
      if (validation.isValid) {
        let isLevelComplete = false

        if (learningMode === 'categorized') {
          const newCategorizedCorrect = categorizedCorrect + 1
          setCategorizedCorrect(newCategorizedCorrect)

          // After 5 correct in categorized mode, switch to shuffled mode
          if (newCategorizedCorrect >= 5) {
            setLearningMode('shuffled')
            setFeedback('🎉 Great! Now try without categories - all words are mixed together for a real challenge!')
          }
        } else {
          const newShuffledCorrect = shuffledCorrect + 1
          setShuffledCorrect(newShuffledCorrect)

          // After 3 correct in shuffled mode, level is complete
          if (newShuffledCorrect >= 3) {
            isLevelComplete = true
          }
        }

        // Track used pronouns for variety enforcement
        const usedPronoun = selectedTiles.find(tile => tile.category.includes('pronoun'))
        if (usedPronoun && !usedPronouns.includes(usedPronoun.word)) {
          setUsedPronouns([...usedPronouns, usedPronoun.word])
        }

        const pointsEarned = Math.round((validation as { score: number }).score * (level.points || 10)) || 10

        // Mark level as completed after completing both modes (5 categorized + 5 shuffled)
        if (isLevelComplete) {
          setFeedback(`🎉 Level Complete! You've mastered ${level.name}. Ready for the next challenge?`)
          setShowLevelComplete(true)

          // Hide the animation after 4 seconds
          setTimeout(() => {
            setShowLevelComplete(false)
          }, 4000)
        }
      } else {
        // Adaptive hints after repeated mistakes
        const incorrectAttempts = Number(localStorage.getItem(`lvl-${levelId}-incorrect`) || '0') + 1
        localStorage.setItem(`lvl-${levelId}-incorrect`, String(incorrectAttempts))

        if (incorrectAttempts >= 3) {
          const hasVerb = tokens.some(t => t.category.includes('verb'))
          const hasSubject = tokens.some(t => t.category.includes('pronoun'))
          const hasObject = tokens.some(t => t.category.includes('noun'))

          if (!hasVerb) {
            setFeedback('Hint: Add a verb. Use base form for I/you/we/they; add -s for he/she/it.')
          } else if (!hasSubject) {
            setFeedback('Hint: Start with a subject (I/you/he/she/it/we/they).')
          } else if (!hasObject) {
            setFeedback('Hint: Add an object to complete the idea (pizza, soccer, music...).')
          } else {
            setFeedback(validation.feedback || 'You are close — check verb form and word order.')
          }

          setShowFeedback(true)
          localStorage.setItem(`lvl-${levelId}-incorrect`, '0')
        }
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
    setFormattedSentence('') // Clear formatted sentence
  }

  const removeTile = (index: number) => {
    const newTiles = selectedTiles.filter((_, i) => i !== index)
    setSelectedTiles(newTiles)
  }

  // Generate shuffled words for challenge mode
  const getShuffledWords = () => {
    const allWords: Array<{ word: string; category: string; originalWord: string; toggleable?: boolean }> = []

    // Use only the required categories from the level (not all active categories)
    const categories = level.requiredCategories || []
    categories.forEach(categoryName => {
      let categoryWordsRaw = wordCategories[categoryName as keyof typeof wordCategories] || []
      
      // Apply Level 1 object filtering for shuffled mode too
      if (level.id === 1 && categoryName === 'objects') {
        categoryWordsRaw = categoryWordsRaw.filter((wordObj: { word?: string }) => {
          // Show uncountable nouns (pizza, soccer, coffee, etc.)
          if (wordObj.category === 'uncountable-noun') return true
          // Show only plural forms of countable nouns
          if (wordObj.category === 'countable-noun' && wordObj.toggleable) {
            // Modify the word to show only the plural form
            const parts = wordObj.word.split('/')
            if (parts.length > 1) {
              wordObj.word = parts[1] // Use plural form (apples instead of apple/apples)
              wordObj.toggleable = false // Disable toggling for Level 1
            }
            return true
          }
          return false
        })
      }
      
      const categoryWords = (categoryWordsRaw as Array<{ word: string; originalWord?: string }>).map((w) => ({
        ...w,
        originalWord: w.originalWord ?? w.word
      }))
      // Limit to 10 words per category for mobile optimization
      allWords.push(...categoryWords.slice(0, 10))
    })

    // Shuffle the array
    const shuffled = [...allWords].sort(() => Math.random() - 0.5)
    return shuffled
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

  // Save sentence functionality
  const saveSentence = () => {
    if (selectedTiles.length === 0) return

    // Use formatted sentence if available, otherwise format the current sentence
    const rawSentence = selectedTiles.map(tile => tile.word).join(' ')
    const sentence = formattedSentence || formatSentence(selectedTiles.map(tile => tile.word))

    const newSavedSentence = {
      id: Math.random().toString(36).substr(2, 9),
      sentence,
      level: levelId,
      timestamp: Date.now()
    }

    const updatedSaved = [newSavedSentence, ...savedSentences].slice(0, 50) // Keep only 50 most recent
    setSavedSentences(updatedSaved)
    localStorage.setItem('savedSentences', JSON.stringify(updatedSaved))

    // Show confirmation
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2000)
  }

  // Delete saved sentence
  const deleteSavedSentence = (id: string) => {
    const updatedSaved = savedSentences.filter(s => s.id !== id)
    setSavedSentences(updatedSaved)
    localStorage.setItem('savedSentences', JSON.stringify(updatedSaved))
  }

  // Load a saved sentence back into the builder
  const loadSavedSentence = (sentence: string) => {
    const words = sentence.split(' ')
    const newTiles = words.map(word => ({
      word,
      category: 'unknown', // We could improve this by storing category info
      originalWord: word
    }))
    setSelectedTiles(newTiles)
    setShowSavedModal(false)
  }

  // Combo tips for natural collocations
  const comboTips = [
    { left: 'drink', right: 'coffee' },
    { left: 'play', right: 'guitar' },
    { left: 'read', right: 'books' },
    { left: 'go', right: 'to school' },
    { left: 'make', right: 'a sandwich' },
    { left: 'do', right: 'homework' },
  ]

  // Color coding for word categories with icons (low-saturation pastels with black text)
  const getCategoryColor = (category: string) => {
    // In challenge mode, remove colors for more difficulty
    if (learningMode === 'shuffled') {
      return 'bg-slate-200/80 border-slate-300/50 text-gray-900 hover:bg-slate-300/80'
    }

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
      'wh-question': 'bg-emerald-200/80 border-emerald-300/50 text-gray-900 hover:bg-emerald-300/80',
      'modal': 'bg-indigo-200/80 border-indigo-300/50 text-gray-900 hover:bg-indigo-300/80',
      'conjunction': 'bg-teal-200/80 border-teal-300/50 text-gray-900 hover:bg-teal-300/80',
      'preposition': 'bg-cyan-200/80 border-cyan-300/50 text-gray-900 hover:bg-cyan-300/80',
      'adjective': 'bg-lime-200/80 border-lime-300/50 text-gray-900 hover:bg-lime-300/80',
      'adverb': 'bg-amber-200/80 border-amber-300/50 text-gray-900 hover:bg-amber-300/80',
      'time-phrase': 'bg-sky-200/80 border-sky-300/50 text-gray-900 hover:bg-sky-300/80',
      'determiner': 'bg-rose-200/80 border-rose-300/50 text-gray-900 hover:bg-rose-300/80'
    }
    return colors[category as keyof typeof colors] || 'bg-slate-200/80 border-slate-300/50 text-gray-900 hover:bg-slate-300/80'
  }

  // Transform verbs for tense/aspect to display appropriate forms
  const mapVerbForLevel = (wordObj: { word?: string; category?: string }) => {
    const category = detectLevelCategory()
    if (wordObj.category !== 'verb') return wordObj
    const base = wordObj.baseForm || wordObj.word?.split('/')?.[0]
    const third = wordObj.thirdPersonForm || wordObj.word?.split('/')?.[1]
    const v2 = wordObj.v2 || toPastTense(base)
    const v3 = wordObj.v3 || toPastParticiple(base)
    const ving = wordObj.ving || `${base?.endsWith('e') ? base.slice(0,-1) : base}ing`

    // Choose default display depending on level
    if (category.includes('past') && !category.includes('perfect') && !category.includes('continuous')) {
      return { ...wordObj, word: v2, originalWord: v2, toggleable: false }
    }
    if (category.includes('perfect') && !category.includes('continuous')) {
      return { ...wordObj, word: v3, originalWord: v3, toggleable: false }
    }
    if (category.includes('continuous')) {
      return { ...wordObj, word: ving, originalWord: ving, toggleable: false }
    }
    if (category.includes('future')) {
      return { ...wordObj, word: base, originalWord: `${base}/${third}`, toggleable: true }
    }
    // Default: show toggle base/3rd
    return { ...wordObj, word: `${base}/${third}`, originalWord: `${base}/${third}`, toggleable: true }
  }

  // Get word display for challenge mode with improved verb handling
  const getChallengeWordDisplay = (wordObj: { word: string; baseForm?: string; thirdPersonForm?: string; category: string; toggleable?: boolean }) => {
    // Show both forms in shuffled; otherwise show current form
    if (learningMode === 'shuffled' && wordObj.category === 'verb' && wordObj.toggleable && wordObj.baseForm && wordObj.thirdPersonForm) {
      return `${wordObj.baseForm}/${wordObj.thirdPersonForm}`
    }
    return wordObj.word
  }

  // Check if a word is currently in its toggled state
  const isWordToggled = (wordObj: { word: string; baseForm?: string; thirdPersonForm?: string }) => {
    if (!wordObj.baseForm || !wordObj.thirdPersonForm) return false

    // If word contains '/', it's showing both forms (untoggled state)
    // If it doesn't contain '/', it's showing just one form (toggled state)
    return !wordObj.word.includes('/')
  }

  const getCategoryIcon = (categoryName: string) => {
    const icons = {
      'subjects': '🙂',
      'verbs': '⚡',
      'objects': '📘',
      'articles': '📝',
      'helpers': '🔧',
      'negatives': '❌',
      'question-words': '❓',
      'modals': '🔮',
      'conjunctions': '🧩',
      'prepositions': '🧷',
      'adjectives': '🌈',
      'adverbs': '💨',
      'time': '⏰',
      'places': '📍',
      'determiners': '🏷️'
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

  // Debug mobile detection
  console.log('Mobile detection:', { isClient, isMobile, width: typeof window !== 'undefined' ? window.innerWidth : 'SSR' })
  
  // Force mobile layout for testing (375px viewport)
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return (
      <MobileGameLayout
        level={level}
        selectedTiles={selectedTiles}
        onTileSelect={(tile) => handleTileClick(tile.word, tile.category)}
        onTileRemove={removeTile}
        onCheckSentence={checkSentence}
        onSaveSentence={saveSentence}
        onClearSentence={clearSentence}
        feedback={feedback}
        showFeedback={showFeedback}
        isEvaluating={isEvaluating}
        categorizedCorrect={categorizedCorrect}
        learningMode={learningMode}
        onModeChange={setLearningMode}
        wordTiles={wordCategories}
        onBack={() => router.push('/game/levels')}
        onShowHelp={() => setShowHelpModal(true)}
      />
    )
  }

  // Temporary: Always show mobile layout for testing
  if (!level) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-2xl mx-auto text-center py-20">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Level Not Found</h1>
          <p className="text-gray-600 mb-6">The level you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/game/levels')}>
            Back to Levels
          </Button>
        </div>
      </div>
    )
  }

  // Render appropriate layout based on device
  if (isClient && isMobile) {
    return (
      <MobileGameLayout
        level={level}
        selectedTiles={selectedTiles}
        onTileSelect={(tile) => handleTileClick(tile.word, tile.category)}
        onTileRemove={removeTile}
        onCheckSentence={checkSentence}
        onSaveSentence={saveSentence}
        onClearSentence={clearSentence}
        feedback={feedback}
        showFeedback={showFeedback}
        isEvaluating={isEvaluating}
        categorizedCorrect={categorizedCorrect}
        learningMode={learningMode}
        onModeChange={setLearningMode}
        wordTiles={wordCategories}
        onBack={() => router.push('/game/levels')}
        onShowHelp={() => setShowHelpModal(true)}
      />
    )
  }

  // Desktop layout
  return (
    <DesktopGameLayout
      level={level}
      selectedTiles={selectedTiles}
      onTileSelect={(tile) => handleTileClick(tile.word, tile.category)}
      onTileRemove={removeTile}
      onCheckSentence={checkSentence}
      onSaveSentence={saveSentence}
      onClearSentence={clearSentence}
      feedback={feedback}
      showFeedback={showFeedback}
      isEvaluating={isEvaluating}
      categorizedCorrect={categorizedCorrect}
      learningMode={learningMode}
      onModeChange={setLearningMode}
      wordTiles={wordCategories}
      onBack={() => router.push('/game/levels')}
      onShowHelp={() => setShowHelpModal(true)}
      progress={progress.progressPercentage}
      streak={progress.streak}
      totalPoints={progress.totalPoints}
    />
  )

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0B1220]">
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
        /* Custom thin scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4B5563;
        }
        
        /* Mobile-specific optimizations */
        @media (max-width: 1024px) {
          .word-toolbox {
            max-height: calc(100vh - 300px) !important;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: #4B5563 transparent;
          }
          .sentence-building-area {
            position: sticky;
            top: 0;
            z-index: 30;
            background: rgba(15, 23, 42, 0.98);
            backdrop-filter: blur(12px);
            margin: 0;
            border-radius: 1rem;
            padding: 1rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
            border: 2px solid rgba(71, 85, 105, 0.5);
            margin-bottom: 1rem;
          }
          .mobile-grammar-guide {
            order: -1 !important;
            margin-bottom: 1rem;
          }
          .main-game-container {
            gap: 0.75rem !important;
          }
          .word-tile {
            min-height: 44px !important;
            padding: 0.75rem 1rem !important;
            font-size: 0.875rem !important;
            touch-action: manipulation;
          }
          .action-button {
            min-height: 48px !important;
            padding: 0.75rem 1.5rem !important;
            font-size: 1rem !important;
            touch-action: manipulation;
          }
        }

        @media (max-width: 768px) {
          .word-toolbox {
            max-height: calc(100vh - 350px) !important;
            padding-bottom: 2rem;
          }
          .horizontal-layout {
            flex-direction: column !important;
            gap: 1rem !important;
          }
          .sentence-area-mobile {
            order: 1;
            position: sticky;
            top: 0;
            z-index: 35;
            background: rgba(15, 23, 42, 0.98);
            backdrop-filter: blur(15px);
            border: 2px solid rgba(71, 85, 105, 0.5);
            border-radius: 1rem;
            margin: 0 0 1rem 0;
            padding: 1rem;
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.5);
          }
          .mobile-grammar-guide {
            order: 0 !important;
            margin-top: 0 !important;
            margin-bottom: 1rem;
          }
          .word-tile {
            min-height: 48px !important;
            padding: 1rem 1.25rem !important;
            font-size: 1rem !important;
          }
          .action-button {
            min-height: 52px !important;
            padding: 1rem 1.5rem !important;
            font-size: 1.1rem !important;
          }
        }
      `}</style>
      <style jsx global>{`
        @keyframes progressGlow {
          0% { background-position: 0% 0%; box-shadow: 0 0 0px rgba(167,139,250,0.0); }
          50% { background-position: 100% 0%; box-shadow: 0 0 8px rgba(167,139,250,0.35); }
          100% { background-position: 0% 0%; box-shadow: 0 0 0px rgba(167,139,250,0.0); }
        }
      `}</style>
      {/* Subtle Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-sky-950/40 to-purple-950/40">
        <div className="absolute -top-16 -right-16 w-[28rem] h-[28rem] bg-[conic-gradient(at_30%_20%,#6EE7F9_0deg,#A78BFA_120deg,#F472B6_240deg,#6EE7F9_360deg)] opacity-25 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-6rem] left-[-6rem] w-[28rem] h-[28rem] bg-[conic-gradient(at_70%_80%,#34D399_0deg,#60A5FA_120deg,#C084FC_240deg,#34D399_360deg)] opacity-25 rounded-full blur-[110px]"></div>
      </div>


      {/* Level Complete Animation */}
      {showLevelComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-8 rounded-3xl shadow-2xl transform animate-pulse">
            <div className="text-center space-y-4">
              <div className="text-6xl animate-bounce">🎉</div>
              <h2 className="text-3xl font-bold text-white">Good Job!</h2>
              <p className="text-xl text-white/90">You&apos;ve completed {level.name}!</p>
              <div className="text-2xl animate-pulse">Let&apos;s continue! 🚀</div>
            </div>
          </div>
        </div>
      )}

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen p-2 sm:p-4 pt-16">
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
                  className="h-1.5 rounded-full transition-all duration-500 bg-[linear-gradient(90deg,#22D3EE,#A78BFA,#F472B6,#34D399)] bg-[length:200%_100%] animate-[progressGlow_3s_linear_infinite]"
                  style={{ width: `${((level.id / 47) * 100)}%` }}
                />
              </div>
              <span className="text-xs text-slate-400">{Math.round(((level.id / 47) * 100))}%</span>
            </div>
          </div>

          {/* Lesson Card */}
          <Card className="bg-slate-800/90 backdrop-blur-sm shadow-lg border-0 rounded-2xl border border-slate-700/50">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                    {level.name}
                  </h1>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHelpModal(true)}
                  className="flex items-center gap-2 bg-slate-700/50 text-slate-200 border-slate-600/30 hover:bg-slate-600/50 rounded-full backdrop-blur-sm transition-all duration-300"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span className="text-sm">How to use</span>
                </Button>
              </div>

          {/* Grammar Guide - Mobile First Position */}
          <div className="lg:hidden mobile-grammar-guide">
            {grammarPatternLoading ? (
              <div className="rounded-xl border bg-slate-800/40 border-slate-600/30 p-4">
                <div className="animate-pulse">
                  <div className="h-6 bg-slate-600/30 rounded mb-2"></div>
                  <div className="h-4 bg-slate-600/20 rounded"></div>
                </div>
              </div>
            ) : (
              <GrammarGuideCard
                persistKey={`grammar-open-${levelId}`}
                title="📚 Complete Grammar Guide"
                grammarPattern={currentGrammarPattern || undefined}
                levelId={levelId.toString()}
              />
            )}
          </div>

          {/* Main Content Area with Horizontal Layout */}
          <div className="flex flex-col lg:flex-row gap-6 min-h-[600px] horizontal-layout main-game-container">
            {/* Left Side - Sentence Building Area */}
            <div className="flex-1 min-w-0 sentence-area-mobile">
              <Card className="bg-slate-800/90 backdrop-blur-sm shadow-lg border-2 border-slate-600 rounded-2xl h-full sentence-building-area">
            <div className="p-4">
              <div className="text-center mb-3">
                <div className="flex items-center justify-center space-x-2">
                  <BookOpen className="w-4 h-4 text-white" />
                  <h2 className="text-lg font-bold text-white">
                    {learningMode === 'categorized' ? 'Build Your Sentence' : 'Challenge Mode - Mixed Words!'}
                  </h2>
                </div>

                {/* Dual-Mode Progress Bar */}
                <div className="mt-2 max-w-md mx-auto">
                  <div className="flex items-center justify-between text-xs text-gray-300 mb-1">
                    <span>
                      {learningMode === 'categorized' ? 'Learn with Categories' : 'Challenge - No Categories'}
                    </span>
                    <span>
                      {learningMode === 'categorized'
                        ? `${categorizedCorrect} / 5 correct`
                        : `${shuffledCorrect} / 3 correct`}
                    </span>
                  </div>
                  <div className={`bg-slate-700/50 rounded-full h-1.5 transition-all duration-300 ${
                    isEvaluating ? 'ring-2 ring-blue-400/50 animate-pulse' : ''
                  }`}>
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        learningMode === 'categorized'
                          ? 'bg-gradient-to-r from-blue-400 to-blue-500'
                          : 'bg-gradient-to-r from-purple-400 to-purple-500'
                      }`}
                      style={{
                        width: learningMode === 'categorized'
                          ? `${(categorizedCorrect * 20)}%`
                          : `${(shuffledCorrect * 33.33)}%`
                      }}>
                  </div>
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
                          {/* Show formatted sentence for successful attempts */}
                          {formattedSentence && (feedback.includes('Perfect') || feedback.includes('Correct') || feedback.includes('Excellent') || feedback.includes('Fantastic') || feedback.includes('mastered') || feedback.includes('Outstanding') || feedback.includes('improving') || feedback.includes('Great') || feedback.includes('Well done') || feedback.includes('🚀')) && (
                            <div className="mb-2 p-2 bg-green-100/80 border border-green-300/60 rounded-lg">
                              <div className="text-xs text-green-700 font-medium mb-1">✨ Properly formatted:</div>
                              <div className="text-sm font-medium text-green-800">{formattedSentence}</div>
                            </div>
                          )}

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
                        {usedPronouns.map((pronoun) => (
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
                      <div
                        className="min-h-[60px] p-3 sm:p-4 border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-r from-blue-50/60 to-purple-50/60 mb-4"
                        onDragOver={onDragOver}
                        onDrop={onDropToEnd}
                      >
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
                                className={`${getCategoryColor(tile.category)} cursor-move hover:scale-105 hover:shadow-lg text-sm px-3 py-2 rounded-full transition-all duration-200 border shadow-sm min-h-[36px] touch-manipulation`}
                                draggable
                                onDragStart={(e) => onDragStart(e, index)}
                                onDragOver={onDragOver}
                                onDrop={(e) => onDrop(e, index)}
                        onClick={() => removeTile(index)}
                      >
                        <span className={tile.category === 'verb' && isWordToggled(tile) ? 'font-bold' : ''}>
                          {getChallengeWordDisplay(tile)}
                        </span>
                        <span className="ml-1 text-xs opacity-60">×</span>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 mb-4">
               <Button
                 onClick={checkSentence}
                 className="action-button flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white font-semibold rounded-full px-4 py-2.5 shadow-lg transform hover:scale-105 transition-all duration-200 text-sm w-full sm:w-auto"
                 disabled={selectedTiles.length === 0}
               >
                 <CheckCircle className="w-4 h-4" />
                 <span>Check Sentence</span>
               </Button>

               <Button
                 onClick={saveSentence}
                 className={`action-button flex items-center justify-center space-x-2 ${justSaved ? 'bg-green-500 hover:bg-green-600' : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'} text-white font-semibold rounded-full px-4 py-2.5 shadow-lg transform hover:scale-105 transition-all duration-200 text-sm w-full sm:w-auto`}
                 disabled={selectedTiles.length === 0}
               >
                 {justSaved ? (
                   <>
                     <CheckCircle className="w-4 h-4" />
                     <span>Saved!</span>
                   </>
                 ) : (
                   <>
                     <Heart className="w-4 h-4" />
                     <span>Save</span>
                   </>
                 )}
               </Button>

               <Button
                 variant="outline"
                 onClick={clearSentence}
                 className="action-button flex items-center justify-center space-x-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-md rounded-full px-4 py-2.5 transition-all duration-200 text-sm w-full sm:w-auto"
               >
                 <RotateCcw className="w-4 h-4" />
                 <span>Clear</span>
               </Button>

                {(categorizedCorrect >= 5 && shuffledCorrect >= 3) && (
                  <Button
                    onClick={nextLevel}
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-full px-4 py-2.5 shadow-lg transform hover:scale-105 transition-all duration-200 text-sm w-full sm:w-auto"
                  >
                    <span>Next Level</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Button>
                )}
              </div>

              {/* Consolidated Grammar Guide - Desktop Only */}
              <div className="hidden lg:block mt-6 pt-4 border-t border-slate-600/30">
                {grammarPatternLoading ? (
                  <div className="rounded-xl border bg-slate-800/40 border-slate-600/30 p-4">
                    <div className="animate-pulse">
                      <div className="h-6 bg-slate-600/30 rounded mb-2"></div>
                      <div className="h-4 bg-slate-600/20 rounded"></div>
                    </div>
                  </div>
                ) : (
                  <GrammarGuideCard
                    persistKey={`grammar-open-${levelId}`}
                    title="📚 Complete Grammar Guide"
                    grammarPattern={currentGrammarPattern || undefined}
                    levelId={levelId.toString()}
                  />
                )}
              </div>
              </div>
            </Card>
            </div>

            {/* Right Side - Word Categories Toolbox */}
                <div className="w-full lg:w-80 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar word-toolbox">
              <div className="lg:sticky lg:top-0 bg-gradient-to-r from-gray-900 via-gray-900 to-gray-900/95 backdrop-blur-sm pb-3 z-10 border-b border-slate-700/30">
                <div className="relative flex items-center justify-center">
                  <h3 className="text-lg font-bold text-white flex items-center tracking-wide">
                    <span className="mr-3 text-xl">🧰</span>
                    Word Toolbox
                  </h3>
          <Button
            onClick={() => setShowVerbGuide(true)}
            variant="ghost"
            className="absolute left-0 text-gray-300 hover:text-white hover:bg-slate-700/60 p-2 rounded-full transition-all duration-200"
            title="Verb System Guide (V1, V1-3rd, V-ing, V2, V3)"
          >
            <BookOpen className="w-5 h-5" />
          </Button>
                  <Button
                    onClick={() => setShowSavedModal(true)}
                    variant="ghost"
                    className="absolute right-0 text-gray-300 hover:text-white hover:bg-slate-700/60 p-2 rounded-full transition-all duration-200 relative"
                  >
                    <Bookmark className="w-5 h-5" />
                    {savedSentences.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {savedSentences.length > 9 ? '9+' : savedSentences.length}
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              {/* Vertical layout with helper tip */}
              <div className="space-y-3">
            {/* Helper Instructions and Logical Word Combination Tips */}
            {level.requiredCategories?.includes('verbs') && (
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-600/40 shadow-lg">
                <div className="flex flex-col items-center justify-center space-y-3 text-slate-200 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-400 text-base">💡</span>
                    <span className="font-medium"><strong className="text-white">Tip:</strong> Click verb tiles to toggle forms</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-purple-300/90 text-gray-900 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm">eat</span>
                    <span className="text-slate-300 font-bold">↔</span>
                    <span className="bg-purple-300/90 text-gray-900 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm">eats</span>
                  </div>
                  {learningMode === 'shuffled' && (
                    <div className="flex items-center space-x-2 text-xs text-purple-300">
                      <span>🎯</span>
                      <span>Challenge mode shows both forms for easy toggling</span>
                    </div>
                  )}
                </div>
              </div>
            )}

                {/* Combo Tips removed for now */}

            {/* Vertical Stacked Word Categories */}
            {learningMode === 'categorized' ? (
                  <WordCategoryList
                    categoriesToShow={level.requiredCategories || []}
                    wordCategories={wordCategories}
                    getCategoryIcon={getCategoryIcon}
                    getCategoryColor={getCategoryColor}
                    getChallengeWordDisplay={(w: { word?: string; category?: string }) => getChallengeWordDisplay(mapVerbForLevel(w))}
                    onTileClick={handleTileClick}
                    limitWordsPerCategory={10}
                    levelId={level.id}
                  />
                ) : (
              <Card className="bg-slate-800/90 backdrop-blur-sm shadow-lg border-0 rounded-2xl overflow-hidden border border-slate-700/50">
                    <div className="bg-gradient-to-r from-sky-400/60 via-fuchsia-400/60 to-emerald-400/60 p-2">
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-lg">🎯</span>
                        <h3 className="text-sm font-bold text-gray-900">Challenge Mode - Mixed Words with Verb Toggle!</h3>
                  </div>
                </div>
                <div className="p-3">
                      <ShuffledWordGrid
                        words={getShuffledWords().map((w: { word?: string; category?: string }) => mapVerbForLevel(w))}
                        learningMode={learningMode}
                        isWordToggled={isWordToggled}
                        getCategoryColor={getCategoryColor}
                        getChallengeWordDisplay={getChallengeWordDisplay}
                        onTileClick={handleTileClick}
                      />
                </div>
              </Card>
            )}
              </div>
            </div>
          </div>

          {/* duplicate content fully removed */}
          </div>
          </Card>
        </div>
      </div>

      {/* Verb System Guide Modal */}
      <VerbSystemGuide open={showVerbGuide} onClose={() => setShowVerbGuide(false)} />

      {/* Saved Sentences Modal */}
      {showSavedModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-600 flex items-center justify-between bg-gradient-to-r from-purple-500/15 to-pink-500/15">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Bookmark className="w-5 h-5 mr-2 text-purple-400" />
                My Saved Sentences
              </h2>
              <Button
                onClick={() => setShowSavedModal(false)}
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-slate-700/60 p-2 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {savedSentences.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg mb-2">No saved sentences yet</p>
                  <p className="text-gray-500 text-sm">Start building sentences and click the Save button to collect your favorites!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedSentences.map((saved) => (
                    <div key={saved.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-white font-medium text-lg mb-2">"{saved.sentence}"</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>Level {saved.level}</span>
                            <span>•</span>
                            <span>{new Date(saved.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            onClick={() => loadSavedSentence(saved.sentence)}
                            variant="ghost"
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 p-2 rounded-lg"
                          >
                            <BookmarkPlus className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => deleteSavedSentence(saved.id)}
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-2 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {savedSentences.length > 0 && (
              <div className="px-6 py-4 border-t border-slate-600 bg-slate-700/30">
                <p className="text-center text-sm text-gray-400">
                  {savedSentences.length} saved sentence{savedSentences.length !== 1 ? 's' : ''} • Click <BookmarkPlus className="inline w-4 h-4 mx-1" /> to load a sentence
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-600 flex items-center justify-between bg-gradient-to-r from-blue-500/15 to-purple-500/15 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white flex items-center drop-shadow-lg">
                <HelpCircle className="w-7 h-7 mr-3 text-blue-300" />
                How to Use Sentence Builder
              </h2>
              <Button
                onClick={() => setShowHelpModal(false)}
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-slate-700/60 p-2 rounded-full transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 space-y-8">
              {/* Basic Instructions */}
              <section>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-10 h-10 bg-blue-500/30 text-blue-200 rounded-full flex items-center justify-center text-lg font-bold mr-4 border-2 border-blue-400/40">1</span>
                  Build Your Sentence
                </h3>
                <Card className="p-6 bg-slate-700/40 border-2 border-slate-600/50 shadow-lg">
                  <div className="space-y-4 text-slate-100">
                    <p className="text-lg leading-relaxed font-medium">
                      <span className="text-blue-300 font-bold">Click word tiles</span> below to build your sentence. Start with a subject, add a verb, then an object.
                    </p>
                    <div className="bg-blue-500/15 p-4 rounded-xl border-2 border-blue-400/30 shadow-inner">
                      <p className="text-base font-semibold text-blue-200">
                        <span className="text-blue-300">Example:</span> Click <span className="bg-slate-600/50 px-2 py-1 rounded font-mono text-sm">I</span> →
                        <span className="bg-slate-600/50 px-2 py-1 rounded font-mono text-sm ml-2">like</span> →
                        <span className="bg-slate-600/50 px-2 py-1 rounded font-mono text-sm ml-2">pizza</span> to make "I like pizza"
                      </p>
                    </div>
                  </div>
                </Card>
              </section>

              {/* Verb Toggle Instructions */}
              {level.requiredCategories?.includes('verbs') && (
                <section>
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <span className="w-10 h-10 bg-purple-500/30 text-purple-200 rounded-full flex items-center justify-center text-lg font-bold mr-4 border-2 border-purple-400/40">2</span>
                    Toggle Verb Forms
                  </h3>
                  <Card className="p-6 bg-slate-700/40 border-2 border-slate-600/50 shadow-lg">
                    <div className="space-y-4 text-slate-100">
                      <p className="text-lg leading-relaxed font-medium">
                        Some verbs can change form! Look for the <span className="bg-purple-500/30 px-3 py-1 rounded-lg text-base font-bold text-purple-200 border border-purple-400/40">↔</span> symbol.
                      </p>
                      <div className="bg-purple-500/15 p-4 rounded-xl border-2 border-purple-400/30 shadow-inner">
                        <p className="text-base font-semibold text-purple-200 mb-3">
                          <span className="text-purple-300">Click to toggle:</span>
                        </p>
                        <div className="flex items-center justify-center gap-4 text-base">
                          <span className="bg-slate-600/80 px-3 py-2 rounded-lg font-mono font-bold text-white shadow-sm">eat</span>
                          <span className="text-purple-300 text-xl font-bold">↔</span>
                          <span className="bg-slate-600/80 px-3 py-2 rounded-lg font-mono font-bold text-white shadow-sm">eats</span>
                        </div>
                        <p className="text-sm text-purple-200/80 mt-3 font-medium">
                          Use base form with I/you/we/they, add -s with he/she/it
                        </p>
                      </div>
                    </div>
                  </Card>
                </section>
              )}

              {/* Check and Clear */}
              <section>
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <span className="w-10 h-10 bg-green-500/30 text-green-200 rounded-full flex items-center justify-center text-lg font-bold mr-4 border-2 border-green-400/40">3</span>
                    Check Your Sentence
                  </h3>
                  <Card className="p-6 bg-slate-700/40 border-2 border-slate-600/50 shadow-lg">
                    <div className="space-y-4 text-slate-100">
                      <p className="text-lg leading-relaxed font-medium">
                        When you're happy with your sentence, click the <span className="text-green-300 font-bold bg-green-500/20 px-2 py-1 rounded">Check Sentence</span> button.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-500/15 p-4 rounded-xl border-2 border-green-400/30 shadow-inner">
                          <p className="text-base mb-2 font-bold text-green-200 flex items-center">
                            <span className="text-green-300 mr-2">✅</span> Correct:
                          </p>
                          <p className="text-sm text-green-100/90 font-medium">You'll get points and feedback!</p>
                        </div>
                        <div className="bg-orange-500/15 p-4 rounded-xl border-2 border-orange-400/30 shadow-inner">
                          <p className="text-base mb-2 font-bold text-orange-200 flex items-center">
                            <span className="text-orange-300 mr-2">⚠️</span> Almost:
                          </p>
                          <p className="text-sm text-orange-100/90 font-medium">Hints to improve your sentence</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </section>

              {/* Progress and Modes */}
              <section>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-10 h-10 bg-orange-500/30 text-orange-200 rounded-full flex items-center justify-center text-lg font-bold mr-4 border-2 border-orange-400/40">4</span>
                  Learning Modes
                </h3>
                <Card className="p-6 bg-slate-700/40 border-2 border-slate-600/50 shadow-lg">
                  <div className="space-y-4 text-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-500/15 p-4 rounded-xl border-2 border-blue-400/30 shadow-inner">
                        <h4 className="font-bold text-blue-200 mb-3 flex items-center text-base">
                          <span className="w-6 h-6 bg-blue-500/30 rounded-lg mr-3 flex items-center justify-center text-sm">📝</span>
                          Learning Mode
                        </h4>
                        <p className="text-sm font-medium text-blue-100/90">
                          Words are organized by category. Complete <span className="font-bold text-blue-300">5 correct sentences</span> to unlock Challenge Mode.
                        </p>
                      </div>
                      <div className="bg-purple-500/15 p-4 rounded-xl border-2 border-purple-400/30 shadow-inner">
                        <h4 className="font-bold text-purple-200 mb-3 flex items-center text-base">
                          <span className="w-6 h-6 bg-purple-500/30 rounded-lg mr-3 flex items-center justify-center text-sm">🎯</span>
                          Challenge Mode
                        </h4>
                        <p className="text-sm font-medium text-purple-100/90">
                          All words are mixed together. Complete <span className="font-bold text-purple-300">3 correct sentences</span> to finish the level.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </section>

              {/* Tips */}
              <section>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-10 h-10 bg-yellow-500/30 text-yellow-200 rounded-full flex items-center justify-center text-lg font-bold mr-4 border-2 border-yellow-400/40">💡</span>
                  Pro Tips
                </h3>
                <Card className="p-6 bg-slate-700/40 border-2 border-slate-600/50 shadow-lg">
                  <div className="space-y-4 text-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-400/20">
                        <span className="text-yellow-300 mt-1 text-lg">•</span>
                        <p className="text-sm font-medium text-yellow-100/90">Read your sentence out loud before checking</p>
                      </div>
                      <div className="flex items-start space-x-4 p-3 bg-blue-500/10 rounded-lg border border-blue-400/20">
                        <span className="text-blue-300 mt-1 text-lg">•</span>
                        <p className="text-sm font-medium text-blue-100/90">Use the Pattern guide to understand sentence structure</p>
                      </div>
                      <div className="flex items-start space-x-4 p-3 bg-green-500/10 rounded-lg border border-green-400/20">
                        <span className="text-green-300 mt-1 text-lg">•</span>
                        <p className="text-sm font-medium text-green-100/90">Grammar Tip box explains specific rules</p>
                      </div>
                      <div className="flex items-start space-x-4 p-3 bg-purple-500/10 rounded-lg border border-purple-400/20">
                        <span className="text-purple-300 mt-1 text-lg">•</span>
                        <p className="text-sm font-medium text-purple-100/90">Clear and rebuild if you're stuck</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </section>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-600 bg-slate-700/40 backdrop-blur-sm">
              <div className="flex justify-center">
                <Button
                  onClick={() => setShowHelpModal(false)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-full font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Got it! Let's build sentences! 🎯
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
