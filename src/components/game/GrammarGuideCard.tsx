"use client"

import { ChevronDown, ChevronUp } from 'lucide-react'
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
  return (
    <div className={`rounded-xl border overflow-hidden transition-all duration-200 ${open ? 'bg-green-500/10 border-green-400/30' : 'bg-slate-800/40 border-slate-600/30'}`}>
      <button onClick={() => setOpen(!open)} className={`w-full p-3 flex items-center justify-between transition-colors ${open ? 'hover:bg-green-500/20' : 'hover:bg-slate-700/30'}`}>
        <div className="flex items-center gap-1">
          {headerIcon}
          <strong className="text-white text-base">{title}</strong>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-green-300" /> : <ChevronDown className="w-4 h-4 text-green-300" />}
      </button>
      {open && (
        <div className="px-3 pb-3 -mt-2">
          <div className="bg-green-500/20 rounded-lg p-4 border border-green-400/40">
            <div className="space-y-3 text-sm text-green-50/90">
              {sections.map((s, i) => (
                <div key={i} className="bg-slate-900/30 rounded-lg p-4 border border-green-400/20">
                  <span className="block font-bold text-green-200 mb-3 text-base">{s.label}</span>
                  <div className="space-y-3">
                    {s.content.split('\n\n').map((paragraph, idx) => {
                      if (paragraph.startsWith('Examples:')) {
                        const examples = paragraph.replace('Examples: ', '').split(' / ')
                        return (
                          <div key={idx}>
                            <h4 className="font-semibold text-green-300 mb-2">Examples:</h4>
                            <div className="space-y-1">
                              {examples.map((example, exIdx) => (
                                <div key={exIdx} className="bg-green-500/10 rounded-md p-2 border border-green-400/20">
                                  <span className="font-mono text-green-100">{example.trim()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      } else {
                        return (
                          <p key={idx} className="leading-relaxed text-green-50/90">
                            {paragraph}
                          </p>
                        )
                      }
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
