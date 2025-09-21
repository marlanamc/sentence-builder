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
                  <div className="space-y-2">
                    <div className="text-lg font-mono text-gray-800 bg-white/70 rounded-lg p-3 border border-amber-200">
                      → {section.content.replace(/.*→\s*/, '')}
                    </div>
                    <div className="space-y-1 text-gray-700 text-sm">
                      <div className="flex items-center gap-2">
                        <span>→</span>
                        <span>With 'he/she/it': Verb + -s/-es</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>→</span>
                        <span>With 'I/you/we/they': Verb in base form</span>
                      </div>
                    </div>
                  </div>
                ) : section.label.includes('Examples') ? (
                  <div className="space-y-2">
                    {section.content.replace('Examples: ', '').split(' / ').map((example, exIdx) => (
                      <div key={exIdx} className="text-lg font-medium text-gray-800 bg-white/70 rounded-lg p-3 border border-purple-200">
                        {example.trim()}
                      </div>
                    ))}
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
