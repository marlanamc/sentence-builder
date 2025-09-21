"use client"

import { ChevronDown, ChevronUp, Target, Edit3, Lightbulb, AlertTriangle, Brain, Clock } from 'lucide-react'
import { useEffect } from 'react'
import { usePersistentState } from '@/hooks/usePersistentState'

// Enhanced CSV structure type
type GrammarPattern = {
  level_id: string
  name: string
  category: string
  pattern_display: string
  pattern_formula: string
  pattern_components: string
  example_1: string
  example_2: string
  example_3: string
  explanation: string
  show_articles: boolean
  show_helpers: boolean
  show_negation: boolean
  show_questions: boolean
  helper_type: string
  question_type: string
  spanish_error_pattern: string
  gentle_correction: string
  memory_trick: string
  time_markers: string
  exception_notes: string
}

type Props = {
  title?: string
  persistKey: string
  headerIcon?: React.ReactNode
  grammarPattern?: GrammarPattern
  levelId?: string
}

export function GrammarGuideCard({ title, persistKey, headerIcon = <span className="text-base">💡</span>, grammarPattern, levelId }: Props) {
  const [open, setOpen] = usePersistentState<boolean>(persistKey, false)

  // Suppress hydration warnings for this component
  useEffect(() => {
    // This component uses localStorage which can cause hydration mismatches
    // The warning is suppressed here to prevent console noise
  }, [])

  // If no grammar pattern provided, use empty state
  if (!grammarPattern) {
    return (
      <div className="rounded-xl border overflow-hidden bg-slate-800/40 border-slate-600/30">
        <div className="p-4 text-center text-white/70">
          <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Grammar guide not available for this level</p>
        </div>
      </div>
    )
  }

  const displayTitle = title || `Level ${grammarPattern.level_id}: ${grammarPattern.name}`

  const getSectionColors = (type: 'pattern' | 'examples' | 'explanation' | 'spanish' | 'memory' | 'time' | 'exceptions') => {
    const colorMap = {
      pattern: {
        bg: 'bg-[#FFADAD]/85',
        border: 'border-[#FFADAD]/90',
        text: 'text-gray-800',
        header: 'text-gray-900',
        icon: 'text-[#FF6B6B]'
      },
      examples: {
        bg: 'bg-[#FFD6A5]/85',
        border: 'border-[#FFD6A5]/90',
        text: 'text-gray-800',
        header: 'text-gray-900',
        icon: 'text-[#FF8C42]'
      },
      explanation: {
        bg: 'bg-[#FDFFB6]/85',
        border: 'border-[#FDFFB6]/90',
        text: 'text-gray-800',
        header: 'text-gray-900',
        icon: 'text-[#F4D03F]'
      },
      spanish: {
        bg: 'bg-[#CAFFBF]/85',
        border: 'border-[#CAFFBF]/90',
        text: 'text-gray-800',
        header: 'text-gray-900',
        icon: 'text-[#52C41A]'
      },
      memory: {
        bg: 'bg-[#9BF6FF]/85',
        border: 'border-[#9BF6FF]/90',
        text: 'text-gray-800',
        header: 'text-gray-900',
        icon: 'text-[#1890FF]'
      },
      time: {
        bg: 'bg-[#A0C4FF]/85',
        border: 'border-[#A0C4FF]/90',
        text: 'text-gray-800',
        header: 'text-gray-900',
        icon: 'text-[#597EF7]'
      },
      exceptions: {
        bg: 'bg-[#BDB2FF]/85',
        border: 'border-[#BDB2FF]/90',
        text: 'text-gray-800',
        header: 'text-gray-900',
        icon: 'text-[#9254DE]'
      }
    }
    return colorMap[type]
  }

  // Create colored word bubbles that match the toolbox
  const createWordBubble = (word: string, type: 'subject' | 'verb' | 'object' | 'article' | 'helper' | 'negation' | 'question' | 'time' | 'preposition' | 'adverb') => {
    const colorMap = {
      subject: 'bg-sky-200/90 border-sky-300/60 text-gray-900',
      verb: 'bg-purple-200/90 border-purple-300/60 text-gray-900',
      object: 'bg-orange-200/90 border-orange-300/60 text-gray-900',
      article: 'bg-pink-200/90 border-pink-300/60 text-gray-900',
      helper: 'bg-violet-200/90 border-violet-300/60 text-gray-900',
      negation: 'bg-red-200/90 border-red-300/60 text-gray-900',
      question: 'bg-emerald-200/90 border-emerald-300/60 text-gray-900',
      time: 'bg-sky-200/90 border-sky-300/60 text-gray-900',
      preposition: 'bg-cyan-200/90 border-cyan-300/60 text-gray-900',
      adverb: 'bg-amber-200/90 border-amber-300/60 text-gray-900'
    }

    return (
      <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium border shadow-sm ${colorMap[type]}`}>
        {word}
      </span>
    )
  }

  // Generate pattern bubbles from pattern_components
  const generatePatternBubbles = () => {
    const components = grammarPattern.pattern_components.split(',').map(c => c.trim())
    const elements = []

    components.forEach((component, idx) => {
      if (idx > 0) {
        elements.push(<span key={`plus-${idx}`} className="text-gray-600">+</span>)
      }

      switch (component) {
        case 'subject':
          elements.push(createWordBubble('Subject', 'subject'))
          break
        case 'verb':
          elements.push(createWordBubble('Verb', 'verb'))
          break
        case 'object':
          elements.push(createWordBubble('Object', 'object'))
          break
        case 'article':
          elements.push(createWordBubble('Article', 'article'))
          break
        case 'helper':
          elements.push(createWordBubble('Helper', 'helper'))
          break
        case 'negation':
          elements.push(createWordBubble('Not', 'negation'))
          break
        case 'question':
          elements.push(createWordBubble('Question Word', 'question'))
          break
        case 'time':
          elements.push(createWordBubble('Time', 'time'))
          break
        case 'preposition':
          elements.push(createWordBubble('Preposition', 'preposition'))
          break
        case 'adverb':
          elements.push(createWordBubble('Adverb', 'adverb'))
          break
        default:
          elements.push(createWordBubble(component, 'object'))
      }
    })

    return elements
  }

  // Parse example sentences and create colored bubbles
  const parseExampleSentence = (sentence: string) => {
    const words = sentence.trim().split(' ')
    return words.map((word, wordIdx) => {
      const cleanWord = word.replace(/[.,!?]/, '')
      let type: 'subject' | 'verb' | 'object' | 'article' | 'helper' | 'negation' | 'question' | 'time' | 'preposition' | 'adverb' = 'object'

      // Enhanced word detection based on CSV data
      if (['I', 'you', 'we', 'they', 'he', 'she', 'it', 'They', 'She', 'He', 'We', 'You'].includes(cleanWord)) type = 'subject'
      else if (['do', 'does', 'Do', 'Does', 'did', 'Did', 'am', 'is', 'are', 'was', 'were', 'have', 'has', 'had', 'will', 'would', 'can', 'could', 'should', 'shall', 'must'].includes(cleanWord)) type = 'helper'
      else if (['eat', 'eats', 'ate', 'eaten', 'play', 'plays', 'played', 'drink', 'drinks', 'drank', 'like', 'likes', 'liked', 'study', 'studies', 'studied', 'go', 'goes', 'went', 'gone', 'see', 'sees', 'saw', 'seen', 'make', 'makes', 'made', 'take', 'takes', 'took', 'taken'].includes(cleanWord)) type = 'verb'
      else if (['a', 'an', 'the'].includes(cleanWord)) type = 'article'
      else if (['not', "don't", "doesn't", "didn't", "haven't", "hasn't", "hadn't", "won't", "wouldn't", "can't", "couldn't", "shouldn't", "mustn't"].includes(cleanWord)) type = 'negation'
      else if (['what', 'where', 'when', 'who', 'how', 'why', 'which'].includes(cleanWord.toLowerCase())) type = 'question'
      else if (['today', 'yesterday', 'tomorrow', 'now', 'always', 'never', 'often', 'usually', 'sometimes', 'rarely', 'just', 'already', 'yet', 'ever', 'since', 'for'].includes(cleanWord.toLowerCase())) type = 'time'
      else if (['with', 'for', 'at', 'in', 'on', 'by', 'from', 'to', 'of', 'about', 'under', 'over', 'between', 'through'].includes(cleanWord.toLowerCase())) type = 'preposition'

      return (
        <span key={wordIdx}>
          {createWordBubble(word, type)}
        </span>
      )
    })
  }

  // Get usage context with timeline visualization for each grammar pattern
  const getUsageContext = (levelId: string) => {
    const usageMap: Record<string, JSX.Element> = {
      '1': ( // Present Simple Affirmative
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-blue-600 font-bold">📅</span>
            <span className="font-bold text-gray-900">For Routines, Habits &amp; General Facts</span>
          </div>

          {/* Timeline Visual */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-3 border border-blue-200">
            <div className="text-center mb-2">
              <div className="text-xs text-gray-600 mb-1">TIMELINE</div>
              <div className="flex items-center justify-center">
                <span className="text-gray-400 text-sm">Past</span>
                <div className="flex mx-4">
                  {Array.from({length: 11}, (_, i) => (
                    <span key={i} className={`mx-1 ${i === 5 ? 'text-2xl text-blue-600' : 'text-lg text-blue-400'}`}>
                      {i === 5 ? '📍' : 'X'}
                    </span>
                  ))}
                </div>
                <span className="text-gray-400 text-sm">Future</span>
              </div>
            </div>
          </div>

          {/* Verb Form Guide */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-3 border border-blue-200">
            <div className="text-sm font-medium text-gray-700 mb-2">🔑 The Magic -s Rule</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-blue-100 rounded p-2">
                <div className="font-bold text-blue-700">V1 (Base Form)</div>
                <div className="text-gray-600">I/you/we/they + eat</div>
              </div>
              <div className="bg-purple-100 rounded p-2">
                <div className="font-bold text-purple-700">V1-3rd (+s/es)</div>
                <div className="text-gray-600">he/she/it + eats</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-blue-700">Daily Routines:</strong> &quot;I brush my teeth&quot; / &quot;She brushes her teeth&quot; ☀️</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-green-700">General Facts:</strong> &quot;Water boils&quot; / &quot;It boils at 100°C&quot; 🌡️</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-purple-700">Habits:</strong> &quot;They drink coffee&quot; / &quot;She drinks coffee&quot; ☕</span>
            </div>
          </div>
        </div>
      ),
      '2': ( // Articles & Nouns
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-pink-600 font-bold">🎯</span>
            <span className="font-bold text-gray-900">For Specific vs. General Things</span>
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 mb-3 border border-pink-200">
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-pink-100 rounded p-2">
                <div className="font-bold text-pink-700">A/AN</div>
                <div className="text-gray-600">One of many</div>
                <div className="text-lg">🍎</div>
              </div>
              <div className="bg-purple-100 rounded p-2">
                <div className="font-bold text-purple-700">THE</div>
                <div className="text-gray-600">Specific one</div>
                <div className="text-lg">👆🍎</div>
              </div>
              <div className="bg-gray-100 rounded p-2">
                <div className="font-bold text-gray-700">NO ARTICLE</div>
                <div className="text-gray-600">Plural/Uncountable</div>
                <div className="text-lg">🍎🍎🍎</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-pink-700">A car</strong> = any car (general) 🚗</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-purple-700">The car</strong> = specific car we both know 👆🚗</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-gray-700">Cars</strong> = all cars in general 🚗🚗🚗</span>
            </div>
          </div>
        </div>
      ),
      '3': ( // Negative Present
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-red-600 font-bold">❌</span>
            <span className="font-bold text-gray-900">For Things That DON&apos;T Happen</span>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 mb-3 border border-red-200">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-700 mb-2">English Needs Helper Words</div>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="text-xs text-gray-600">Spanish</div>
                  <div className="bg-red-100 rounded px-2 py-1 text-sm">No como</div>
                </div>
                <span className="text-2xl">→</span>
                <div className="text-center">
                  <div className="text-xs text-gray-600">English</div>
                  <div className="bg-green-100 rounded px-2 py-1 text-sm">I <strong>don&apos;t</strong> eat</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-purple-700">Don&apos;t</strong> = I/you/we/they + negative</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-violet-700">Doesn't</strong> = he/she/it + negative</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span>Always use <strong>base verb</strong> after don't/doesn't</span>
            </div>
          </div>
        </div>
      ),
      '13': ( // Past Simple Affirmative
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-orange-600 font-bold">📅</span>
            <span className="font-bold text-gray-900">For Completed Actions in the Past</span>
          </div>

          {/* Timeline Visual - Past Simple */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 mb-3 border border-orange-200">
            <div className="text-center mb-2">
              <div className="text-xs text-gray-600 mb-1">TIMELINE</div>
              <div className="flex items-center justify-center">
                <span className="text-gray-400 text-sm">Past</span>
                <div className="flex mx-4">
                  {Array.from({length: 11}, (_, i) => (
                    <span key={i} className={`mx-1 ${i === 2 ? 'text-2xl text-orange-600' : 'text-lg text-gray-300'}`}>
                      {i === 2 ? '❌' : (i === 5 ? '|' : (i < 5 ? '·' : '·'))}
                    </span>
                  ))}
                </div>
                <span className="text-gray-400 text-sm">Future</span>
              </div>
              <div className="text-xs text-orange-600 mt-1">I studied English last year.</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-orange-700">Finished Actions:</strong> "I ate lunch at 12 PM" 🍽️</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-red-700">Past Events:</strong> "She visited Paris last summer" ✈️</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-orange-700">Time Markers:</strong> yesterday, last week, ago, in 2020 📆</span>
            </div>
          </div>
        </div>
      ),
      '25': ( // Future with "going to"
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-green-600 font-bold">🚀</span>
            <span className="font-bold text-gray-900">For Plans & Intentions</span>
          </div>

          {/* Timeline Visual - Future Simple */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-3 border border-green-200">
            <div className="text-center mb-2">
              <div className="text-xs text-gray-600 mb-1">TIMELINE</div>
              <div className="flex items-center justify-center">
                <span className="text-gray-400 text-sm">Past</span>
                <div className="flex mx-4">
                  {Array.from({length: 11}, (_, i) => (
                    <span key={i} className={`mx-1 ${i === 8 ? 'text-2xl text-green-600' : 'text-lg text-gray-300'}`}>
                      {i === 8 ? '❌' : (i === 5 ? '|' : (i < 5 ? '·' : '·'))}
                    </span>
                  ))}
                </div>
                <span className="text-gray-400 text-sm">Future</span>
              </div>
              <div className="text-xs text-green-600 mt-1">I will study English at Bunker Hill in the fall.</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-green-700">Plans:</strong> "I'm going to visit my family" 👨‍👩‍👧‍👦</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-blue-700">Intentions:</strong> "She's going to study medicine" 📚</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-green-700">Predictions:</strong> "It's going to rain tomorrow" 🌧️</span>
            </div>
          </div>
        </div>
      ),
      '7': ( // Present Continuous
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-purple-600 font-bold">🔄</span>
            <span className="font-bold text-gray-900">For Actions Happening Now</span>
          </div>

          {/* Timeline Visual - Present Continuous */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-3 border border-purple-200">
            <div className="text-center mb-2">
              <div className="text-xs text-gray-600 mb-1">TIMELINE</div>
              <div className="flex items-center justify-center">
                <span className="text-gray-400 text-sm">Past</span>
                <div className="flex mx-4 relative">
                  {Array.from({length: 11}, (_, i) => (
                    <span key={i} className={`mx-1 ${i === 5 ? 'text-2xl text-purple-600' : 'text-lg text-gray-300'}`}>
                      {i === 5 ? '|' : '·'}
                    </span>
                  ))}
                  {/* Curved arc for continuous action */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                    <svg width="60" height="20" viewBox="0 0 60 20">
                      <path d="M10 15 Q30 5 50 15" stroke="#9333ea" strokeWidth="3" fill="none" strokeDasharray="2,2"/>
                    </svg>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">Future</span>
              </div>
              <div className="text-xs text-purple-600 mt-1">I am studying English right now.</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-purple-700">Right Now:</strong> "I am eating breakfast" 🥞</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-pink-700">Temporary:</strong> "She is living with friends" 🏠</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-purple-700">Time Markers:</strong> now, right now, currently, at the moment ⏰</span>
            </div>
          </div>
        </div>
      ),
      '16': ( // Past Continuous
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-amber-600 font-bold">🔄</span>
            <span className="font-bold text-gray-900">For Ongoing Past Actions</span>
          </div>

          {/* Timeline Visual - Past Continuous */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 mb-3 border border-amber-200">
            <div className="text-center mb-2">
              <div className="text-xs text-gray-600 mb-1">TIMELINE</div>
              <div className="flex items-center justify-center">
                <span className="text-gray-400 text-sm">Past</span>
                <div className="flex mx-4 relative">
                  {Array.from({length: 11}, (_, i) => (
                    <span key={i} className={`mx-1 ${i === 5 ? 'text-2xl text-amber-600' : 'text-lg text-gray-300'}`}>
                      {i === 5 ? '|' : '·'}
                    </span>
                  ))}
                  {/* Curved arc for past continuous */}
                  <div className="absolute top-0 left-1/4 transform -translate-y-2">
                    <svg width="40" height="20" viewBox="0 0 40 20">
                      <path d="M5 15 Q20 5 35 15" stroke="#d97706" strokeWidth="3" fill="none" strokeDasharray="2,2"/>
                      <circle cx="35" cy="15" r="2" fill="#d97706"/>
                    </svg>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">Future</span>
              </div>
              <div className="text-xs text-amber-600 mt-1">I was studying English when my mom called me.</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-amber-700">Interrupted Actions:</strong> "I was cooking when she arrived" 👩‍🍳</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-orange-700">Background Actions:</strong> "While I was walking, it started raining" 🌧️</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-amber-700">Time Markers:</strong> while, when, at 3 PM yesterday ⏰</span>
            </div>
          </div>
        </div>
      ),
      '18': ( // Present Perfect
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-indigo-600 font-bold">🔗</span>
            <span className="font-bold text-gray-900">For Past Actions Connected to Now</span>
          </div>

          {/* Timeline Visual - Present Perfect */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 mb-3 border border-indigo-200">
            <div className="text-center mb-2">
              <div className="text-xs text-gray-600 mb-1">TIMELINE</div>
              <div className="flex items-center justify-center">
                <span className="text-gray-400 text-sm">Past</span>
                <div className="flex mx-4 relative">
                  {Array.from({length: 11}, (_, i) => (
                    <span key={i} className={`mx-1 ${i === 5 ? 'text-2xl text-indigo-600' : 'text-lg text-gray-300'}`}>
                      {i === 5 ? '|' : '·'}
                    </span>
                  ))}
                  {/* Oval for present perfect */}
                  <div className="absolute top-0 left-1/4 transform -translate-y-1">
                    <svg width="50" height="16" viewBox="0 0 50 16">
                      <ellipse cx="25" cy="8" rx="20" ry="6" stroke="#4f46e5" strokeWidth="2" fill="none"/>
                      <text x="25" y="12" textAnchor="middle" className="text-xs fill-indigo-600">❌→</text>
                    </svg>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">Future</span>
              </div>
              <div className="text-xs text-indigo-600 mt-1">I have studied English at a different school.</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-indigo-700">Life Experience:</strong> "I have visited Paris" (when = not important) ✈️</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-blue-700">Recent Past:</strong> "She has just finished her homework" ✅</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-indigo-700">Time Markers:</strong> ever, never, already, just, yet, since, for 📅</span>
            </div>
          </div>
        </div>
      ),
      '28': ( // Future Continuous
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-teal-600 font-bold">🔄</span>
            <span className="font-bold text-gray-900">For Ongoing Future Actions</span>
          </div>

          {/* Timeline Visual - Future Continuous */}
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 mb-3 border border-teal-200">
            <div className="text-center mb-2">
              <div className="text-xs text-gray-600 mb-1">TIMELINE</div>
              <div className="flex items-center justify-center">
                <span className="text-gray-400 text-sm">Past</span>
                <div className="flex mx-4 relative">
                  {Array.from({length: 11}, (_, i) => (
                    <span key={i} className={`mx-1 ${i === 5 ? 'text-2xl text-teal-600' : 'text-lg text-gray-300'}`}>
                      {i === 5 ? '|' : '·'}
                    </span>
                  ))}
                  {/* Curved arc for future continuous */}
                  <div className="absolute top-0 right-1/4 transform -translate-y-2">
                    <svg width="40" height="20" viewBox="0 0 40 20">
                      <path d="M5 15 Q20 5 35 15" stroke="#0d9488" strokeWidth="3" fill="none" strokeDasharray="2,2"/>
                    </svg>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">Future</span>
              </div>
              <div className="text-xs text-teal-600 mt-1">I will be studying English for the next 2 years.</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-teal-700">Future in Progress:</strong> "I will be working at 3 PM" 💼</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-cyan-700">Duration:</strong> "She will be traveling for 6 months" ✈️</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-teal-700">Time Markers:</strong> at this time tomorrow, next week, all day 📅</span>
            </div>
          </div>
        </div>
      ),
      '29': ( // Future Perfect
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-violet-600 font-bold">🎯</span>
            <span className="font-bold text-gray-900">For Completed Future Actions</span>
          </div>

          {/* Timeline Visual - Future Perfect */}
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 mb-3 border border-violet-200">
            <div className="text-center mb-2">
              <div className="text-xs text-gray-600 mb-1">TIMELINE</div>
              <div className="flex items-center justify-center">
                <span className="text-gray-400 text-sm">Past</span>
                <div className="flex mx-4 relative">
                  {Array.from({length: 11}, (_, i) => (
                    <span key={i} className={`mx-1 ${i === 5 ? 'text-2xl text-violet-600' : 'text-lg text-gray-300'}`}>
                      {i === 5 ? '|' : '·'}
                    </span>
                  ))}
                  {/* Oval for future perfect */}
                  <div className="absolute top-0 right-1/4 transform -translate-y-1">
                    <svg width="40" height="16" viewBox="0 0 40 16">
                      <ellipse cx="20" cy="8" rx="15" ry="6" stroke="#7c3aed" strokeWidth="2" fill="none"/>
                      <text x="20" y="12" textAnchor="middle" className="text-xs fill-violet-600">→❌</text>
                    </svg>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">Future</span>
              </div>
              <div className="text-xs text-violet-600 mt-1">I will have studied English for 5 years this summer.</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-violet-700">Completion by Deadline:</strong> "She will have graduated by June" 🎓</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-purple-700">Future Achievement:</strong> "I will have saved $1000 by December" 💰</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span><strong className="text-violet-700">Time Markers:</strong> by, by the time, before, in 5 years 📅</span>
            </div>
          </div>
        </div>
      )
    }

    return usageMap[levelId] || null
  }

  // Format detailed explanation with bullet points and bold text
  const formatDetailedExplanation = (explanation: string) => {
    // Split by sentences and look for bullet-point-like patterns
    const sentences = explanation.split('. ')

    return sentences.map((sentence, idx) => {
      // Check if this sentence contains bullet-point-like information
      if (sentence.includes('Use ') || sentence.includes('V1 ') || sentence.includes('V2 ') || sentence.includes('V3 ') || sentence.includes('Pattern:') || sentence.includes('Answer patterns:')) {
        return (
          <div key={idx} className="mb-2">
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5 text-xs">•</span>
              <span className="text-gray-800 leading-relaxed">
                {sentence.split(/(\*\*[^*]+\*\*|V1[\s-]*[^\s]*|V2[\s-]*[^\s]*|V3[\s-]*[^\s]*|BE verb|do\/does|does not|do not)/g).map((part, partIdx) => {
                  // Bold formatting for technical terms
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={partIdx} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>
                  }
                  // Bold formatting for verb forms
                  if (part.match(/^V1[\s-]*[^\s]*$|^V2[\s-]*[^\s]*$|^V3[\s-]*[^\s]*$/)) {
                    return <strong key={partIdx} className="font-bold text-purple-700">{part}</strong>
                  }
                  // Bold formatting for key grammar terms
                  if (part.match(/^(BE verb|do\/does|does not|do not)$/)) {
                    return <strong key={partIdx} className="font-bold text-emerald-700">{part}</strong>
                  }
                  return <span key={partIdx}>{part}</span>
                })}
                {idx < sentences.length - 1 && !sentence.endsWith('.') && '.'}
              </span>
            </div>
          </div>
        )
      } else {
        // Regular sentence formatting
        return (
          <p key={idx} className="text-gray-800 leading-relaxed mb-2">
            {sentence.split(/(\*\*[^*]+\*\*|V1[\s-]*[^\s]*|V2[\s-]*[^\s]*|V3[\s-]*[^\s]*|BE verb|do\/does|does not|do not)/g).map((part, partIdx) => {
              // Bold formatting
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={partIdx} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>
              }
              // Verb form highlighting
              if (part.match(/^V1[\s-]*[^\s]*$|^V2[\s-]*[^\s]*$|^V3[\s-]*[^\s]*$/)) {
                return <strong key={partIdx} className="font-bold text-purple-700">{part}</strong>
              }
              // Grammar term highlighting
              if (part.match(/^(BE verb|do\/does|does not|do not)$/)) {
                return <strong key={partIdx} className="font-bold text-emerald-700">{part}</strong>
              }
              return <span key={partIdx}>{part}</span>
            })}
            {idx < sentences.length - 1 && !sentence.endsWith('.') && '.'}
          </p>
        )
      }
    })
  }

  return (
    <div className={`rounded-xl border overflow-hidden transition-all duration-200 ${open ? 'bg-green-500/10 border-green-400/30' : 'bg-slate-800/40 border-slate-600/30'}`}>
      <button onClick={() => setOpen(!open)} className={`w-full p-3 flex items-center justify-between transition-colors ${open ? 'hover:bg-green-500/20' : 'hover:bg-slate-700/30'}`}>
        <div className="flex items-center gap-2">
          {headerIcon}
          <strong className="text-white text-base">{displayTitle}</strong>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-green-300" /> : <ChevronDown className="w-4 h-4 text-green-300" />}
      </button>
      {open && (
        <div className="p-4 space-y-4">
          {/* Pattern Section */}
          <div className={`${getSectionColors('pattern').bg} ${getSectionColors('pattern').border} border rounded-xl p-4 shadow-sm`}>
            <div className="flex items-center gap-2 mb-3">
              <Target className={`w-4 h-4 ${getSectionColors('pattern').icon}`} />
              <h3 className={`font-bold text-base ${getSectionColors('pattern').header}`}>
                Pattern
              </h3>
            </div>
            <div className="space-y-3">
              <div className="bg-white/70 rounded-lg p-4 border border-amber-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg">→</span>
                  {generatePatternBubbles()}
                </div>
              </div>
              {/* Show specific V1/V1-3rd patterns for Level 1 */}
              {grammarPattern.level_id === '1' && (
                <div className="space-y-2">
                  <div className="bg-blue-50/70 rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-sm font-medium text-blue-700">With I/you/we/they:</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg">→</span>
                      {createWordBubble('Subject', 'subject')}
                      <span className="text-gray-600">+</span>
                      {createWordBubble('V1', 'verb')}
                      <span className="text-gray-600">+</span>
                      {createWordBubble('Object', 'object')}
                    </div>
                    <div className="text-xs text-gray-600 mt-1 ml-6">V1 = base form (eat, play, drink)</div>
                  </div>
                  <div className="bg-purple-50/70 rounded-lg p-3 border border-purple-200">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-sm font-medium text-purple-700">With he/she/it:</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg">→</span>
                      {createWordBubble('Subject', 'subject')}
                      <span className="text-gray-600">+</span>
                      {createWordBubble('V1-3rd', 'verb')}
                      <span className="text-gray-600">+</span>
                      {createWordBubble('Object', 'object')}
                    </div>
                    <div className="text-xs text-gray-600 mt-1 ml-6">V1-3rd = base + s/es (eats, plays, drinks)</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Examples Section */}
          <div className={`${getSectionColors('examples').bg} ${getSectionColors('examples').border} border rounded-xl p-4 shadow-sm`}>
            <div className="flex items-center gap-2 mb-3">
              <Edit3 className={`w-4 h-4 ${getSectionColors('examples').icon}`} />
              <h3 className={`font-bold text-base ${getSectionColors('examples').header}`}>
                Examples
              </h3>
            </div>
            <div className="space-y-2">
              {[grammarPattern.example_1, grammarPattern.example_2, grammarPattern.example_3].filter(Boolean).map((example, idx) => (
                <div key={idx} className="bg-white/70 rounded-lg p-3 border border-purple-200">
                  <div className="flex items-center gap-2 flex-wrap">
                    {parseExampleSentence(example)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time Markers */}
          {grammarPattern.time_markers && (
            <div className={`${getSectionColors('time').bg} ${getSectionColors('time').border} border rounded-xl p-4 shadow-sm`}>
              <div className="flex items-center gap-2 mb-3">
                <Clock className={`w-4 h-4 ${getSectionColors('time').icon}`} />
                <h3 className={`font-bold text-base ${getSectionColors('time').header}`}>
                  Time Markers
                </h3>
              </div>
              <div className="bg-cyan-50/70 rounded-lg p-3 border border-cyan-200">
                <div className="flex items-center gap-2 flex-wrap">
                  {grammarPattern.time_markers.split(',').map((marker, idx) => (
                    <span key={idx}>
                      {createWordBubble(marker.trim(), 'time')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Usage Context Section */}
          {getUsageContext(grammarPattern.level_id) && (
            <div className={`${getSectionColors('explanation').bg} ${getSectionColors('explanation').border} border rounded-xl p-4 shadow-sm`}>
              <div className="flex items-center gap-2 mb-3">
                <Target className={`w-4 h-4 ${getSectionColors('explanation').icon}`} />
                <h3 className={`font-bold text-base ${getSectionColors('explanation').header}`}>
                  When to Use
                </h3>
              </div>
              <div className="bg-white/70 rounded-lg p-3 border border-emerald-200">
                <div className="text-gray-800 leading-relaxed text-sm space-y-3">
                  {getUsageContext(grammarPattern.level_id)}
                </div>
              </div>
            </div>
          )}

          {/* Explanation Section */}
          <div className={`${getSectionColors('explanation').bg} ${getSectionColors('explanation').border} border rounded-xl p-4 shadow-sm`}>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className={`w-4 h-4 ${getSectionColors('explanation').icon}`} />
              <h3 className={`font-bold text-base ${getSectionColors('explanation').header}`}>
                How to Use
              </h3>
            </div>
            <div className="bg-white/70 rounded-lg p-3 border border-emerald-200">
              <div className="text-gray-800 leading-relaxed text-sm">
                {formatDetailedExplanation(grammarPattern.explanation)}
              </div>
            </div>
          </div>

          {/* Common Errors Section */}
          {grammarPattern.spanish_error_pattern && grammarPattern.gentle_correction && (
            <div className={`${getSectionColors('spanish').bg} ${getSectionColors('spanish').border} border rounded-xl p-4 shadow-sm`}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className={`w-4 h-4 ${getSectionColors('spanish').icon}`} />
                <h3 className={`font-bold text-base ${getSectionColors('spanish').header}`}>
                  Common Errors
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-red-50/70 rounded-lg p-3 border border-red-200">
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">⚠️</span>
                    <span className="text-gray-800 italic">"{grammarPattern.spanish_error_pattern}"</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Important Notes */}
          {grammarPattern.memory_trick && (
            <div className={`${getSectionColors('memory').bg} ${getSectionColors('memory').border} border rounded-xl p-4 shadow-sm`}>
              <div className="flex items-center gap-2 mb-3">
                <Brain className={`w-4 h-4 ${getSectionColors('memory').icon}`} />
                <h3 className={`font-bold text-base ${getSectionColors('memory').header}`}>
                  Important Notes
                </h3>
              </div>
              <div className="bg-blue-50/70 rounded-lg p-3 border border-blue-200">
                <div className="flex items-start gap-2 mb-3">
                  <span className="text-blue-600 text-lg">🧠</span>
                  <span className="text-gray-800 font-medium">{grammarPattern.memory_trick}</span>
                </div>

                {/* Enhanced V1-3rd rules for Level 1 */}
                {grammarPattern.level_id === '1' && (
                  <div className="mt-4 space-y-3">
                    <div className="text-sm font-medium text-blue-700 mb-2">🔧 How to Add the Magic -s:</div>

                    <div className="grid gap-3">
                      {/* Rule 1: Regular -s */}
                      <div className="bg-white/60 rounded-lg p-3 border border-blue-200">
                        <div className="font-medium text-gray-800 mb-2">
                          <span className="text-blue-600">1.</span> Most verbs → Add <strong>-s</strong>
                        </div>
                        <div className="text-xs space-y-1">
                          <div>eat → eat<strong>s</strong>, play → play<strong>s</strong>, work → work<strong>s</strong></div>
                          <div>drink → drink<strong>s</strong>, read → read<strong>s</strong>, sleep → sleep<strong>s</strong></div>
                        </div>
                      </div>

                      {/* Rule 2: -es endings */}
                      <div className="bg-white/60 rounded-lg p-3 border border-blue-200">
                        <div className="font-medium text-gray-800 mb-2">
                          <span className="text-blue-600">2.</span> Verbs ending in <strong>-s, -sh, -ch, -x, -z</strong> → Add <strong>-es</strong>
                        </div>
                        <div className="text-xs space-y-1">
                          <div>pass → pass<strong>es</strong>, wash → wash<strong>es</strong>, watch → watch<strong>es</strong></div>
                          <div>fix → fix<strong>es</strong>, buzz → buzz<strong>es</strong></div>
                        </div>
                      </div>

                      {/* Rule 3: -ies endings */}
                      <div className="bg-white/60 rounded-lg p-3 border border-blue-200">
                        <div className="font-medium text-gray-800 mb-2">
                          <span className="text-blue-600">3.</span> Verbs ending in <strong>consonant + y</strong> → Change <strong>y to ies</strong>
                        </div>
                        <div className="text-xs space-y-1">
                          <div>study → stud<strong>ies</strong>, try → tr<strong>ies</strong>, carry → carr<strong>ies</strong></div>
                          <div>BUT: play → play<strong>s</strong> (vowel + y = just add -s)</div>
                        </div>
                      </div>

                      {/* Rule 4: Special cases */}
                      <div className="bg-yellow-50/80 rounded-lg p-3 border border-yellow-200">
                        <div className="font-medium text-gray-800 mb-2">
                          <span className="text-orange-600">4.</span> Special Cases (memorize these!)
                        </div>
                        <div className="text-xs space-y-1">
                          <div>have → <strong>has</strong>, do → <strong>does</strong>, go → <strong>goes</strong></div>
                          <div>be → <strong>is</strong> (completely different!)</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 p-2 bg-blue-100/60 rounded border border-blue-300">
                      <div className="text-xs text-blue-800">
                        <strong>🎯 Quick Test:</strong> Look at the last letter(s) → Apply the right rule!
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
