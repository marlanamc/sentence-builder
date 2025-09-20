import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { ChevronDown, ChevronUp, Lock, Star, Clock, BookOpen, Trophy, Target } from 'lucide-react'
import { grammarCategories, getCategoryProgress, getUnlockedCategories, getNextRecommendedCategory } from '../data/grammarCategories.js'

export const CategorySelector = ({ 
  selectedCategory, 
  onCategorySelect, 
  userStats = { points: 0, completedLevels: [] },
  showRecommendations = true,
  compact = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact)
  const [showDetails, setShowDetails] = useState({})
  
  const unlockedCategories = getUnlockedCategories(userStats.points)
  const recommendedCategory = getNextRecommendedCategory(userStats.points, userStats.completedLevels)
  
  const toggleCategoryDetails = (categoryId) => {
    setShowDetails(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }
  
  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      elementary: 'bg-blue-100 text-blue-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    }
    return colors[difficulty] || 'bg-gray-100 text-gray-800'
  }
  
  const CategoryCard = ({ category }) => {
    const isUnlocked = unlockedCategories.some(cat => cat.id === category.id)
    const isSelected = selectedCategory === category.id
    const isRecommended = recommendedCategory?.id === category.id
    const progress = getCategoryProgress(category.id, userStats.completedLevels)
    const isDetailsOpen = showDetails[category.id]
    
    return (
      <Card className={`transition-all duration-200 cursor-pointer hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      } ${!isUnlocked ? 'opacity-60' : ''} ${category.color}`}>
        <CardHeader 
          className="pb-3 cursor-pointer"
          onClick={() => isUnlocked && onCategorySelect(category.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{category.icon}</span>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {category.name}
                  {!isUnlocked && <Lock className="w-4 h-4" />}
                  {isRecommended && <Star className="w-4 h-4 text-yellow-500" />}
                  {category.isChallengingCategory && <Target className="w-4 h-4 text-red-500" />}
                </CardTitle>
                <p className="text-sm opacity-75 mt-1">{category.description}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={getDifficultyColor(category.difficulty)}>
                {category.difficulty}
              </Badge>
              {isUnlocked && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleCategoryDetails(category.id)
                  }}
                >
                  {isDetailsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          {isUnlocked && (
            <div className="mt-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  Progress: {progress.completed}/{progress.total} levels
                </span>
                <span className="text-sm text-gray-600">{progress.percentage}%</span>
              </div>
              <Progress value={progress.percentage} className="h-2" />
            </div>
          )}
          
          {/* Unlock Requirement */}
          {!isUnlocked && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <Lock className="w-4 h-4" />
              <span>Requires {category.unlockRequirement} points</span>
              <span className="text-xs">({category.unlockRequirement - userStats.points} more needed)</span>
            </div>
          )}
        </CardHeader>
        
        {/* Expanded Details */}
        {isDetailsOpen && isUnlocked && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>{category.totalLevels} levels</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-500" />
                <span>{category.estimatedTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span>Levels {category.levels[0]}-{category.levels[category.levels.length - 1]}</span>
              </div>
            </div>
            
            {/* Special Messages */}
            {category.isChallengingCategory && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <Target className="w-4 h-4" />
                  <span className="font-medium">Challenge Category</span>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  This category covers the most challenging grammar concepts. Take your time and practice regularly!
                </p>
              </div>
            )}
            
            {isRecommended && (
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-700">
                  <Star className="w-4 h-4" />
                  <span className="font-medium">Recommended Next</span>
                </div>
                <p className="text-sm text-yellow-600 mt-1">
                  Based on your progress, this category is recommended for your next focus area.
                </p>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    )
  }
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Grammar Categories
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {unlockedCategories.length}/{grammarCategories.length} unlocked
              </Badge>
              {compact && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="font-bold text-lg">{userStats.points || 0}</div>
              <div className="text-gray-600">Total Points</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="font-bold text-lg">{userStats.completedLevels?.length || 0}</div>
              <div className="text-gray-600">Levels Done</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="font-bold text-lg">{unlockedCategories.length}</div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="font-bold text-lg">
                {Math.round((userStats.completedLevels?.length || 0) / 45 * 100)}%
              </div>
              <div className="text-gray-600">Overall</div>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {/* Categories Grid */}
      {(!compact || isExpanded) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {grammarCategories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
      
      {/* Recommendations */}
      {showRecommendations && recommendedCategory && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Star className="w-5 h-5" />
              Recommended Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700 mb-3">
              Based on your progress, we recommend focusing on <strong>{recommendedCategory.name}</strong> next.
            </p>
            <Button 
              onClick={() => onCategorySelect(recommendedCategory.id)}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              Start {recommendedCategory.name}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default CategorySelector

