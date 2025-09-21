"use client"

import { ChevronDown, ChevronUp, Target, Edit3, Lightbulb } from 'lucide-react'
import { usePersistentState } from '@/hooks/usePersistentState'

type Section = { label: string; content: string }

type Props = {
  title?: string
  persistKey: string
  headerIcon?: React.ReactNode
  sections: Section[]
}

export function GrammarGuideCard({ title = 'Quick Grammar Guide', persistKey, headerIcon = <span className="text-base">💡</span>, sections }: Props) {
  const [open, setOpen] = usePersistentState<boolean>(persistKey, false)

  const getSectionIcon = (label: string) => {
    if (label.includes('Pattern')) return <Target className="w-4 h-4" />
    if (label.includes('Examples')) return <Edit3 className="w-4 h-4" />
    if (label.includes('How to Use')) return <Lightbulb className="w-4 h-4" />
    return <span>💡</span>
  }

  const getSectionColors = (label: string) => {
    if (label.includes('Pattern')) return {
      bg: 'bg-amber-50/95',
      border: 'border-amber-200/60',
      text: 'text-gray-800',
      header: 'text-gray-900',
      icon: 'text-red-500'
    }
    if (label.includes('Examples')) return {
      bg: 'bg-purple-100/95',
      border: 'border-purple-200/60',
      text: 'text-gray-800',
      header: 'text-gray-900',
      icon: 'text-purple-600'
    }
    if (label.includes('How to Use')) return {
      bg: 'bg-emerald-100/95',
      border: 'border-emerald-200/60',
      text: 'text-gray-800',
      header: 'text-gray-900',
      icon: 'text-emerald-600'
    }
    return {
      bg: 'bg-slate-100/95',
      border: 'border-slate-200/60',
      text: 'text-gray-800',
      header: 'text-gray-900',
      icon: 'text-gray-600'
    }
  }

  // Create colored word bubbles that match the toolbox
  const createWordBubble = (word: string, type: 'subject' | 'verb' | 'object' | 'article' | 'auxiliary' | 'negation' | 'question' | 'time' | 'preposition' | 'adverb') => {
    const colorMap = {
      subject: 'bg-sky-200/90 border-sky-300/60 text-gray-900',
      verb: 'bg-purple-200/90 border-purple-300/60 text-gray-900',
      object: 'bg-orange-200/90 border-orange-300/60 text-gray-900',
      article: 'bg-pink-200/90 border-pink-300/60 text-gray-900',
      auxiliary: 'bg-violet-200/90 border-violet-300/60 text-gray-900',
      negation: 'bg-red-200/90 border-red-300/60 text-gray-900',
      question: 'bg-emerald-200/90 border-emerald-300/60 text-gray-900',
      time: 'bg-sky-200/90 border-sky-300/60 text-gray-900',
      preposition: 'bg-cyan-200/90 border-cyan-300/60 text-gray-900',
      adverb: 'bg-amber-200/90 border-amber-300/60 text-gray-900'
    }

    return (
      <span className={`inline-block px-3 py-1.5 rounded-lg text-sm font-medium border shadow-sm ${colorMap[type]}`}>
        {word}
      </span>
    )
  }

  return (
    <div className={`rounded-xl border overflow-hidden transition-all duration-200 ${open ? 'bg-green-500/10 border-green-400/30' : 'bg-slate-800/40 border-slate-600/30'}`}>
      <button onClick={() => setOpen(!open)} className={`w-full p-3 flex items-center justify-between transition-colors ${open ? 'hover:bg-green-500/20' : 'hover:bg-slate-700/30'}`}>
        <div className="flex items-center gap-2">
          {headerIcon}
          <strong className="text-white text-base">{title}</strong>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-green-300" /> : <ChevronDown className="w-4 h-4 text-green-300" />}
      </button>
      {open && (
        <div className="p-4 space-y-3">
          {sections.map((section, i) => {
            const colors = getSectionColors(section.label)
            const icon = getSectionIcon(section.label)

            return (
              <div key={i} className={`${colors.bg} ${colors.border} border rounded-xl p-4 shadow-sm`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={colors.icon}>{icon}</span>
                  <h3 className={`font-bold text-lg ${colors.header}`}>
                    {section.label.replace('🎯 ', '').replace('📝 ', '').replace('💡 ', '')}
                  </h3>
                </div>

                {section.label.includes('Pattern') ? (
                  <div className="space-y-3">
                    <div className="bg-white/70 rounded-lg p-4 border border-amber-200">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg">→</span>
                        {createWordBubble('Subject', 'subject')}
                        <span className="text-gray-600">+</span>
                        {createWordBubble('Verb', 'verb')}
                        <span className="text-gray-600">+</span>
                        {createWordBubble('Object', 'object')}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="bg-white/50 rounded-lg p-3 border border-amber-100">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span>→</span>
                          <span className="font-medium text-gray-700">With 'he/she/it':</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {createWordBubble('She', 'subject')}
                          <span className="text-gray-600">+</span>
                          {createWordBubble('eats', 'verb')}
                          <span className="text-gray-600">+</span>
                          {createWordBubble('pizza', 'object')}
                        </div>
                      </div>
                      <div className="bg-white/50 rounded-lg p-3 border border-amber-100">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span>→</span>
                          <span className="font-medium text-gray-700">With 'I/you/we/they':</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {createWordBubble('I', 'subject')}
                          <span className="text-gray-600">+</span>
                          {createWordBubble('eat', 'verb')}
                          <span className="text-gray-600">+</span>
                          {createWordBubble('pizza', 'object')}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : section.label.includes('Examples') ? (
                  <div className="space-y-2">
                    {section.content.replace('Examples: ', '').split(' / ').map((example, exIdx) => {
                      // Parse example sentences and create colored bubbles
                      const words = example.trim().split(' ')
                      return (
                        <div key={exIdx} className="bg-white/70 rounded-lg p-3 border border-purple-200">
                          <div className="flex items-center gap-2 flex-wrap">
                            {words.map((word, wordIdx) => {
                              // Basic word type detection for common patterns
                              const cleanWord = word.replace(/[.,!?]/, '')
                              let type: 'subject' | 'verb' | 'object' | 'article' | 'auxiliary' | 'negation' | 'question' | 'time' | 'preposition' | 'adverb' = 'object'

                              if (['I', 'you', 'we', 'they', 'he', 'she', 'it', 'They', 'She', 'He'].includes(cleanWord)) type = 'subject'
                              else if (['eat', 'eats', 'play', 'plays', 'drink', 'drinks', 'like', 'likes', 'study', 'studies'].includes(cleanWord)) type = 'verb'
                              else if (['a', 'an', 'the'].includes(cleanWord)) type = 'article'
                              else if (['am', 'is', 'are', 'have', 'has', 'do', 'does'].includes(cleanWord)) type = 'auxiliary'
                              else if (['not', "don't", "doesn't", "haven't", "hasn't"].includes(cleanWord)) type = 'negation'
                              else if (['what', 'where', 'when', 'who', 'how'].includes(cleanWord.toLowerCase())) type = 'question'
                              else if (['today', 'yesterday', 'tomorrow', 'now', 'always', 'never', 'often'].includes(cleanWord.toLowerCase())) type = 'time'
                              else if (['with', 'for', 'at', 'in', 'on', 'by'].includes(cleanWord.toLowerCase())) type = 'preposition'

                              return (
                                <span key={wordIdx}>
                                  {createWordBubble(word, type)}
                                </span>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {section.content.split('•').filter(Boolean).map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold mt-0.5">•</span>
                        <span className="text-gray-800 leading-relaxed">{point.trim()}</span>
                      </div>
                    ))}
                    {!section.content.includes('•') && (
                      <div className="text-gray-800 leading-relaxed bg-white/70 rounded-lg p-3 border border-emerald-200">
                        {section.content}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
