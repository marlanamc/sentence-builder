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
          <div className="bg-green-500/20 rounded-lg p-3 border border-green-400/40">
            <div className="space-y-3">
              {sections.map((s, i) => (
                <div key={i} className="bg-slate-900/40 rounded-lg p-3 border border-green-400/20">
                  <h3 className="font-bold text-green-200 mb-2 text-sm flex items-center">
                    {s.label}
                  </h3>
                  <div className="text-xs text-green-50/90">
                    {s.content.startsWith('Examples:') ? (
                      <div>
                        <div className="grid gap-2">
                          {s.content.replace('Examples: ', '').split(' / ').map((example, exIdx) => (
                            <div key={exIdx} className="bg-green-500/15 rounded-md p-2 border border-green-400/30">
                              <span className="font-mono text-green-100 text-sm">{example.trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : s.label.includes('Pattern') ? (
                      <div className="bg-blue-500/15 rounded-md p-3 border border-blue-400/30">
                        <span className="font-mono text-blue-100 text-sm font-bold">{s.content}</span>
                      </div>
                    ) : (
                      <div className="bg-slate-800/50 rounded-md p-3 border border-slate-600/30">
                        <p className="leading-relaxed text-slate-100 text-xs">{s.content}</p>
                      </div>
                    )}
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
