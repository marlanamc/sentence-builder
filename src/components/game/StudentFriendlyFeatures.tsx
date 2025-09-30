'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  HelpCircle, 
  Star, 
  Trophy,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  Lightbulb,
  BookOpen,
  Settings
} from 'lucide-react'

interface StudentFriendlyFeaturesProps {
  onToggleSound: () => void
  onShowHint: () => void
  onResetLevel: () => void
  onShowHelp: () => void
  soundEnabled: boolean
  showHint: boolean
  level: any
  progress: number
  streak: number
  totalPoints: number
}

export function StudentFriendlyFeatures({
  onToggleSound,
  onShowHint,
  onResetLevel,
  onShowHelp,
  soundEnabled,
  showHint,
  level,
  progress,
  streak,
  totalPoints
}: StudentFriendlyFeaturesProps) {
  const [showCelebration, setShowCelebration] = useState(false)
  const [lastAchievement, setLastAchievement] = useState<string | null>(null)

  // Auto-celebration for achievements
  useEffect(() => {
    if (streak > 0 && streak % 5 === 0) {
      setLastAchievement(`${streak} in a row! 🔥`)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [streak])

  return (
    <>
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-8 text-center animate-bounce">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Amazing!</h2>
            <p className="text-lg text-gray-600">{lastAchievement}</p>
          </div>
        </div>
      )}

      {/* Student-Friendly Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6" />
            <h1 className="text-xl font-bold">Level {level?.id}</h1>
            <Badge variant="secondary" className="bg-white/20 text-white">
              {level?.name}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={onToggleSound}
              className="text-white hover:bg-white/20"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onShowHelp}
              className="text-white hover:bg-white/20"
            >
              <HelpCircle className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/20 rounded-lg p-2">
            <div className="flex items-center justify-center space-x-1">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">Progress</span>
            </div>
            <div className="text-lg font-bold">{progress}%</div>
          </div>
          <div className="bg-white/20 rounded-lg p-2">
            <div className="flex items-center justify-center space-x-1">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Streak</span>
            </div>
            <div className="text-lg font-bold">{streak}</div>
          </div>
          <div className="bg-white/20 rounded-lg p-2">
            <div className="flex items-center justify-center space-x-1">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-medium">Points</span>
            </div>
            <div className="text-lg font-bold">{totalPoints}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center space-x-2 p-4 bg-gray-50">
        <Button
          size="sm"
          variant="outline"
          onClick={onShowHint}
          className="flex items-center space-x-1"
        >
          <Lightbulb className="w-4 h-4" />
          <span>Hint</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onResetLevel}
          className="flex items-center space-x-1"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </Button>
      </div>

      {/* Level Instructions */}
      <Card className="m-4 p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-500 rounded-full p-1">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Your Goal:</h3>
            <p className="text-blue-800 text-sm">{level?.explanation}</p>
            <div className="mt-2 text-xs text-blue-600">
              <strong>Example:</strong> {level?.example}
            </div>
          </div>
        </div>
      </Card>
    </>
  )
}

// Sound Effects Component
export function SoundEffects() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)

  useEffect(() => {
    // Initialize audio context for sound effects
    const context = new (window.AudioContext || (window as any).webkitAudioContext)()
    setAudioContext(context)
  }, [])

  const playSound = (type: 'success' | 'error' | 'click' | 'celebration') => {
    if (!audioContext) return

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Different frequencies for different sounds
    const frequencies = {
      success: [523, 659, 784], // C-E-G chord
      error: [200, 150], // Low descending
      click: [800], // High click
      celebration: [523, 659, 784, 1047] // C-E-G-C chord
    }

    const freq = frequencies[type]
    let currentFreq = 0

    const playNote = (frequency: number, startTime: number, duration: number) => {
      oscillator.frequency.setValueAtTime(frequency, startTime)
      gainNode.gain.setValueAtTime(0.1, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)
    }

    freq.forEach((frequency, index) => {
      playNote(frequency, audioContext.currentTime + index * 0.1, 0.2)
    })

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + freq.length * 0.1 + 0.2)
  }

  return { playSound }
}

// Accessibility Features
export function AccessibilityFeatures() {
  const [highContrast, setHighContrast] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Apply accessibility settings
    document.documentElement.style.setProperty('--contrast', highContrast ? 'high' : 'normal')
    document.documentElement.style.setProperty('--text-size', largeText ? 'large' : 'normal')
    document.documentElement.style.setProperty('--motion', reducedMotion ? 'reduced' : 'normal')
  }, [highContrast, largeText, reducedMotion])

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Button
        size="sm"
        variant="outline"
        onClick={() => setHighContrast(!highContrast)}
        className="mb-2 block"
      >
        {highContrast ? 'Normal Contrast' : 'High Contrast'}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setLargeText(!largeText)}
        className="mb-2 block"
      >
        {largeText ? 'Normal Text' : 'Large Text'}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setReducedMotion(!reducedMotion)}
        className="block"
      >
        {reducedMotion ? 'Normal Motion' : 'Reduced Motion'}
      </Button>
    </div>
  )
}
