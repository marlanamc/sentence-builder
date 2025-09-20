'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Lock, Star, CheckCircle, Target, Clock, BookOpen, Zap } from 'lucide-react';
import { getCategoryById, getCategoryProgress } from '@/data/grammarCategories';
import { getLevelsByCategory } from '@/data/comprehensiveLevels45';
import { UserStats } from '@/data/types';

interface CategoryLevelSelectorProps {
  categoryId: string;
  userStats: UserStats;
  onLevelSelect: (levelId: number) => void;
  onBack: () => void;
}

export const CategoryLevelSelector: React.FC<CategoryLevelSelectorProps> = ({
  categoryId,
  userStats,
  onLevelSelect,
  onBack
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  
  const category = getCategoryById(categoryId);
  const levels = getLevelsByCategory(categoryId);
  const progress = getCategoryProgress(categoryId, userStats.completedLevels);
  
  if (!category) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-red-600">Category not found</h2>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Categories
        </Button>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: 'bg-green-100 text-green-800 border-green-200',
      elementary: 'bg-blue-100 text-blue-800 border-blue-200',
      intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      advanced: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getLevelStatus = (levelId: number) => {
    if (userStats.completedLevels.includes(levelId)) {
      return 'completed';
    } else if (userStats.levelsAttempted.includes(levelId)) {
      return 'attempted';
    } else {
      return 'locked';
    }
  };

  const isLevelUnlocked = (levelId: number) => {
    const level = levels.find(l => l.id === levelId);
    if (!level) return false;
    return userStats.points >= level.unlockRequirement;
  };

  const LevelCard: React.FC<{ level: any }> = ({ level }) => {
    const status = getLevelStatus(level.id);
    const isUnlocked = isLevelUnlocked(level.id);
    const isSelected = selectedLevel === level.id;
    
    return (
      <Card 
        className={`transition-all duration-200 cursor-pointer hover:shadow-md ${
          isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
        } ${!isUnlocked ? 'opacity-60' : ''} ${level.color}`}
        onClick={() => isUnlocked && setSelectedLevel(level.id)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-700">#{level.id}</span>
                {status === 'completed' && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                {status === 'attempted' && (
                  <Target className="w-5 h-5 text-yellow-600" />
                )}
                {!isUnlocked && (
                  <Lock className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg">{level.name}</CardTitle>
                <p className="text-sm text-gray-600">{level.shortDescription}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className={getDifficultyColor(level.difficulty)}>
                {level.difficulty}
              </Badge>
              <Badge variant="outline">
                {level.points} pts
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="text-sm">
              <div className="font-medium text-gray-700 mb-1">Pattern:</div>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                {level.pattern}
              </code>
            </div>
            
            <div className="text-sm">
              <div className="font-medium text-gray-700 mb-1">Example:</div>
              <div className="text-green-700 bg-green-50 p-2 rounded">
                {level.example}
              </div>
            </div>
            
            {level.isChallengingLevel && (
              <Badge variant="destructive" className="flex items-center space-x-1 w-fit">
                <Star className="w-3 h-3" />
                <span>Challenging</span>
              </Badge>
            )}
            
            {level.isCriticalLevel && (
              <Badge variant="destructive" className="flex items-center space-x-1 w-fit">
                <Zap className="w-3 h-3" />
                <span>Critical Level</span>
              </Badge>
            )}
            
            {!isUnlocked && (
              <div className="text-sm text-gray-500">
                <Lock className="w-4 h-4 inline mr-1" />
                Unlock at {level.unlockRequirement} points
              </div>
            )}
            
            {isUnlocked && (
              <Button 
                onClick={() => onLevelSelect(level.id)}
                className="w-full"
                variant={status === 'completed' ? 'outline' : 'default'}
              >
                {status === 'completed' ? 'Review' : 'Start Level'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
              <span className="text-4xl">{category.icon}</span>
              <span>{category.name}</span>
            </h1>
            <p className="text-gray-600 mt-1">{category.description}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{progress.completed}/{progress.total}</div>
          <div className="text-sm text-gray-600">Levels Completed</div>
          <Progress value={progress.percentage} className="w-32 h-2 mt-2" />
        </div>
      </div>

      {/* Category Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{category.totalLevels}</div>
              <div className="text-sm text-gray-600">Total Levels</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{progress.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{category.estimatedTime}</div>
              <div className="text-sm text-gray-600">Estimated Time</div>
            </div>
            <div className="text-center">
              <Badge className={getDifficultyColor(category.difficulty)}>
                {category.difficulty}
              </Badge>
              <div className="text-sm text-gray-600 mt-1">Difficulty</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Levels Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {levels.map(level => (
          <LevelCard key={level.id} level={level} />
        ))}
      </div>

      {/* Selected Level Details */}
      {selectedLevel && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Ready to start?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-800">
                  Level {selectedLevel}: {levels.find(l => l.id === selectedLevel)?.name}
                </h3>
                <p className="text-sm text-blue-600">
                  {levels.find(l => l.id === selectedLevel)?.shortDescription}
                </p>
              </div>
              <Button 
                onClick={() => onLevelSelect(selectedLevel)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Start Learning
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
