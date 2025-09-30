'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePersistentState } from './usePersistentState'

interface StudentProgress {
  currentLevel: number
  completedLevels: number[]
  totalPoints: number
  streak: number
  bestStreak: number
  totalTimeSpent: number
  accuracy: number
  levelsAttempted: number
  levelsCompleted: number
  lastPlayed: Date
  achievements: string[]
  preferences: {
    soundEnabled: boolean
    musicEnabled: boolean
    showHints: boolean
    autoSave: boolean
    difficulty: 'easy' | 'medium' | 'hard'
  }
}

interface LevelAttempt {
  levelId: number
  attempts: number
  timeSpent: number
  hintsUsed: number
  completed: boolean
  score: number
  timestamp: Date
}

export function useStudentProgress() {
  const [progress, setProgress] = usePersistentState<StudentProgress>('student-progress', {
    currentLevel: 1,
    completedLevels: [],
    totalPoints: 0,
    streak: 0,
    bestStreak: 0,
    totalTimeSpent: 0,
    accuracy: 0,
    levelsAttempted: 0,
    levelsCompleted: 0,
    lastPlayed: new Date(),
    achievements: [],
    preferences: {
      soundEnabled: true,
      musicEnabled: true,
      showHints: true,
      autoSave: true,
      difficulty: 'medium'
    }
  })

  const [levelAttempts, setLevelAttempts] = usePersistentState<LevelAttempt[]>('level-attempts', [])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate derived stats
  const stats = {
    completionRate: progress.levelsCompleted / Math.max(progress.levelsAttempted, 1) * 100,
    averageScore: progress.totalPoints / Math.max(progress.levelsCompleted, 1),
    timePerLevel: progress.totalTimeSpent / Math.max(progress.levelsCompleted, 1),
    currentStreak: progress.streak,
    bestStreak: progress.bestStreak,
    totalLevels: 47, // Total levels in the game
    progressPercentage: (progress.completedLevels.length / 47) * 100
  }

  // Update progress when level is completed
  const completeLevel = useCallback((levelId: number, score: number, timeSpent: number, hintsUsed: number = 0) => {
    setProgress(prev => {
      const newProgress = { ...prev }
      
      // Add to completed levels if not already there
      if (!newProgress.completedLevels.includes(levelId)) {
        newProgress.completedLevels.push(levelId)
        newProgress.levelsCompleted++
      }
      
      // Update points and streak
      newProgress.totalPoints += score
      newProgress.streak++
      newProgress.bestStreak = Math.max(newProgress.bestStreak, newProgress.streak)
      
      // Update time spent
      newProgress.totalTimeSpent += timeSpent
      
      // Update accuracy
      const totalAttempts = newProgress.levelsAttempted
      const correctAttempts = newProgress.levelsCompleted
      newProgress.accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0
      
      // Update last played
      newProgress.lastPlayed = new Date()
      
      // Check for achievements
      checkAchievements(newProgress)
      
      return newProgress
    })

    // Record level attempt
    const attempt: LevelAttempt = {
      levelId,
      attempts: 1,
      timeSpent,
      hintsUsed,
      completed: true,
      score,
      timestamp: new Date()
    }
    
    setLevelAttempts(prev => {
      const existing = prev.find(a => a.levelId === levelId)
      if (existing) {
        return prev.map(a => 
          a.levelId === levelId 
            ? { ...a, attempts: a.attempts + 1, timeSpent: a.timeSpent + timeSpent, completed: true, score: Math.max(a.score, score) }
            : a
        )
      }
      return [...prev, attempt]
    })
  }, [setProgress, setLevelAttempts])

  // Record failed attempt
  const recordAttempt = useCallback((levelId: number, timeSpent: number, hintsUsed: number = 0) => {
    setProgress(prev => ({
      ...prev,
      levelsAttempted: prev.levelsAttempted + 1,
      streak: 0, // Reset streak on failure
      lastPlayed: new Date()
    }))

    setLevelAttempts(prev => {
      const existing = prev.find(a => a.levelId === levelId)
      if (existing) {
        return prev.map(a => 
          a.levelId === levelId 
            ? { ...a, attempts: a.attempts + 1, timeSpent: a.timeSpent + timeSpent, hintsUsed: a.hintsUsed + hintsUsed }
            : a
        )
      }
      return [...prev, {
        levelId,
        attempts: 1,
        timeSpent,
        hintsUsed,
        completed: false,
        score: 0,
        timestamp: new Date()
      }]
    })
  }, [setProgress, setLevelAttempts])

  // Update preferences
  const updatePreferences = useCallback((newPreferences: Partial<StudentProgress['preferences']>) => {
    setProgress(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...newPreferences }
    }))
  }, [setProgress])

  // Check for achievements
  const checkAchievements = (progress: StudentProgress) => {
    const newAchievements: string[] = []
    
    // Streak achievements
    if (progress.streak === 5 && !progress.achievements.includes('streak-5')) {
      newAchievements.push('streak-5')
    }
    if (progress.streak === 10 && !progress.achievements.includes('streak-10')) {
      newAchievements.push('streak-10')
    }
    if (progress.streak === 25 && !progress.achievements.includes('streak-25')) {
      newAchievements.push('streak-25')
    }
    
    // Level completion achievements
    if (progress.completedLevels.length === 10 && !progress.achievements.includes('levels-10')) {
      newAchievements.push('levels-10')
    }
    if (progress.completedLevels.length === 25 && !progress.achievements.includes('levels-25')) {
      newAchievements.push('levels-25')
    }
    if (progress.completedLevels.length === 47 && !progress.achievements.includes('levels-all')) {
      newAchievements.push('levels-all')
    }
    
    // Points achievements
    if (progress.totalPoints >= 1000 && !progress.achievements.includes('points-1000')) {
      newAchievements.push('points-1000')
    }
    if (progress.totalPoints >= 5000 && !progress.achievements.includes('points-5000')) {
      newAchievements.push('points-5000')
    }
    
    // Accuracy achievements
    if (progress.accuracy >= 90 && !progress.achievements.includes('accuracy-90')) {
      newAchievements.push('accuracy-90')
    }
    
    if (newAchievements.length > 0) {
      setProgress(prev => ({
        ...prev,
        achievements: [...prev.achievements, ...newAchievements]
      }))
    }
  }

  // Get level statistics
  const getLevelStats = useCallback((levelId: number) => {
    const attempt = levelAttempts.find(a => a.levelId === levelId)
    return {
      attempts: attempt?.attempts || 0,
      timeSpent: attempt?.timeSpent || 0,
      hintsUsed: attempt?.hintsUsed || 0,
      completed: attempt?.completed || false,
      bestScore: attempt?.score || 0
    }
  }, [levelAttempts])

  // Reset progress
  const resetProgress = useCallback(() => {
    setProgress({
      currentLevel: 1,
      completedLevels: [],
      totalPoints: 0,
      streak: 0,
      bestStreak: 0,
      totalTimeSpent: 0,
      accuracy: 0,
      levelsAttempted: 0,
      levelsCompleted: 0,
      lastPlayed: new Date(),
      achievements: [],
      preferences: {
        soundEnabled: true,
        musicEnabled: true,
        showHints: true,
        autoSave: true,
        difficulty: 'medium'
      }
    })
    setLevelAttempts([])
  }, [setProgress, setLevelAttempts])

  // Save to Supabase (when connection is available)
  const saveToSupabase = useCallback(async () => {
    if (isLoading) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      // TODO: Implement Supabase save when connection is working
      console.log('Saving progress to Supabase:', progress)
    } catch (err) {
      setError('Failed to save progress')
      console.error('Error saving progress:', err)
    } finally {
      setIsLoading(false)
    }
  }, [progress, isLoading])

  // Load from Supabase (when connection is available)
  const loadFromSupabase = useCallback(async () => {
    if (isLoading) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      // TODO: Implement Supabase load when connection is working
      console.log('Loading progress from Supabase')
    } catch (err) {
      setError('Failed to load progress')
      console.error('Error loading progress:', err)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  return {
    progress,
    stats,
    levelAttempts,
    isLoading,
    error,
    completeLevel,
    recordAttempt,
    updatePreferences,
    getLevelStats,
    resetProgress,
    saveToSupabase,
    loadFromSupabase
  }
}
