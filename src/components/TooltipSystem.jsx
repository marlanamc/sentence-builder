import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  HelpCircle, 
  BookOpen, 
  Users, 
  Zap, 
  Hash, 
  Palette, 
  MapPin, 
  MessageCircle,
  Clock,
  Star,
  Volume2
} from 'lucide-react'

// Comprehensive grammar explanations database
export const grammarExplanations = {
  // Parts of Speech
  subjects: {
    title: "Subjects",
    icon: Users,
    shortDesc: "Who or what does the action",
    longDesc: "The subject is the person, place, or thing that performs the action in a sentence. It usually comes at the beginning.",
    examples: [
      "She eats pizza (She = subject)",
      "The cat sleeps (The cat = subject)", 
      "My friends play soccer (My friends = subject)"
    ],
    tips: [
      "Subjects can be pronouns (I, you, he, she, we, they)",
      "Subjects can be nouns (cat, teacher, students)",
      "Subjects can be noun phrases (my sister, the tall boy)"
    ],
    commonErrors: [
      "Don't forget the subject! ❌ 'Eats pizza' ✅ 'She eats pizza'",
      "Use correct pronoun case: ❌ 'Me like pizza' ✅ 'I like pizza'"
    ]
  },

  verbs: {
    title: "Verbs",
    icon: Zap,
    shortDesc: "Action or state words",
    longDesc: "Verbs show actions (run, eat, play) or states (be, have, seem). They change form based on who does the action and when.",
    examples: [
      "I eat / She eats (present)",
      "I ate / She ate (past)",
      "I am eating / She is eating (continuous)"
    ],
    tips: [
      "V1 = base form (eat, play, go)",
      "V1-3rd = add -s/-es with he/she/it (eats, plays, goes)",
      "V2 = past form (ate, played, went)",
      "V1-ing = continuous form (eating, playing, going)",
      "V3 = past participle (eaten, played, gone)"
    ],
    commonErrors: [
      "❌ 'She eat pizza' ✅ 'She eats pizza' (need V1-3rd with she)",
      "❌ 'I goed' ✅ 'I went' (irregular past form)",
      "❌ 'She is eat' ✅ 'She is eating' (need V1-ing after 'is')"
    ]
  },

  objects: {
    title: "Objects",
    icon: Hash,
    shortDesc: "What receives the action",
    longDesc: "Objects are the people or things that receive the action of the verb. They usually come after the verb.",
    examples: [
      "She eats pizza (pizza = object)",
      "I read books (books = object)",
      "They watch movies (movies = object)"
    ],
    tips: [
      "Objects can be singular (book) or plural (books)",
      "Some objects are countable (apples, cars)",
      "Some objects are uncountable (water, music, homework)",
      "Click objects to toggle singular/plural forms"
    ],
    commonErrors: [
      "Count vs. non-count: ❌ 'I drink waters' ✅ 'I drink water'",
      "Article usage: ❌ 'I eat apple' ✅ 'I eat an apple' or 'I eat apples'"
    ]
  },

  articles: {
    title: "Articles",
    icon: Palette,
    shortDesc: "a, an, the - go before nouns",
    longDesc: "Articles are small words that go before nouns. They help specify whether we're talking about something specific or general.",
    examples: [
      "a pizza (any pizza, starts with consonant sound)",
      "an apple (any apple, starts with vowel sound)",
      "the pizza (specific pizza we both know about)"
    ],
    tips: [
      "Use 'a' before consonant sounds (a book, a university)",
      "Use 'an' before vowel sounds (an apple, an hour)",
      "Use 'the' for specific things (the book on my desk)",
      "No article with plural or uncountable nouns (books, water)"
    ],
    commonErrors: [
      "❌ 'I eat apple' ✅ 'I eat an apple' (need article with singular countable)",
      "❌ 'I like the music' ✅ 'I like music' (no 'the' with general uncountable)",
      "❌ 'a hour' ✅ 'an hour' (hour starts with vowel sound)"
    ]
  },

  adjectives: {
    title: "Adjectives",
    icon: Star,
    shortDesc: "Describe nouns (big, red, happy)",
    longDesc: "Adjectives describe or give more information about nouns. In English, they usually come before the noun.",
    examples: [
      "a big pizza (big describes pizza)",
      "red apples (red describes apples)",
      "happy students (happy describes students)"
    ],
    tips: [
      "Adjectives go before nouns in English",
      "Multiple adjectives: opinion + size + color + noun (beautiful big red car)",
      "Adjectives don't change for plural (red car / red cars)",
      "Some adjectives can be comparative (bigger, happier)"
    ],
    commonErrors: [
      "❌ 'a pizza big' ✅ 'a big pizza' (adjective before noun)",
      "❌ 'reds apples' ✅ 'red apples' (adjectives don't add -s)"
    ]
  },

  adverbs: {
    title: "Adverbs",
    icon: Clock,
    shortDesc: "Describe verbs (always, quickly, well)",
    longDesc: "Adverbs give more information about verbs, adjectives, or other adverbs. They often tell us how, when, where, or how often.",
    examples: [
      "She always eats pizza (how often)",
      "He runs quickly (how)",
      "They arrived yesterday (when)"
    ],
    tips: [
      "Frequency adverbs go before the main verb (always, usually, often)",
      "Manner adverbs often end in -ly (quickly, carefully)",
      "Time adverbs can go at the beginning or end (Yesterday, I went...)",
      "Place adverbs usually go at the end (She lives here)"
    ],
    commonErrors: [
      "❌ 'She eats always pizza' ✅ 'She always eats pizza' (frequency before verb)",
      "❌ 'He runs quick' ✅ 'He runs quickly' (use adverb form)"
    ]
  },

  prepositions: {
    title: "Prepositions",
    icon: MapPin,
    shortDesc: "Show relationships (at, in, on, with)",
    longDesc: "Prepositions show relationships between words, often indicating location, time, or manner.",
    examples: [
      "at school (location)",
      "in the morning (time)",
      "with friends (accompaniment)",
      "by car (method)"
    ],
    tips: [
      "Time: at (specific time), in (months/years), on (days/dates)",
      "Place: at (specific point), in (enclosed space), on (surface)",
      "Common combinations: listen to, look at, think about",
      "Prepositions often come at the end of questions (What are you looking at?)"
    ],
    commonErrors: [
      "❌ 'in Monday' ✅ 'on Monday' (use 'on' with days)",
      "❌ 'at the morning' ✅ 'in the morning' (use 'in' with parts of day)",
      "❌ 'depend of' ✅ 'depend on' (correct preposition combination)"
    ]
  },

  helpers: {
    title: "Helper Verbs",
    icon: HelpCircle,
    shortDesc: "Help main verbs (do, be, have, will)",
    longDesc: "Helper verbs (auxiliary verbs) work with main verbs to form different tenses, questions, and negatives.",
    examples: [
      "do/does (present questions/negatives): Do you like pizza?",
      "did (past questions/negatives): Did she eat?",
      "am/is/are (continuous): She is eating",
      "will (future): I will go"
    ],
    tips: [
      "Use 'do' with I/you/we/they, 'does' with he/she/it",
      "Use 'did' for all subjects in past",
      "Use 'am' with I, 'is' with he/she/it, 'are' with you/we/they",
      "After helper verbs, use the base form (V1) of the main verb"
    ],
    commonErrors: [
      "❌ 'Does she eats?' ✅ 'Does she eat?' (V1 after does)",
      "❌ 'She don't like' ✅ 'She doesn't like' (doesn't with she)",
      "❌ 'I am go' ✅ 'I am going' (V1-ing after am)"
    ]
  },

  questionWords: {
    title: "Question Words",
    icon: MessageCircle,
    shortDesc: "Start questions (what, who, where, when)",
    longDesc: "Question words (wh-words) are used to ask for specific information. Each one asks about different things.",
    examples: [
      "What do you eat? (asks about things)",
      "Who is your teacher? (asks about people)",
      "Where do you live? (asks about places)",
      "When do you study? (asks about time)"
    ],
    tips: [
      "What = things or actions",
      "Who = people",
      "Where = places",
      "When = time",
      "Why = reasons",
      "How = manner or method",
      "Which = choice between options"
    ],
    commonErrors: [
      "❌ 'What you eat?' ✅ 'What do you eat?' (need helper verb)",
      "❌ 'Where you go?' ✅ 'Where do you go?' (need helper verb)",
      "❌ 'Who do you are?' ✅ 'Who are you?' (no 'do' with 'be' verb)"
    ]
  },

  negatives: {
    title: "Negatives",
    icon: HelpCircle,
    shortDesc: "Make sentences negative (not, don't, doesn't)",
    longDesc: "Negative words make sentences negative. The most common is 'not', often combined with helper verbs.",
    examples: [
      "I do not eat pizza (full form)",
      "I don't eat pizza (contraction)",
      "She does not like music (full form)",
      "She doesn't like music (contraction)"
    ],
    tips: [
      "Use 'do not' (don't) with I/you/we/they",
      "Use 'does not' (doesn't) with he/she/it",
      "Use 'did not' (didn't) for past with all subjects",
      "Contractions are common in speaking: don't, doesn't, didn't"
    ],
    commonErrors: [
      "❌ 'I no like pizza' ✅ 'I don't like pizza' (use don't, not 'no')",
      "❌ 'She don't like' ✅ 'She doesn't like' (doesn't with she)",
      "❌ 'I didn't went' ✅ 'I didn't go' (V1 after didn't)"
    ]
  }
}

