"use client"

import { Button } from '@/components/ui/button'

type WordObj = { word: string; category: string; toggleable?: boolean; baseForm?: string; thirdPersonForm?: string; v2?: string; v3?: string; ving?: string }

type CategorizedProps = {
  categoriesToShow: string[]
  wordCategories: Record<string, WordObj[]>
  getCategoryIcon: (name: string) => React.ReactNode
  getCategoryColor: (category: string) => string
  getChallengeWordDisplay: (w: WordObj) => string
  onTileClick: (word: string, category: string) => void
  limitWordsPerCategory?: number
  levelId?: number
}

export function WordCategoryList({ categoriesToShow, wordCategories, getCategoryIcon, getCategoryColor, getChallengeWordDisplay, onTileClick, limitWordsPerCategory, levelId }: CategorizedProps) {
  return (
    <div className="space-y-4 pt-2">
      {categoriesToShow.map((categoryName) => {
        let allCategoryWords = (wordCategories[categoryName] || []) as WordObj[]
        
        // Level-specific filtering is now handled in the main level page
        
        const categoryWords = limitWordsPerCategory 
          ? allCategoryWords.slice(0, limitWordsPerCategory)
          : allCategoryWords
        if (categoryWords.length === 0) return null
        // Color-coded system for visual learning with bubbles
        const categoryColor = categoryName === 'subjects' ? 'from-blue-400/90 to-blue-500/90' :
                              categoryName === 'verbs' ? 'from-purple-400/90 to-purple-500/90' :
                              categoryName === 'objects' ? 'from-green-400/90 to-green-500/90' :
                              categoryName === 'articles' ? 'from-pink-400/90 to-pink-500/90' :
                              categoryName === 'helpers' ? 'from-orange-400/90 to-orange-500/90' :
                              categoryName === 'negatives' ? 'from-red-400/90 to-red-500/90' :
                              categoryName === 'question-words' ? 'from-yellow-400/90 to-yellow-500/90' :
                              categoryName === 'time-expressions' ? 'from-teal-400/90 to-teal-500/90' :
                              categoryName === 'complements' ? 'from-indigo-400/90 to-indigo-500/90' :
                              'from-gray-400/90 to-gray-500/90'
        return (
          <div key={categoryName} className="relative bg-slate-800/95 backdrop-blur-sm shadow-xl border border-slate-600/40 rounded-2xl overflow-hidden hover:border-slate-500/60 transition-all duration-300 hover:shadow-2xl">
            {/* Bubble effect background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full animate-pulse delay-100"></div>
              <div className="absolute bottom-3 left-6 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-200"></div>
              <div className="absolute bottom-2 right-2 w-2.5 h-2.5 bg-white rounded-full animate-pulse delay-300"></div>
            </div>
            
            <div className={`bg-gradient-to-r ${categoryColor} px-4 py-3 border-b border-slate-700/30 relative z-10`}>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg drop-shadow-sm">{getCategoryIcon(categoryName)}</span>
                <h3 className="text-sm font-bold capitalize text-white tracking-wide drop-shadow-sm">{categoryName.replace('-', ' ')}</h3>
              </div>
            </div>
            
            <div className="p-4 relative z-10">
              <div className="grid grid-cols-2 gap-3">
                {categoryWords.map((wordObj, idx) => (
                  <Button 
                    key={`${wordObj.word}-${idx}`} 
                    variant="outline" 
                    onClick={() => onTileClick(wordObj.word, wordObj.category)} 
                    className={`word-tile ${getCategoryColor(wordObj.category)} transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 rounded-xl px-4 py-3 font-bold text-sm min-h-[48px] touch-manipulation w-full text-left justify-start border-2 border-white/20 hover:border-white/40 relative overflow-hidden group`}
                  >
                    {/* Bubble effect on hover */}
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    
                    <div className="flex items-center justify-between w-full relative z-10">
                      <span className="font-bold text-white drop-shadow-sm">{getChallengeWordDisplay(wordObj)}</span>
                      {wordObj.toggleable && <span className="text-xs opacity-80 font-bold text-white">↔</span>}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

type ShuffledProps = {
  words: WordObj[]
  learningMode: 'categorized' | 'shuffled'
  isWordToggled: (w: WordObj) => boolean
  getCategoryColor: (category: string) => string
  getChallengeWordDisplay: (w: WordObj) => string
  onTileClick: (word: string, category: string) => void
}

export function ShuffledWordGrid({ words, learningMode, isWordToggled, getCategoryColor, getChallengeWordDisplay, onTileClick }: ShuffledProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center p-4">
      {words.map((wordObj, index) => {
        const isToggled = isWordToggled(wordObj)
        return (
          <Button
            key={`${wordObj.word}-${index}`}
            variant="outline"
            onClick={() => onTileClick(wordObj.word, wordObj.category)}
            className={`
              word-tile ${getCategoryColor(wordObj.category)}
              transition-all duration-300 shadow-lg hover:shadow-xl
              transform hover:scale-110 active:scale-95 rounded-2xl px-4 py-3
              font-bold text-sm min-h-[48px] touch-manipulation
              border-2 border-white/20 hover:border-white/40
              relative overflow-hidden group
              ${learningMode === 'shuffled' && wordObj.category === 'verb' ? 'ring-2 ring-purple-400/70' : ''}
              ${isToggled ? 'bg-purple-500/30 border-purple-400/70' : ''}
            `}
          >
            {/* Bubble effect on hover */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            
            <span className={`relative z-10 text-white drop-shadow-sm ${isToggled ? 'font-bold' : ''}`}>
              {getChallengeWordDisplay(wordObj)}
            </span>
            {wordObj.toggleable && learningMode === 'shuffled' && (
              <span className={`ml-1 text-xs text-white ${isToggled ? 'opacity-100' : 'opacity-80'} transition-opacity relative z-10`}>
                ↔
              </span>
            )}
          </Button>
        )
      })}
    </div>
  )
}


