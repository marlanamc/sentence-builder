'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronDown, ChevronUp, Lock, Star, Clock, BookOpen, Trophy, Target } from 'lucide-react';
import { grammarCategories, getCategoryProgress, getUnlockedCategories, getNextRecommendedCategory } from '@/data/grammarCategories';
import { UserStats } from '@/data/types';

interface CategorySelectorProps {
  selectedCategory?: string | null;
  onCategorySelect: (categoryId: string) => void;
  userStats?: UserStats;
  showRecommendations?: boolean;
  compact?: boolean;
  onShowGamification?: () => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  selectedCategory, 
  onCategorySelect, 
  userStats = { points: 0, completedLevels: [], totalPoints: 0, currentStreak: 0, totalSentences: 0, unlockedBadges: [], levelsAttempted: [], perfectSentences: 0 },
  showRecommendations = true,
  onShowGamification
}) => {
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});
  
  const unlockedCategories = getUnlockedCategories(userStats.points);
  const recommendedCategory = getNextRecommendedCategory(userStats.points, userStats.completedLevels);
  
  const toggleCategoryDetails = (categoryId: string) => {
    setShowDetails(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  
  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: 'bg-green-100 text-green-800',
      elementary: 'bg-blue-100 text-blue-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };
  
  const CategoryCard: React.FC<{ category: { id: string; name: string; description: string } }> = ({ category }) => {
    const isUnlocked = unlockedCategories.some(cat => cat.id === category.id);
    const isSelected = selectedCategory === category.id;
    const isRecommended = recommendedCategory?.id === category.id;
    const progress = getCategoryProgress(category.id); // No user stats in free-play mode
    const isDetailsOpen = showDetails[category.id];
    
    return (
      <Card className={`transition-all duration-300 cursor-pointer hover:shadow-xl hover:scale-[1.02] ${
        isSelected ? 'ring-2 ring-blue-500 shadow-xl scale-[1.02]' : ''
      } ${!isUnlocked ? 'opacity-60' : ''} border-0 shadow-lg bg-white/80 backdrop-blur-sm`}>
        <CardHeader 
          className="pb-4"
          onClick={() => isUnlocked && onCategorySelect(category.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-2xl">
                {category.icon}
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl font-bold flex items-center space-x-3 mb-2">
                  <span className="text-slate-900">{category.name}</span>
                  {isRecommended && (
                    <Badge variant="secondary" className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 border-emerald-200">
                      <Target className="w-3 h-3 mr-1" />
                      Recommended
                    </Badge>
                  )}
                  {category.isChallengingCategory && (
                    <Badge variant="destructive" className="text-xs px-2 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Challenging
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-slate-600 text-sm leading-relaxed">{category.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {!isUnlocked ? (
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCategoryDetails(category.id);
                  }}
                  className="w-8 h-8 p-0 hover:bg-slate-100 rounded-lg"
                >
                  {isDetailsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          {isUnlocked && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                <span className="font-medium">Progress</span>
                <span className="font-semibold">{progress.completed}/{progress.total} levels</span>
              </div>
              <Progress value={progress.percentage} className="h-2 bg-slate-100" />
            </div>
          )}
          
          {/* Unlock Requirement */}
          {!isUnlocked && (
            <div className="mt-4 text-sm text-slate-500 bg-slate-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Unlock at {category.unlockRequirement} points</span>
              </div>
            </div>
          )}
        </CardHeader>
        
        {/* Expanded Details */}
        {isDetailsOpen && isUnlocked && (
          <CardContent className="pt-0">
            <div className="space-y-4 bg-slate-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="font-medium">{category.estimatedTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  <span className="font-medium">{category.totalLevels} levels</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Badge className={`${getDifficultyColor(category.difficulty)} px-3 py-1 font-semibold`}>
                  {category.difficulty}
                </Badge>
                {progress.percentage === 100 && (
                  <Badge variant="secondary" className="flex items-center space-x-1 px-3 py-1 bg-emerald-100 text-emerald-700 border-emerald-200">
                    <Trophy className="w-3 h-3" />
                    <span>Complete!</span>
                  </Badge>
                )}
              </div>
              
              <div className="text-sm text-slate-600">
                <strong className="text-slate-800">Focus areas:</strong> {category.focusAreas.join(', ')}
              </div>
              
              <Button 
                onClick={() => onCategorySelect(category.id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                disabled={!isUnlocked}
              >
                {progress.percentage === 100 ? 'Review' : 'Start Learning'}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/20">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">🎯</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Sentence Builder Game
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Master English grammar through interactive sentence building. 
            Choose a category to start your learning journey!
          </p>
        </div>
        
        {/* User Stats Summary */}
        <div className="flex justify-center space-x-8">
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button 
            variant="outline" 
            onClick={onShowGamification}
            className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90 shadow-lg"
          >
            <Trophy className="w-5 h-5" />
            <span className="font-semibold">View Stats</span>
          </Button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {grammarCategories.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>

      {/* Recommendations */}
      {showRecommendations && recommendedCategory && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <Target className="w-5 h-5" />
              <span>Recommended Next</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-800">{recommendedCategory.name}</h3>
                <p className="text-sm text-blue-600">{recommendedCategory.description}</p>
              </div>
              <Button 
                onClick={() => onCategorySelect(recommendedCategory.id)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Start
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
