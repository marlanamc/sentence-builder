import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  Star, 
  Trophy, 
  BookOpen,
  Target,
  Zap
} from 'lucide-react'

export function LevelSelector({ 
  levels, 
  currentLevel, 
  unlockedLevels, 
  onLevelSelect, 
  userStats,
  showGrammarExplanation = true 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const currentLevelData = levels.find(l => l.id === currentLevel)
  
  // Group levels by difficulty
  const levelCategories = {
    beginner: { name: 'Beginner (1-5)', levels: levels.filter(l => l.id <= 5), color: 'bg-green-50 border-green-200' },
    elementary: { name: 'Elementary (6-10)', levels: levels.filter(l => l.id >= 6 && l.id <= 10), color: 'bg-blue-50 border-blue-200' },
    intermediate: { name: 'Intermediate (11-15)', levels: levels.filter(l => l.id >= 11 && l.id <= 15), color: 'bg-yellow-50 border-yellow-200' },
    advanced: { name: 'Advanced (16-20)', levels: levels.filter(l => l.id >= 16 && l.id <= 20), color: 'bg-purple-50 border-purple-200' }
  }
  
  const filteredLevels = selectedCategory === 'all' 
    ? levels 
    : levelCategories[selectedCategory]?.levels || levels

  const handleLevelSelect = (levelId) => {
    if (unlockedLevels.includes(levelId)) {
      onLevelSelect(levelId)
      setIsOpen(false)
    }
  }

  return (
    <Card className="mb-4 sm:mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>Choose Your Level</span>
          <Badge variant="secondary">Level {currentLevel}/20</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Current Level Display */}
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full justify-between p-4 h-auto"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                currentLevel <= 5 ? 'bg-green-500' :
                currentLevel <= 10 ? 'bg-blue-500' :
                currentLevel <= 15 ? 'bg-yellow-500' : 'bg-purple-500'
              }`}>
                {currentLevel}
              </div>
              <div className="text-left">
                <div className="font-semibold">{currentLevelData?.name}</div>
                <div className="text-sm text-gray-600">{currentLevelData?.shortDescription}</div>
              </div>
            </div>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>

        {/* Dropdown Content */}
        {isOpen && (
          <div className="space-y-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All Levels
              </Button>
              {Object.entries(levelCategories).map(([key, category]) => (
                <Button
                  key={key}
                  variant={selectedCategory === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(key)}
                  className="text-xs"
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Level Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
              {filteredLevels.map((level) => {
                const isUnlocked = unlockedLevels.includes(level.id)
                const isCurrentLevel = currentLevel === level.id
                const categoryColor = 
                  level.id <= 5 ? 'border-l-green-400' :
                  level.id <= 10 ? 'border-l-blue-400' :
                  level.id <= 15 ? 'border-l-yellow-400' : 'border-l-purple-400'
                
                return (
                  <div
                    key={level.id}
                    className={`p-3 border-2 border-l-4 rounded-lg cursor-pointer transition-all ${categoryColor} ${
                      isCurrentLevel 
                        ? 'bg-blue-50 border-blue-300' 
                        : isUnlocked 
                          ? 'bg-white border-gray-200 hover:bg-gray-50' 
                          : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                    onClick={() => handleLevelSelect(level.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                          level.id <= 5 ? 'bg-green-500' :
                          level.id <= 10 ? 'bg-blue-500' :
                          level.id <= 15 ? 'bg-yellow-500' : 'bg-purple-500'
                        }`}>
                          {level.id}
                        </div>
                        {isCurrentLevel && <Star className="w-4 h-4 text-yellow-500" />}
                      </div>
                      {!isUnlocked && <Lock className="w-4 h-4 text-gray-400" />}
                    </div>
                    
                    <div className="text-sm font-semibold text-gray-800 mb-1">
                      {level.name}
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-2">
                      {level.shortDescription || level.explanation?.substring(0, 50) + '...'}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">
                        {level.points} pts
                      </span>
                      {!isUnlocked && (
                        <span className="text-red-500">
                          Need {level.unlockRequirement}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-semibold">Unlocked</span>
                </div>
                <div className="text-lg font-bold">{unlockedLevels.length}/20</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm font-semibold">Points</span>
                </div>
                <div className="text-lg font-bold">{userStats.totalPoints}</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-semibold">Streak</span>
                </div>
                <div className="text-lg font-bold">{userStats.currentStreak}</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-semibold">Perfect</span>
                </div>
                <div className="text-lg font-bold">{userStats.perfectSentences}</div>
              </div>
            </div>
          </div>
        )}

        {/* Current Level Grammar Explanation */}
        {showGrammarExplanation && currentLevelData && !isOpen && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <div className="flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-blue-800 text-sm">Grammar Focus:</div>
                <div className="text-blue-700 text-xs mt-1">{currentLevelData.explanation}</div>
                <div className="text-blue-600 text-xs mt-1 font-mono">
                  Pattern: {currentLevelData.pattern}
                </div>
                <div className="text-blue-600 text-xs mt-1">
                  Example: {currentLevelData.example}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

