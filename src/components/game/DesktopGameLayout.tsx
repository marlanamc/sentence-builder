'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle, 
  Bookmark, 
  Trash2, 
  Target,
  HelpCircle,
  Volume2,
  VolumeX,
  Lightbulb,
  Star,
  Trophy,
  Clock,
  Settings,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react'

interface DesktopGameLayoutProps {
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
  onNextLevel?: () => void
  onPreviousLevel?: () => void
  progress?: number
  streak?: number
  totalPoints?: number
}

export function DesktopGameLayout({
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
  onShowHelp,
  onNextLevel,
  onPreviousLevel,
  progress = 0,
  streak = 0,
  totalPoints = 0
}: DesktopGameLayoutProps) {
  const [activeCategory, setActiveCategory] = useState<string>('subjects')
  const [showGrammarGuide, setShowGrammarGuide] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showHints, setShowHints] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Timer effect
  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setTimeSpent(prev => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isPaused])

  // Auto-save progress every 30 seconds
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (selectedTiles.length > 0) {
        onSaveSentence()
      }
    }, 30000)
    return () => clearInterval(autoSave)
  }, [selectedTiles, onSaveSentence])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const categories = Object.keys(wordTiles)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Levels</span>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Level {level?.id}</h1>
                <p className="text-gray-600">{level?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Progress Stats */}
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-blue-600">{progress}%</div>
                  <div className="text-gray-500">Progress</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-600">{streak}</div>
                  <div className="text-gray-500">Streak</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-purple-600">{totalPoints}</div>
                  <div className="text-gray-500">Points</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-orange-600">{formatTime(timeSpent)}</div>
                  <div className="text-gray-500">Time</div>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsPaused(!isPaused)}
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </Button>
                <Button size="sm" variant="ghost" onClick={onShowHelp}>
                  <HelpCircle className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowGrammarGuide(!showGrammarGuide)}>
                  <BookOpen className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Left Sidebar - Grammar Guide */}
          {showGrammarGuide && (
            <div className="col-span-3">
              <Card className="h-full p-4 bg-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Grammar Guide</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowGrammarGuide(false)}
                  >
                    ×
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Pattern:</h4>
                    <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded">
                      {level?.pattern}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Formula:</h4>
                    <p className="text-sm text-gray-700 bg-green-50 p-2 rounded">
                      {level?.formula}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Example:</h4>
                    <p className="text-sm text-gray-700 bg-yellow-50 p-2 rounded font-mono">
                      {level?.example}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Explanation:</h4>
                    <p className="text-sm text-gray-700">
                      {level?.explanation}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Required Categories:</h4>
                    <div className="flex flex-wrap gap-1">
                      {level?.requiredCategories?.map((cat: string) => (
                        <Badge key={cat} variant="secondary" className="text-xs">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Main Game Area */}
          <div className={showGrammarGuide ? "col-span-6" : "col-span-9"}>
            <div className="h-full flex flex-col space-y-4">
              {/* Sentence Building Area */}
              <Card className="flex-1 p-6 bg-white shadow-lg">
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Build Your Sentence</h2>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={onClearSentence}
                        disabled={selectedTiles.length === 0}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Clear
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowHints(!showHints)}
                      >
                        <Lightbulb className="w-4 h-4 mr-1" />
                        Hints
                      </Button>
                    </div>
                  </div>
                  
                  {/* Selected Tiles */}
                  <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4 min-h-[120px]">
                    {selectedTiles.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <Target className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          <p className="text-lg">Click words to build your sentence</p>
                          <p className="text-sm">Use the word tiles below</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 items-center">
                        {selectedTiles.map((tile, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-2 px-3 py-2 text-base cursor-pointer hover:bg-blue-100"
                            onClick={() => onTileRemove(index)}
                          >
                            {tile.word}
                            <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Feedback */}
                  {showFeedback && (
                    <div className={`p-4 rounded-lg mb-4 text-center text-lg font-semibold ${
                      feedback.includes('Excellent') || feedback.includes('Correct') 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {feedback}
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={onCheckSentence}
                      disabled={selectedTiles.length === 0 || isEvaluating}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                    >
                      {isEvaluating ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                          <span>Checking...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5" />
                          <span>Check Sentence</span>
                        </div>
                      )}
                    </Button>
                    
                    <Button
                      onClick={onSaveSentence}
                      disabled={selectedTiles.length === 0}
                      variant="outline"
                      className="px-8 py-3 text-lg"
                    >
                      <Bookmark className="w-5 h-5 mr-2" />
                      Save Progress
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Sidebar - Word Tiles */}
          <div className="col-span-3">
            <Card className="h-full p-4 bg-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Word Tiles</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant={learningMode === 'categorized' ? 'default' : 'outline'}
                    onClick={() => onModeChange('categorized')}
                  >
                    Categories
                  </Button>
                  <Button
                    size="sm"
                    variant={learningMode === 'shuffled' ? 'default' : 'outline'}
                    onClick={() => onModeChange('shuffled')}
                  >
                    Shuffled
                  </Button>
                </div>
              </div>
              
              <Tabs value={activeCategory} onValueChange={setActiveCategory} className="h-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  {categories.slice(0, 2).map((category) => (
                    <TabsTrigger key={category} value={category} className="text-xs">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <div className="space-y-4 overflow-y-auto max-h-[calc(100%-100px)]">
                  {categories.map((category) => (
                    <TabsContent key={category} value={category} className="mt-0">
                      <div className="grid grid-cols-1 gap-2">
                        {wordTiles[category]?.map((tile, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="justify-start text-left h-auto p-3 hover:bg-blue-50"
                            onClick={() => onTileSelect({
                              word: tile.text?.en || tile.word,
                              category: tile.category || category,
                              originalWord: tile.text?.en || tile.word
                            })}
                          >
                            <div>
                              <div className="font-medium">
                                {tile.text?.en || tile.word}
                              </div>
                              {tile.features && Object.keys(tile.features).length > 0 && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {Object.entries(tile.features).map(([key, value]) => (
                                    <span key={key} className="mr-2">
                                      {key}: {value}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </Button>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
