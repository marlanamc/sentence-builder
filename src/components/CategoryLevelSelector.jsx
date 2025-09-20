import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { CheckCircle, Lock, Play, BookOpen, Target, Clock, Star } from 'lucide-react'
import { getCategoryById, getCategoryProgress } from '../data/grammarCategories.js'

export const CategoryLevelSelector = ({ 
  categoryId, 
  levels, 
  currentLevel, 
  onLevelSelect, 
  userStats = { points: 0, completedLevels: [] },
  onBackToCategories 
}) => {
  const category = getCategoryById(categoryId)
  const progress = getCategoryProgress(categoryId, userStats.completedLevels)
  
  if (!category) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Category not found</p>
          <Button onClick={onBackToCategories} className="mt-4">
            Back to Categories
          </Button>
        </CardContent>
      </Card>
    )
  }
  
  const categoryLevels = levels.filter(level => category.levels.includes(level.id))
  
  const getLevelStatus = (level) => {
    const isCompleted = userStats.completedLevels.includes(level.id)
    const isCurrent = currentLevel === level.id
    const isUnlocked = userStats.points >= level.unlockRequirement
    
    return { isCompleted, isCurrent, isUnlocked }
  }
  
  const getNextRecommendedLevel = () => {
    // Find first incomplete level in this category
    for (const level of categoryLevels) {
      if (!userStats.completedLevels.includes(level.id)) {
        return level.id
      }
    }
    return categoryLevels[0]?.id // Fallback to first level
  }
  
  const recommendedLevel = getNextRecommendedLevel()
  
  return (
    <div className="space-y-4">
      {/* Category Header */}
      <Card className={category.color}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{category.icon}</span>
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  {category.name}
                  {category.isChallengingCategory && <Target className="w-5 h-5 text-red-500" />}
                </CardTitle>
                <p className="text-sm opacity-75 mt-1">{category.description}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onBackToCategories}>
              ← Back to Categories
            </Button>
          </div>
          
          {/* Category Progress */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">
                Category Progress: {progress.completed}/{progress.total} levels
              </span>
              <span className="text-sm">{progress.percentage}% complete</span>
            </div>
            <Progress value={progress.percentage} className="h-3" />
          </div>
          
          {/* Category Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{category.totalLevels} levels total</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Estimated: {category.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${category.difficulty === 'beginner' ? 'bg-green-100 text-green-800' : 
                                 category.difficulty === 'elementary' ? 'bg-blue-100 text-blue-800' :
                                 category.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                 'bg-red-100 text-red-800'}`}>
                {category.difficulty}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {/* Special Category Messages */}
      {category.isChallengingCategory && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <Target className="w-5 h-5" />
              <span className="font-semibold">Challenge Category</span>
            </div>
            <p className="text-red-600 text-sm">
              This category covers some of the most challenging grammar concepts in English. 
              Don't worry if it takes time to master - present perfect is difficult even for advanced learners!
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Recommended Next Level */}
      {recommendedLevel && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-yellow-700 mb-1">
                  <Star className="w-4 h-4" />
                  <span className="font-semibold">Recommended Next</span>
                </div>
                <p className="text-yellow-600 text-sm">
                  Continue with Level {recommendedLevel}: {categoryLevels.find(l => l.id === recommendedLevel)?.name}
                </p>
              </div>
              <Button 
                onClick={() => onLevelSelect(recommendedLevel)}
                className="bg-yellow-600 hover:bg-yellow-700"
                size="sm"
              >
                <Play className="w-4 h-4 mr-1" />
                Start
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryLevels.map((level) => {
          const { isCompleted, isCurrent, isUnlocked } = getLevelStatus(level)
          const isRecommended = level.id === recommendedLevel
          
          return (
            <Card 
              key={level.id}
              className={`transition-all duration-200 cursor-pointer hover:shadow-md ${
                isCurrent ? 'ring-2 ring-blue-500 shadow-lg' : ''
              } ${!isUnlocked ? 'opacity-60' : ''} ${
                isCompleted ? 'bg-green-50 border-green-200' : 
                isRecommended ? 'bg-yellow-50 border-yellow-200' : ''
              }`}
              onClick={() => isUnlocked && onLevelSelect(level.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold text-sm">
                      {level.id}
                    </div>
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {level.name}
                        {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {!isUnlocked && <Lock className="w-4 h-4 text-gray-400" />}
                        {isRecommended && <Star className="w-4 h-4 text-yellow-500" />}
                      </CardTitle>
                      {level.shortDescription && (
                        <p className="text-xs text-gray-600 mt-1">{level.shortDescription}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Level Details */}
                <div className="mt-3 space-y-2">
                  <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                    {level.formula}
                  </div>
                  <div className="text-xs italic text-gray-600">
                    Example: {level.example}
                  </div>
                  
                  {/* Points and Requirements */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-600 font-medium">+{level.points} points</span>
                    {!isUnlocked && (
                      <span className="text-gray-500">
                        Needs {level.unlockRequirement} pts
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>
      
      {/* Category Completion Message */}
      {progress.percentage === 100 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-green-700 mb-2">
              <CheckCircle className="w-6 h-6" />
              <span className="font-semibold text-lg">Category Complete!</span>
            </div>
            <p className="text-green-600 mb-3">
              Congratulations! You've mastered all levels in {category.name}.
            </p>
            <Button onClick={onBackToCategories} className="bg-green-600 hover:bg-green-700">
              Choose Next Category
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default CategoryLevelSelector

