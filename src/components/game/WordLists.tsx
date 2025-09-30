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
        const categoryColor = categoryName === 'subjects' ? 'from-sky-200/60 to-sky-300/60' :
                              categoryName === 'verbs' ? 'from-purple-200/60 to-purple-300/60' :
                              categoryName === 'articles' ? 'from-pink-200/60 to-pink-300/60' :
                              categoryName === 'objects' ? 'from-orange-200/60 to-orange-300/60' :
                              categoryName === 'helpers' ? 'from-violet-200/60 to-violet-300/60' :
                              categoryName === 'negatives' ? 'from-red-200/60 to-red-300/60' :
                              'from-gray-200/60 to-gray-300/60'
        return (
          <div key={categoryName} className="bg-slate-800/95 backdrop-blur-sm shadow-xl border border-slate-600/40 rounded-xl overflow-hidden hover:border-slate-500/60 transition-all duration-200">
            <div className={`bg-gradient-to-r ${categoryColor} px-4 py-3 border-b border-slate-700/30`}>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-base">{getCategoryIcon(categoryName)}</span>
                <h3 className="text-sm font-semibold capitalize text-gray-900 tracking-wide">{categoryName.replace('-', ' ')}</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-2.5">
                {categoryWords.map((wordObj, idx) => (
                  <Button key={`${wordObj.word}-${idx}`} variant="outline" onClick={() => onTileClick(wordObj.word, wordObj.category)} className={`word-tile ${getCategoryColor(wordObj.category)} transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] rounded-lg px-3 py-2.5 font-medium text-sm min-h-[44px] touch-manipulation w-full text-left justify-start border-slate-600/30 hover:border-slate-500/50`}>
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{getChallengeWordDisplay(wordObj)}</span>
                      {wordObj.toggleable && <span className="text-xs opacity-60 font-bold">↔</span>}
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
    <div className="flex flex-wrap gap-2 justify-center">
      {words.map((wordObj, index) => {
        const isToggled = isWordToggled(wordObj)
        return (
          <Button
            key={`${wordObj.word}-${index}`}
            variant="outline"
            onClick={() => onTileClick(wordObj.word, wordObj.category)}
            className={`
              word-tile ${getCategoryColor(wordObj.category)}
              transition-all duration-200 shadow-sm hover:shadow-md
              transform hover:scale-105 rounded-full px-3 py-2
              font-medium text-sm min-h-[40px] touch-manipulation
              ${learningMode === 'shuffled' && wordObj.category === 'verb' ? 'ring-2 ring-purple-400/50' : ''}
              ${isToggled ? 'bg-purple-500/20 border-purple-400/50' : ''}
            `}
          >
            <span className={`relative ${isToggled ? 'font-bold' : ''}`}>
              {getChallengeWordDisplay(wordObj)}
            </span>
            {wordObj.toggleable && learningMode === 'shuffled' && (
              <span className={`ml-1 text-xs ${isToggled ? 'opacity-100 text-purple-300' : 'opacity-70'} transition-opacity`}>
                ↔
              </span>
            )}
          </Button>
        )
      })}
    </div>
  )
}


