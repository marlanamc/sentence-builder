"use client"

import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { usePersistentState } from '@/hooks/usePersistentState'

type Props = {
  title?: string
  pill: React.ReactNode
  toast?: string
  openDefault?: boolean
  persistKey?: string
  info: { what: string; why: string }
  visual: React.ReactNode
}

export function PatternCard({ title = 'Pattern', pill, toast, openDefault = false, persistKey, info, visual }: Props) {
  const [open, setOpen] = persistKey ? usePersistentState<boolean>(persistKey, openDefault) : useState(openDefault)
  return (
    <div className={`rounded-xl border overflow-hidden transition-all duration-200 ${open ? 'bg-blue-500/10 border-blue-400/30' : 'bg-slate-800/40 border-slate-600/30'}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full p-3 flex items-center justify-between transition-colors ${open ? 'hover:bg-blue-500/20' : 'hover:bg-slate-700/30'}`}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">📝</span>
          <strong className="text-white text-base">{title}</strong>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-blue-300" />
        ) : (
          <ChevronDown className="w-4 h-4 text-blue-300" />
        )}
      </button>
      {open && (
        <div className="px-3 pb-3 -mt-2">
          <div className="bg-blue-500/20 rounded-lg p-3 border border-blue-400/40">
            <div className="flex items-center gap-2">
              {pill}
              {toast && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-white/90 border border-white/10">{toast}</span>
              )}
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 text-[11px] text-blue-50/90">
              <div className="bg-slate-900/20 rounded-md p-2 border border-blue-400/20">
                <span className="block font-semibold text-blue-200 mb-1">What is it?</span>
                <p className="leading-snug">{info.what}</p>
              </div>
              <div className="bg-slate-900/20 rounded-md p-2 border border-blue-400/20">
                <span className="block font-semibold text-blue-200 mb-1">Why use it?</span>
                <p className="leading-snug">{info.why}</p>
              </div>
              {visual}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


