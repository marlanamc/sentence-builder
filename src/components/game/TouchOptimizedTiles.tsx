'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Volume2,
  VolumeX,
  Lightbulb,
  Star
} from 'lucide-react'

interface TouchOptimizedTileProps {
  word: string
  category: string
  isSelected: boolean
  isCorrect: boolean
  isIncorrect: boolean
  onSelect: () => void
  onRemove: () => void
  onToggle: () => void
  features?: Record<string, string>
  showHint?: boolean
  soundEnabled?: boolean
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}

export function TouchOptimizedTile({
  word,
  category,
  isSelected,
  isCorrect,
  isIncorrect,
  onSelect,
  onRemove,
  onToggle,
  features = {},
  showHint = false,
  soundEnabled = true,
  size = 'medium',
  disabled = false
}: TouchOptimizedTileProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [hapticFeedback, setHapticFeedback] = useState(false)

  // Haptic feedback for mobile devices
  useEffect(() => {
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50) // Short vibration
    }
  }, [hapticFeedback])

  // Sound effects
  const playSound = (type: 'select' | 'remove' | 'correct' | 'incorrect') => {
    if (!soundEnabled) return
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    const frequencies = {
      select: [800],
      remove: [400],
      correct: [523, 659, 784], // C-E-G chord
      incorrect: [200, 150] // Low descending
    }
    
    const freq = frequencies[type]
    oscillator.frequency.setValueAtTime(freq[0], audioContext.currentTime)
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.2)
  }

  const handlePress = () => {
    if (disabled) return
    
    setIsPressed(true)
    setHapticFeedback(true)
    
    if (isSelected) {
      playSound('remove')
      onRemove()
    } else {
      playSound('select')
      onSelect()
    }
    
    // Reset pressed state
    setTimeout(() => {
      setIsPressed(false)
      setHapticFeedback(false)
    }, 150)
  }

  const handleLongPress = () => {
    if (disabled) return
    
    // Long press for toggle functionality
    if (features.base && features.third) {
      playSound('select')
      onToggle()
    }
  }

  // Size classes
  const sizeClasses = {
    small: 'h-12 px-3 text-sm',
    medium: 'h-16 px-4 text-base',
    large: 'h-20 px-6 text-lg'
  }

  // State classes
  const getStateClasses = () => {
    if (disabled) return 'opacity-50 cursor-not-allowed'
    if (isPressed) return 'scale-95'
    if (isCorrect) return 'bg-green-500 text-white border-green-600'
    if (isIncorrect) return 'bg-red-500 text-white border-red-600'
    if (isSelected) return 'bg-blue-500 text-white border-blue-600'
    return 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
  }

  return (
    <div className="relative">
      <Button
        className={`
          ${sizeClasses[size]}
          ${getStateClasses()}
          transition-all duration-150 ease-in-out
          touch-manipulation
          select-none
          active:scale-95
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          border-2 rounded-xl font-medium
          flex items-center justify-center space-x-2
          min-w-[80px]
          ${isPressed ? 'shadow-inner' : 'shadow-md hover:shadow-lg'}
        `}
        onTouchStart={handlePress}
        onTouchEnd={(e) => e.preventDefault()}
        onMouseDown={handlePress}
        onMouseUp={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
        disabled={disabled}
        onLongPress={handleLongPress}
      >
        {/* Word text */}
        <span className="truncate max-w-full">
          {word}
        </span>
        
        {/* Toggle indicator */}
        {features.base && features.third && (
          <div className="flex items-center space-x-1">
            <span className="text-xs opacity-70">↔</span>
          </div>
        )}
        
        {/* Selected indicator */}
        {isSelected && (
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
        )}
        
        {/* Remove button for selected tiles */}
        {isSelected && (
          <Button
            size="sm"
            variant="ghost"
            className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full bg-red-500 text-white hover:bg-red-600"
            onClick={(e) => {
              e.stopPropagation()
              playSound('remove')
              onRemove()
            }}
          >
            <XCircle className="w-4 h-4" />
          </Button>
        )}
      </Button>
      
      {/* Hint indicator */}
      {showHint && (
        <div className="absolute -top-1 -right-1">
          <Badge variant="secondary" className="bg-yellow-500 text-white text-xs">
            <Lightbulb className="w-3 h-3" />
          </Badge>
        </div>
      )}
      
      {/* Category indicator */}
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
        <Badge 
          variant="outline" 
          className="text-xs bg-white/90 text-gray-600 border-gray-300"
        >
          {category}
        </Badge>
      </div>
      
      {/* Feedback animation */}
      {showFeedback && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`
            animate-ping w-8 h-8 rounded-full
            ${isCorrect ? 'bg-green-500' : 'bg-red-500'}
          `} />
        </div>
      )}
    </div>
  )
}

// Enhanced sentence building area
interface TouchOptimizedSentenceAreaProps {
  selectedTiles: Array<{ word: string; category: string; originalWord: string }>
  onRemoveTile: (index: number) => void
  onClearAll: () => void
  onCheckSentence: () => void
  isChecking: boolean
  feedback: string
  showFeedback: boolean
  soundEnabled?: boolean
}

export function TouchOptimizedSentenceArea({
  selectedTiles,
  onRemoveTile,
  onClearAll,
  onCheckSentence,
  isChecking,
  feedback,
  showFeedback,
  soundEnabled = true
}: TouchOptimizedSentenceAreaProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const playSound = (type: 'check' | 'clear' | 'remove') => {
    if (!soundEnabled) return
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    const frequencies = {
      check: [523, 659, 784], // C-E-G chord
      clear: [400, 300], // Descending
      remove: [600, 400] // Quick descending
    }
    
    const freq = frequencies[type]
    oscillator.frequency.setValueAtTime(freq[0], audioContext.currentTime)
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-gray-200 min-h-[120px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Your Sentence</h3>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              playSound('clear')
              onClearAll()
            }}
            disabled={selectedTiles.length === 0}
            className="text-red-600 hover:text-red-700"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>
      </div>
      
      {/* Sentence area */}
      <div className="min-h-[60px] p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        {selectedTiles.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p className="text-center">Tap words to build your sentence</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 items-center">
            {selectedTiles.map((tile, index) => (
              <TouchOptimizedTile
                key={index}
                word={tile.word}
                category={tile.category}
                isSelected={true}
                isCorrect={false}
                isIncorrect={false}
                onSelect={() => {}}
                onRemove={() => {
                  playSound('remove')
                  onRemoveTile(index)
                }}
                onToggle={() => {}}
                size="small"
                soundEnabled={soundEnabled}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Check button */}
      <div className="mt-4 flex justify-center">
        <Button
          size="lg"
          onClick={() => {
            playSound('check')
            onCheckSentence()
          }}
          disabled={selectedTiles.length === 0 || isChecking}
          className="w-full max-w-xs bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg"
        >
          {isChecking ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              <span>Checking...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Check Sentence</span>
            </div>
          )}
        </Button>
      </div>
      
      {/* Feedback */}
      {showFeedback && feedback && (
        <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-blue-800 text-center font-medium">{feedback}</p>
        </div>
      )}
    </div>
  )
}
