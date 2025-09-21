'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Trophy, Star, Target, Zap, Award } from 'lucide-react';
import { UserStats } from '@/data/types';

interface GamificationSystemProps {
  userStats?: UserStats;
  gameStats?: Record<string, unknown>;
  onClose: () => void;
}

export const GamificationSystem: React.FC<GamificationSystemProps> = ({
  userStats = { points: 0, completedLevels: [], totalPoints: 0, currentStreak: 0, totalSentences: 0, unlockedBadges: [], levelsAttempted: [], perfectSentences: 0 },
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
              <div className="text-3xl font-bold text-blue-600">🎉</div>
              <div className="text-sm text-gray-600">Learn & Practice</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">Free Play</div>
              <div className="text-sm text-gray-600">Practice Mode</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">∞</div>
              <div className="text-sm text-gray-600">Unlimited</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">🎯</div>
              <div className="text-sm text-gray-600">Master Grammar</div>
            </div>
          </div>

          {/* Learning Tips */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span>Learning Tips</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Practice Daily</div>
                    <div className="text-sm text-gray-600">Build your grammar skills step by step</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Learn by Doing</div>
                    <div className="text-sm text-gray-600">Interactive practice is the best way to learn</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Master Grammar</div>
                    <div className="text-sm text-gray-600">Perfect your sentence building skills</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <Trophy className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Stay Consistent</div>
                    <div className="text-sm text-gray-600">Regular practice leads to mastery</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Grammar Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Grammar Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="font-semibold text-blue-800">Present Tense</div>
                <div className="text-sm text-blue-600">8 levels</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="font-semibold text-green-800">Time & Expressions</div>
                <div className="text-sm text-green-600">4 levels</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="font-semibold text-purple-800">Past Tense</div>
                <div className="text-sm text-purple-600">5 levels</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="font-semibold text-orange-800">Present Perfect</div>
                <div className="text-sm text-orange-600">7 levels</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="font-semibold text-red-800">Future Tenses</div>
                <div className="text-sm text-red-600">5 levels</div>
              </div>
              <div className="text-center p-3 bg-indigo-50 rounded-lg">
                <div className="font-semibold text-indigo-800">Advanced</div>
                <div className="text-sm text-indigo-600">9 levels</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