// Tooltip component
export function GrammarTooltip({ category, children, position = "top" }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  const explanation = grammarExplanations[category]
  if (!explanation) return children

  const Icon = explanation.icon

  const showTooltip = () => {
    setIsVisible(true)
    // Check if mobile
    setIsMobile(window.innerWidth < 768)
  }

  const hideTooltip = () => {
    setIsVisible(false)
  }

  const handleMobileTouch = (e) => {
    e.preventDefault()
    if (isMobile) {
      setIsVisible(!isVisible)
    }
  }

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onTouchStart={handleMobileTouch}
        className="cursor-help"
      >
        {children}
      </div>
      
      {isVisible && (
        <div className={`absolute z-50 w-80 max-w-sm ${
          position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
        } left-1/2 transform -translate-x-1/2`}>
          <Card className="shadow-xl border-2 bg-white">
            <CardContent className="p-4">
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-blue-800">{explanation.title}</h3>
                <Badge variant="secondary" className="text-xs">Grammar</Badge>
              </div>
              
              {/* Short Description */}
              <p className="text-sm text-gray-700 mb-3 font-medium">
                {explanation.shortDesc}
              </p>
              
              {/* Long Description */}
              <p className="text-xs text-gray-600 mb-3">
                {explanation.longDesc}
              </p>
              
              {/* Examples */}
              <div className="mb-3">
                <h4 className="text-xs font-semibold text-green-700 mb-1 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  Examples:
                </h4>
                <ul className="text-xs text-green-600 space-y-1">
                  {explanation.examples.slice(0, 2).map((example, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Tips */}
              {explanation.tips && (
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Key Tips:
                  </h4>
                  <ul className="text-xs text-blue-600 space-y-1">
                    {explanation.tips.slice(0, 2).map((tip, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Common Errors */}
              {explanation.commonErrors && (
                <div>
                  <h4 className="text-xs font-semibold text-red-700 mb-1 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" />
                    Avoid These Mistakes:
                  </h4>
                  <ul className="text-xs text-red-600 space-y-1">
                    {explanation.commonErrors.slice(0, 1).map((error, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Mobile close hint */}
              {isMobile && (
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    Tap anywhere to close
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Arrow */}
          <div className={`absolute left-1/2 transform -translate-x-1/2 ${
            position === 'top' ? 'top-full' : 'bottom-full'
          }`}>
            <div className={`w-0 h-0 ${
              position === 'top' 
                ? 'border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-300' 
                : 'border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-300'
            }`}></div>
          </div>
        </div>
      )}
      
      {/* Mobile overlay to close tooltip */}
      {isVisible && isMobile && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-20"
          onClick={() => setIsVisible(false)}
        />
      )}
    </div>
  )
}

// Quick help button for categories
export function CategoryHelpButton({ category, className = "" }) {
  const explanation = grammarExplanations[category]
  if (!explanation) return null

  return (
    <GrammarTooltip category={category}>
      <Button
        variant="ghost"
        size="sm"
        className={`w-4 h-4 p-0 text-gray-400 hover:text-gray-600 ${className}`}
      >
        <HelpCircle className="w-3 h-3" />
      </Button>
    </GrammarTooltip>
  )
}

// Enhanced word button with tooltip
export function WordButtonWithTooltip({ word, category, onClick, className, children }) {
  return (
    <GrammarTooltip category={category}>
      <Button
        variant="outline"
        size="sm"
        onClick={onClick}
        className={className}
        title={`${word} (${category})`}
      >
        {children || word}
      </Button>
    </GrammarTooltip>
  )
}

// Grammar term tooltip for inline text
export function GrammarTerm({ term, category, children }) {
  return (
    <GrammarTooltip category={category}>
      <span className="underline decoration-dotted decoration-blue-400 cursor-help text-blue-700">
        {children || term}
      </span>
    </GrammarTooltip>
  )
}

// Audio pronunciation helper (for future enhancement)
export function PronunciationHelper({ word, className = "" }) {
  const playPronunciation = () => {
    // Future: integrate with text-to-speech API
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.rate = 0.8
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={playPronunciation}
      className={`w-4 h-4 p-0 text-gray-400 hover:text-blue-600 ${className}`}
      title={`Pronounce "${word}"`}
    >
      <Volume2 className="w-3 h-3" />
    </Button>
  )
}

