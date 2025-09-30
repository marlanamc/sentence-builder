'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle, 
  Bookmark, 
  Trash2, 
  ChevronDown,
  ChevronUp,
  Target,
  HelpCircle,
  Volume2,
  VolumeX,
  Lightbulb,
  Star,
  Trophy,
  Clock,
  XCircle,
  BookOpen,
  Settings
} from 'lucide-react'

interface MobileGameLayoutProps {
  level: any
  selectedTiles: Array<{ word: string; category: string; originalWord: string }>
  onTileSelect: (tile: { word: string; category: string; originalWord: string }) => void
  onTileRemove: (index: number) => void
  onCheckSentence: () => void
  onSaveSentence: () => void
  onClearSentence: () => void
  feedback: string
  showFeedback: boolean
  isEvaluating: boolean
  categorizedCorrect: number
  learningMode: 'categorized' | 'shuffled'
  onModeChange: (mode: 'categorized' | 'shuffled') => void
  wordTiles: Record<string, any[]>
  onBack: () => void
  onShowHelp: () => void
}

export function MobileGameLayout({
  level,
  selectedTiles,
  onTileSelect,
  onTileRemove,
  onCheckSentence,
  onSaveSentence,
  onClearSentence,
  feedback,
  showFeedback,
  isEvaluating,
  categorizedCorrect,
  learningMode,
  onModeChange,
  wordTiles,
  onBack,
  onShowHelp
}: MobileGameLayoutProps) {
  const [activeCategory, setActiveCategory] = useState<string>('subjects')
  const [showWordTiles, setShowWordTiles] = useState(true)

  // wordTiles is already grouped by category (wordCategories structure)
  const tilesByCategory = wordTiles

  const categories = [
    { id: 'subjects', name: 'Subjects', icon: '🙂', color: 'bg-blue-500' },
    { id: 'verbs', name: 'Verbs', icon: '⚡', color: 'bg-green-500' },
    { id: 'objects', name: 'Objects', icon: '📘', color: 'bg-purple-500' },
    { id: 'other', name: 'Other', icon: '🔧', color: 'bg-gray-500' }
  ]

  const formatSentence = () => {
    if (selectedTiles.length === 0) return 'Tap tiles below to form a sentence...'
    return selectedTiles.map(tile => tile.word).join(' ') + '.'
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Mobile Header */}
      <div className="flex-shrink-0 bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">Level {level.id}</h1>
              <p className="text-sm text-slate-400">{level.name}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowHelp}
            className="p-2 text-slate-300 hover:text-white"
          >
            <HelpCircle className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Progress */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-300">{categorizedCorrect} / 5 correct</span>
          <div className="flex items-center space-x-2">
            <div className="w-24 h-1 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                style={{ width: `${(categorizedCorrect / 5) * 100}%` }}
              />
            </div>
            <span className="text-slate-300">{Math.round((categorizedCorrect / 5) * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Sentence Building Area - Fixed at top */}
      <div className="flex-shrink-0 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4">
        <div className="space-y-3">
          {/* Current Sentence */}
          <div className="min-h-[60px] bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
            <div className="flex flex-wrap items-center gap-2 min-h-[32px]">
              {selectedTiles.length === 0 ? (
                <span className="text-slate-400 text-sm">✨ {formatSentence()}</span>
              ) : (
                selectedTiles.map((tile, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-1 bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{tile.word}</span>
                    <button
                      onClick={() => onTileRemove(index)}
                      className="text-blue-300 hover:text-blue-100 ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              onClick={onCheckSentence}
              disabled={selectedTiles.length === 0 || isEvaluating}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Check
            </Button>
            <Button
              onClick={onSaveSentence}
              disabled={selectedTiles.length === 0}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Bookmark className="w-4 h-4" />
            </Button>
            <Button
              onClick={onClearSentence}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Feedback Area */}
      {showFeedback && (
        <div className="flex-shrink-0 bg-green-500/10 border-b border-green-500/20 p-4">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-200">
              <p className="font-medium">Excellent work!</p>
              <p className="text-green-300/80 mt-1">{feedback}</p>
            </div>
          </div>
        </div>
      )}

      {/* Word Tiles Area - Scrollable */}
      <div className="flex-1 overflow-hidden">
        {/* Category Tabs */}
        <div className="flex-shrink-0 bg-slate-800/30 backdrop-blur-sm border-b border-slate-700">
          <div className="flex overflow-x-auto px-4 py-2 space-x-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? `${category.color} text-white`
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {tilesByCategory[category.id]?.length || 0}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Word Tiles Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Category Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {categories.find(c => c.id === activeCategory)?.icon} {categories.find(c => c.id === activeCategory)?.name}
              </h3>
              <span className="text-sm text-slate-400">
                {tilesByCategory[activeCategory]?.length || 0} words
              </span>
            </div>

            {/* Tiles Grid */}
            <div className="grid grid-cols-2 gap-3">
              {tilesByCategory[activeCategory]?.map((tile, index) => (
                <button
                  key={index}
                  onClick={() => onTileSelect({
                    word: tile.word || '',
                    category: tile.category || activeCategory,
                    originalWord: tile.word || ''
                  })}
                  className="p-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl border border-slate-600/30 text-left transition-all active:scale-95"
                >
                  <div className="text-white font-medium text-sm">
                    {tile.word}
                  </div>
                  {tile.baseForm && tile.thirdPersonForm && (
                    <div className="text-xs text-slate-400 mt-1">
                      {tile.baseForm} / {tile.thirdPersonForm}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Empty State */}
            {(!tilesByCategory[activeCategory] || tilesByCategory[activeCategory].length === 0) && (
              <div className="text-center py-8">
                <div className="text-slate-400 text-sm">No words available in this category</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
