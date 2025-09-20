import { NextRequest, NextResponse } from 'next/server';
import { analyticsEngine } from '@/lib/analytics-engine';

// GET /api/game/progress - Get user progress and analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const timeframe = searchParams.get('timeframe') as 'week' | 'month' | 'all' || 'week';

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get comprehensive progress data
    const progress = analyticsEngine.getUserProgress(userId, timeframe);
    const insights = analyticsEngine.generateLearningInsights(userId);

    // Calculate additional metrics
    const completionRate = progress.totalQuestions > 0
      ? (progress.overallAccuracy * 100).toFixed(1)
      : '0';

    const averageTimePerQuestion = progress.totalQuestions > 0
      ? Math.round(progress.timeSpent / progress.totalQuestions / 1000) // Convert to seconds
      : 0;

    // Prepare response
    const response = {
      userId,
      timeframe,
      overview: {
        totalQuestions: progress.totalQuestions,
        overallAccuracy: progress.overallAccuracy,
        completionRate: `${completionRate}%`,
        streakDays: progress.streakDays,
        totalTimeSpent: progress.timeSpent,
        averageTimePerQuestion
      },
      skills: {
        strongest: progress.strongestSkills,
        weakest: progress.weakestSkills,
        levelProgress: progress.levelProgress
      },
      trends: {
        recentPerformance: progress.recentTrends,
        improvementAreas: insights.filter(i => i.type === 'recommendation'),
        achievements: insights.filter(i => i.type === 'achievement')
      },
      insights: insights.slice(0, 5), // Limit to top 5 insights
      recommendations: {
        nextLevel: this.getRecommendedNextLevel(progress),
        focusAreas: progress.weakestSkills.slice(0, 3),
        studyTime: this.getRecommendedStudyTime(progress)
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/game/progress/session - Start or end a learning session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action, sessionId, deviceType } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'User ID and action are required' },
        { status: 400 }
      );
    }

    let result;

    if (action === 'start') {
      const newSessionId = analyticsEngine.startSession(userId, deviceType || 'web');
      result = {
        sessionId: newSessionId,
        message: 'Session started successfully',
        timestamp: new Date().toISOString()
      };
    } else if (action === 'end') {
      if (!sessionId) {
        return NextResponse.json(
          { error: 'Session ID is required to end session' },
          { status: 400 }
        );
      }

      const session = analyticsEngine.endSession(sessionId);
      if (!session) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        );
      }

      result = {
        sessionId,
        summary: {
          duration: session.totalTime,
          questionsAttempted: session.questionsAttempted,
          correctAnswers: session.correctAnswers,
          accuracy: session.questionsAttempted > 0
            ? (session.correctAnswers / session.questionsAttempted * 100).toFixed(1) + '%'
            : '0%',
          categoriesPracticed: session.categoriesPracticed,
          levelsAttempted: session.levelsAttempted
        },
        message: 'Session ended successfully'
      };
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "start" or "end"' },
        { status: 400 }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error managing session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/game/progress/achievement - Unlock achievement
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, achievementId, metadata } = body;

    if (!userId || !achievementId) {
      return NextResponse.json(
        { error: 'User ID and achievement ID are required' },
        { status: 400 }
      );
    }

    // In a real implementation, this would update the database
    // For now, we'll just return success
    const achievement = {
      id: achievementId,
      unlockedAt: new Date().toISOString(),
      metadata: metadata || {}
    };

    return NextResponse.json({
      message: 'Achievement unlocked successfully',
      achievement,
      points: getAchievementPoints(achievementId)
    });

  } catch (error) {
    console.error('Error unlocking achievement:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
function getRecommendedNextLevel(progress: any): number {
  // Simple logic to recommend next level based on current performance
  const currentLevels = Object.keys(progress.levelProgress)
    .map(level => parseInt(level.replace('level_', '')))
    .filter(level => !isNaN(level));

  if (currentLevels.length === 0) return 1;

  const maxLevel = Math.max(...currentLevels);
  const maxLevelAccuracy = progress.levelProgress[`level_${maxLevel}`] || 0;

  // If user has good accuracy on current max level, recommend next level
  if (maxLevelAccuracy >= 0.7) {
    return Math.min(45, maxLevel + 1);
  }

  // Otherwise, recommend continuing current level
  return maxLevel;
}

function getRecommendedStudyTime(progress: any): string {
  const avgTimePerQuestion = progress.totalQuestions > 0
    ? progress.timeSpent / progress.totalQuestions
    : 30000; // Default 30 seconds

  if (avgTimePerQuestion > 60000) { // More than 1 minute
    return '15-20 minutes daily with focus on speed';
  } else if (progress.overallAccuracy < 0.6) {
    return '20-30 minutes daily with emphasis on accuracy';
  } else {
    return '15-25 minutes daily to maintain progress';
  }
}

function getAchievementPoints(achievementId: string): number {
  const pointsMap: Record<string, number> = {
    'first-sentence': 10,
    'streak-warrior': 50,
    'grammar-master': 100,
    'speed-demon': 75,
    'perfectionist': 200
  };

  return pointsMap[achievementId] || 25; // Default points
}