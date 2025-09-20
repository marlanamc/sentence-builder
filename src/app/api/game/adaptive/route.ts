import { NextRequest, NextResponse } from 'next/server';
import { analyticsEngine } from '@/lib/analytics-engine';
import { questionBank } from '@/data/question-bank';

// GET /api/game/adaptive/difficulty - Get recommended difficulty for user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const difficulty = category
      ? analyticsEngine.getRecommendedDifficulty(userId, category)
      : 0.5; // Default difficulty

    const userProgress = analyticsEngine.getUserProgress(userId, 'week');

    return NextResponse.json({
      userId,
      category: category || 'general',
      recommendedDifficulty: difficulty,
      reasoning: getDifficultyReasoning(difficulty, userProgress),
      adjustmentFactors: {
        currentAccuracy: userProgress.overallAccuracy,
        recentTrend: getRecentTrend(userProgress.recentTrends),
        experienceLevel: Math.min(userProgress.totalQuestions / 100, 1.0)
      }
    });

  } catch (error) {
    console.error('Error getting adaptive difficulty:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/game/adaptive/adjust - Adjust difficulty based on performance
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      questionId,
      isCorrect,
      timeSpent,
      currentDifficulty,
      category
    } = body;

    if (!userId || !questionId || currentDifficulty === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate new difficulty based on performance
    const adjustment = calculateDifficultyAdjustment(
      isCorrect,
      timeSpent,
      currentDifficulty
    );

    const newDifficulty = Math.max(0.1, Math.min(0.9, currentDifficulty + adjustment));

    // Get user's historical performance for context
    const userProgress = analyticsEngine.getUserProgress(userId, 'week');

    return NextResponse.json({
      oldDifficulty: currentDifficulty,
      newDifficulty,
      adjustment,
      reasoning: getAdjustmentReasoning(adjustment, isCorrect, timeSpent),
      nextQuestionRecommendations: getNextQuestionRecommendations(
        newDifficulty,
        category,
        userProgress
      )
    });

  } catch (error) {
    console.error('Error adjusting difficulty:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/game/adaptive/recommendations - Get personalized learning recommendations
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, preferences = {} } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const userProgress = analyticsEngine.getUserProgress(userId, 'month');
    const insights = analyticsEngine.generateLearningInsights(userId);

    // Generate personalized recommendations
    const recommendations = {
      immediate: generateImmediateRecommendations(userProgress, insights),
      shortTerm: generateShortTermRecommendations(userProgress, insights),
      longTerm: generateLongTermRecommendations(userProgress, insights),
      study: generateStudyRecommendations(userProgress, preferences),
      content: generateContentRecommendations(userProgress, insights)
    };

    return NextResponse.json({
      userId,
      generatedAt: new Date().toISOString(),
      recommendations,
      basedOn: {
        questionsAnalyzed: userProgress.totalQuestions,
        timeframe: 'Last 30 days',
        categories: userProgress.strongestSkills.length + userProgress.weakestSkills.length,
        insights: insights.length
      }
    });

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
function getDifficultyReasoning(difficulty: number, progress: any): string {
  if (difficulty < 0.3) {
    return 'Starting with easier questions to build confidence';
  } else if (difficulty < 0.5) {
    return 'Focusing on foundational skills with moderate difficulty';
  } else if (difficulty < 0.7) {
    return 'Challenging questions to promote growth';
  } else {
    return 'Advanced questions to test mastery';
  }
}

function getRecentTrend(trends: Array<{ date: string; accuracy: number; questions: number }>): 'improving' | 'stable' | 'declining' {
  if (trends.length < 3) return 'stable';

  const recent = trends.slice(-3);
  const avgRecent = recent.reduce((sum, t) => sum + t.accuracy, 0) / recent.length;
  const older = trends.slice(0, trends.length - 3);

  if (older.length === 0) return 'stable';

  const avgOlder = older.reduce((sum, t) => sum + t.accuracy, 0) / older.length;

  if (avgRecent > avgOlder + 0.1) return 'improving';
  if (avgRecent < avgOlder - 0.1) return 'declining';
  return 'stable';
}

function calculateDifficultyAdjustment(
  isCorrect: boolean,
  timeSpent: number,
  currentDifficulty: number
): number {
  let adjustment = 0;

  // Base adjustment on correctness
  if (isCorrect) {
    adjustment += 0.05; // Increase difficulty if correct
  } else {
    adjustment -= 0.1; // Decrease difficulty if incorrect
  }

  // Adjust based on time spent (assuming 30 seconds is target)
  const targetTime = 30000; // 30 seconds in milliseconds
  if (timeSpent < targetTime * 0.5) {
    adjustment += 0.03; // Too fast, increase difficulty
  } else if (timeSpent > targetTime * 2) {
    adjustment -= 0.03; // Too slow, decrease difficulty
  }

  // Scale adjustment based on current difficulty
  if (currentDifficulty > 0.8) {
    adjustment *= 0.5; // Smaller adjustments at high difficulty
  } else if (currentDifficulty < 0.3) {
    adjustment *= 0.7; // Smaller adjustments at low difficulty
  }

  return adjustment;
}

function getAdjustmentReasoning(adjustment: number, isCorrect: boolean, timeSpent: number): string {
  const reasons = [];

  if (isCorrect) {
    reasons.push('Correct answer');
  } else {
    reasons.push('Incorrect answer');
  }

  if (timeSpent < 15000) {
    reasons.push('very quick response');
  } else if (timeSpent > 60000) {
    reasons.push('took considerable time');
  }

  if (adjustment > 0.05) {
    return `Increasing difficulty due to: ${reasons.join(', ')}`;
  } else if (adjustment < -0.05) {
    return `Decreasing difficulty due to: ${reasons.join(', ')}`;
  } else {
    return `Minor adjustment based on: ${reasons.join(', ')}`;
  }
}

function getNextQuestionRecommendations(
  difficulty: number,
  category: string,
  userProgress: any
): Array<{ questionId: string; reason: string }> {
  // Filter questions by difficulty range
  const targetQuestions = questionBank.filter(q => {
    const difficultyMatch = Math.abs(q.estimatedDifficulty - difficulty) <= 0.15;
    const categoryMatch = !category || q.category === category;
    return difficultyMatch && categoryMatch;
  });

  // Sort by suitability and take top 3
  const sorted = targetQuestions
    .sort((a, b) => {
      // Prefer questions in weak areas
      const aInWeakArea = userProgress.weakestSkills.includes(a.category) ? 1 : 0;
      const bInWeakArea = userProgress.weakestSkills.includes(b.category) ? 1 : 0;

      if (aInWeakArea !== bInWeakArea) {
        return bInWeakArea - aInWeakArea;
      }

      // Then by difficulty match
      const aDiffMatch = Math.abs(a.estimatedDifficulty - difficulty);
      const bDiffMatch = Math.abs(b.estimatedDifficulty - difficulty);

      return aDiffMatch - bDiffMatch;
    })
    .slice(0, 3);

  return sorted.map(q => ({
    questionId: q.id,
    reason: userProgress.weakestSkills.includes(q.category)
      ? `Focuses on ${q.category} (identified weakness)`
      : `Matches current difficulty level`
  }));
}

function generateImmediateRecommendations(progress: any, insights: any[]): string[] {
  const recommendations = [];

  if (progress.overallAccuracy < 0.6) {
    recommendations.push('Practice with easier questions to build confidence');
    recommendations.push('Use hints more frequently to understand patterns');
  } else if (progress.overallAccuracy > 0.8) {
    recommendations.push('Try more challenging questions');
    recommendations.push('Explore new grammar categories');
  }

  if (progress.streakDays === 0) {
    recommendations.push('Start a daily practice streak');
  } else if (progress.streakDays >= 7) {
    recommendations.push('Maintain your excellent streak!');
  }

  const weaknessInsights = insights.filter(i => i.type === 'weakness');
  if (weaknessInsights.length > 0) {
    recommendations.push(`Focus on ${weaknessInsights[0].title.toLowerCase()}`);
  }

  return recommendations.slice(0, 3);
}

function generateShortTermRecommendations(progress: any, insights: any[]): string[] {
  return [
    'Complete all levels in your strongest category',
    'Achieve 80% accuracy in at least 3 categories',
    'Build a 14-day practice streak',
    'Master present perfect vs. simple past distinction'
  ];
}

function generateLongTermRecommendations(progress: any, insights: any[]): string[] {
  return [
    'Complete all 45 grammar levels',
    'Achieve consistent 85%+ accuracy across all categories',
    'Help other students with your strongest skills',
    'Prepare for real-world English communication'
  ];
}

function generateStudyRecommendations(progress: any, preferences: any): any {
  const avgTimePerQuestion = progress.totalQuestions > 0
    ? progress.timeSpent / progress.totalQuestions / 1000
    : 30;

  return {
    dailyTime: avgTimePerQuestion > 60 ? '20-30 minutes' : '15-20 minutes',
    frequency: 'Daily practice recommended',
    focusAreas: progress.weakestSkills.slice(0, 2),
    studyTips: [
      'Review explanations after each question',
      'Practice speaking the sentences aloud',
      'Use grammar rules in real conversations'
    ]
  };
}

function generateContentRecommendations(progress: any, insights: any[]): any {
  return {
    nextCategories: ['present-perfect', 'past-tense', 'future-tense'],
    recommendedLevels: [
      Math.max(1, Math.min(45, (progress.totalQuestions / 10) + 1)),
      Math.max(1, Math.min(45, (progress.totalQuestions / 10) + 2))
    ],
    practiceTypes: [
      'sentence-building',
      'error-correction',
      'fill-in-blank'
    ]
  };
}