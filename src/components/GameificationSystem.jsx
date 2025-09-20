import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Trophy, Star, Zap, Target, Award, TrendingUp } from 'lucide-react'
import { achievementSystem, pointsSystem } from '../data/verbDatabase.js'

export function GamificationSystem({ 
  userStats, 
  onStatsUpdate, 
  currentLevel, 
  onLevelSelect,
  showLevelSelector = false 
}) {
  const [showAchievements, setShowAchievements] = useState(false)
  const [recentAchievement, setRecentAchievement] = useState(null)

  // Calculate user level based on points
  const getUserLevel = (points) => {
    return achievementSystem.levels.find(level => 
      points >= level.minPoints && points <= level.maxPoints
    ) || achievementSystem.levels[0]
  }

  // Check for new achievements
  const checkAchievements = (stats) => {
    const newAchievements = []
    
    achievementSystem.badges.forEach(badge => {
      if (!stats.unlockedBadges.includes(badge.id)) {
        let unlocked = false
        
        switch (badge.requirement) {
          case 'complete_1_sentence':
            unlocked = stats.totalSentences >= 1
            break
          case 'streak_10':
            unlocked = stats.currentStreak >= 10
            break
          case 'build_50_questions':
            unlocked = stats.questionsBuilt >= 50
            break
          case 'try_5_levels':
            unlocked = stats.levelsAttempted.length >= 5
            break
          case 'build_100_sentences':
            unlocked = stats.totalSentences >= 100
            break
          case 'perfect_20':
            unlocked = stats.perfectSentences >= 20
            break
          case 'daily_streak_7':
            unlocked = stats.dailyStreak >= 7
            break
          case 'master_beginner_verbs':
            unlocked = stats.verbsMastered.beginner >= 15
            break
        }
        
        if (unlocked) {
          newAchievements.push(badge)
        }
      }
    })
    
    if (newAchievements.length > 0) {
      setRecentAchievement(newAchievements[0])
      setTimeout(() => setRecentAchievement(null), 3000)
    }
    
    return newAchievements
  }

  // Award points for various actions
  const awardPoints = (action, extraData = {}) => {
    let points = 0
    const newStats = { ...userStats }
    
    switch (action) {
      case 'correct_sentence':
        points = pointsSystem.correct_sentence
        if (extraData.firstTry) points += pointsSystem.first_try
        if (extraData.perfectGrammar) points += pointsSystem.perfect_grammar
        
        newStats.totalSentences += 1
        newStats.currentStreak += 1
        newStats.bestStreak = Math.max(newStats.bestStreak, newStats.currentStreak)
        
        if (extraData.perfectGrammar) newStats.perfectSentences += 1
        if (extraData.isQuestion) newStats.questionsBuilt += 1
        
        // Streak bonus
        if (newStats.currentStreak > 1) {
          points += pointsSystem.streak_bonus * newStats.currentStreak
        }
        break
        
      case 'wrong_sentence':
        newStats.currentStreak = 0
        break
        
      case 'new_verb_used':
        points = pointsSystem.new_verb_used
        break
        
      case 'level_attempted':
        if (!newStats.levelsAttempted.includes(extraData.levelId)) {
          newStats.levelsAttempted.push(extraData.levelId)
        }
        break
        
      case 'daily_practice':
        points = pointsSystem.daily_practice
        newStats.dailyStreak += 1
        break
    }
    
    newStats.totalPoints += points
    
    // Check for new achievements
    const newAchievements = checkAchievements(newStats)
    newStats.unlockedBadges.push(...newAchievements.map(a => a.id))
    
    onStatsUpdate(newStats)
    return points
  }

  const userLevel = getUserLevel(userStats.totalPoints)
  const nextLevel = achievementSystem.levels.find(level => level.minPoints > userStats.totalPoints)
  const progressToNext = nextLevel 
    ? ((userStats.totalPoints - userLevel.minPoints) / (nextLevel.minPoints - userLevel.minPoints)) * 100
    : 100

  return (
    <div className="space-y-4">
      {/* Achievement Popup */}
      {recentAchievement && (
        <div className="fixed top-4 right-4 z-50 animate-bounce">
          <Card className="bg-yellow-100 border-yellow-400">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{recentAchievement.icon}</span>
                <div>
                  <div className="font-bold text-yellow-800">Achievement Unlocked!</div>
                  <div className="text-sm text-yellow-700">{recentAchievement.name}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* User Stats Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold"
                   style={{ backgroundColor: userLevel.color }}>
                {userLevel.id}
              </div>
              <div>
                <div className="font-bold text-lg">{userLevel.name}</div>
                <div className="text-sm text-gray-600">{userStats.totalPoints} points</div>
              </div>
            </div>
            
            <div className="flex gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{userStats.currentStreak}</div>
                <div className="text-xs text-gray-500">Streak</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{userStats.totalSentences}</div>
                <div className="text-xs text-gray-500">Sentences</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{userStats.unlockedBadges.length}</div>
                <div className="text-xs text-gray-500">Badges</div>
              </div>
            </div>
          </div>
          
          {/* Progress to next level */}
          {nextLevel && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Progress to {nextLevel.name}</span>
                <span>{nextLevel.minPoints - userStats.totalPoints} points to go</span>
              </div>
              <Progress value={progressToNext} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Level Selector */}
      {showLevelSelector && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Quick Practice - Jump to Any Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {[
                { id: 1, name: 'Basic Sentences', icon: '📝', color: 'bg-green-100 text-green-800' },
                { id: 2, name: 'Negatives', icon: '❌', color: 'bg-red-100 text-red-800' },
                { id: 3, name: 'Yes/No Questions', icon: '❓', color: 'bg-blue-100 text-blue-800' },
                { id: 4, name: 'Wh-Questions', icon: '🤔', color: 'bg-purple-100 text-purple-800' },
                { id: 5, name: 'Articles', icon: '📰', color: 'bg-yellow-100 text-yellow-800' },
                { id: 6, name: 'Adjectives', icon: '🎨', color: 'bg-pink-100 text-pink-800' },
                { id: 7, name: 'Past Tense', icon: '⏰', color: 'bg-indigo-100 text-indigo-800' },
                { id: 8, name: 'Future Tense', icon: '🚀', color: 'bg-cyan-100 text-cyan-800' }
              ].map((level) => (
                <Button
                  key={level.id}
                  variant={currentLevel === level.id ? "default" : "outline"}
                  onClick={() => {
                    onLevelSelect(level.id)
                    awardPoints('level_attempted', { levelId: level.id })
                  }}
                  className={`h-auto p-3 flex flex-col items-center gap-1 ${level.color}`}
                >
                  <span className="text-lg">{level.icon}</span>
                  <span className="text-xs font-medium">{level.name}</span>
                  <Badge variant="secondary" className="text-xs">Level {level.id}</Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievements Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Achievements
            </span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowAchievements(!showAchievements)}
            >
              {showAchievements ? 'Hide' : 'Show All'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
            {achievementSystem.badges.slice(0, showAchievements ? undefined : 8).map((badge) => {
              const isUnlocked = userStats.unlockedBadges.includes(badge.id)
              return (
                <div
                  key={badge.id}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    isUnlocked 
                      ? 'bg-yellow-50 border-yellow-300 shadow-sm' 
                      : 'bg-gray-50 border-gray-200 opacity-50'
                  }`}
                  title={badge.description}
                >
                  <div className="text-2xl mb-1">{badge.icon}</div>
                  <div className="text-xs font-medium">{badge.name}</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for managing user statistics
export function useGameStats() {
  const [userStats, setUserStats] = useState(() => {
    const saved = localStorage.getItem('sentenceBuilderStats')
    return saved ? JSON.parse(saved) : {
      totalPoints: 0,
      totalSentences: 0,
      currentStreak: 0,
      bestStreak: 0,
      perfectSentences: 0,
      questionsBuilt: 0,
      levelsAttempted: [],
      unlockedBadges: [],
      dailyStreak: 0,
      verbsMastered: { beginner: 0, elementary: 0, intermediate: 0, advanced: 0 },
      lastPlayDate: null
    }
  })

  useEffect(() => {
    localStorage.setItem('sentenceBuilderStats', JSON.stringify(userStats))
  }, [userStats])

  return [userStats, setUserStats]
}

