'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { X, Trophy, Star, Target, Zap, Shield, Award } from 'lucide-react';
import { UserStats } from '@/data/types';

interface GamificationSystemProps {
  userStats: UserStats;
  gameStats?: any;
  onClose: () => void;
}

export const GamificationSystem: React.FC<GamificationSystemProps> = ({
  userStats,
  gameStats,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span>Your Progress</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{userStats.points}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{userStats.completedLevels.length}</div>
              <div className="text-sm text-gray-600">Levels Completed</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{userStats.currentStreak}</div>
              <div className="text-sm text-gray-600">Current Streak</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">{userStats.bestStreak}</div>
              <div className="text-sm text-gray-600">Best Streak</div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span>Achievements</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold">First Steps</div>
                    <div className="text-sm text-gray-600">Complete your first level</div>
                    <Badge variant={userStats.completedLevels.length > 0 ? "default" : "secondary"}>
                      {userStats.completedLevels.length > 0 ? "Earned" : "Locked"}
                    </Badge>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Streak Master</div>
                    <div className="text-sm text-gray-600">Get a 5-day streak</div>
                    <Badge variant={userStats.bestStreak >= 5 ? "default" : "secondary"}>
                      {userStats.bestStreak >= 5 ? "Earned" : "Locked"}
                    </Badge>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Grammar Expert</div>
                    <div className="text-sm text-gray-600">Complete 20 levels</div>
                    <Badge variant={userStats.completedLevels.length >= 20 ? "default" : "secondary"}>
                      {userStats.completedLevels.length >= 20 ? "Earned" : "Locked"}
                    </Badge>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Trophy className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Point Collector</div>
                    <div className="text-sm text-gray-600">Earn 1000 points</div>
                    <Badge variant={userStats.points >= 1000 ? "default" : "secondary"}>
                      {userStats.points >= 1000 ? "Earned" : "Locked"}
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Progress by Category */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Progress by Category</h3>
            <div className="space-y-3">
              {Object.entries(userStats.categoryProgress).map(([categoryId, progress]) => (
                <div key={categoryId} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">{categoryId.replace('-', ' ')}</span>
                    <span className="text-sm text-gray-600">{progress.completed}/{progress.total}</span>
                  </div>
                  <Progress value={(progress.completed / progress.total) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
