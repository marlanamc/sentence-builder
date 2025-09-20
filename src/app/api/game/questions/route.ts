import { NextRequest, NextResponse } from 'next/server';
import { questionBank, getAdaptiveQuestions, getQuestionsByLevel, validateQuestionAnswer } from '@/data/question-bank';
import { analyticsEngine } from '@/lib/analytics-engine';

// GET /api/game/questions - Get questions for user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const level = searchParams.get('level');
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const count = parseInt(searchParams.get('count') || '5');
    const adaptive = searchParams.get('adaptive') === 'true';

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let questions;

    if (adaptive) {
      // Get user's current level and accuracy for adaptive questioning
      const userProgress = analyticsEngine.getUserProgress(userId, 'week');
      const userLevel = Math.min(45, Math.max(1, userProgress.totalQuestions / 10)); // Rough level estimation
      questions = getAdaptiveQuestions(userLevel, userProgress.overallAccuracy, count);
    } else if (level) {
      questions = getQuestionsByLevel(parseInt(level)).slice(0, count);
    } else {
      // Filter by other criteria
      let filteredQuestions = questionBank;

      if (category) {
        filteredQuestions = filteredQuestions.filter(q => q.category === category);
      }

      if (difficulty) {
        filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
      }

      // Shuffle and take requested count
      questions = filteredQuestions
        .sort(() => 0.5 - Math.random())
        .slice(0, count);
    }

    // Remove sensitive data before sending to client
    const clientQuestions = questions.map(q => ({
      id: q.id,
      type: q.type,
      category: q.category,
      level: q.level,
      difficulty: q.difficulty,
      instruction: q.instruction,
      prompt: q.prompt,
      context: q.context,
      availableWords: q.availableWords,
      requiredWords: q.requiredWords,
      expectedPattern: q.expectedPattern,
      options: q.options,
      sentence: q.sentence,
      hints: q.hints,
      explanation: q.explanation,
      targetSkills: q.targetSkills,
      estimatedDifficulty: q.estimatedDifficulty,
      averageTime: q.averageTime,
      tags: q.tags
    }));

    return NextResponse.json({
      questions: clientQuestions,
      metadata: {
        totalAvailable: questionBank.length,
        requestedCount: count,
        returnedCount: clientQuestions.length,
        adaptive
      }
    });

  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/game/questions/validate - Validate user answer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      sessionId,
      questionId,
      userAnswer,
      timeSpent,
      hintsUsed = 0,
      level,
      category
    } = body;

    // Validate required fields
    if (!userId || !questionId || !userAnswer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the question
    const question = questionBank.find(q => q.id === questionId);
    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Validate the answer
    const validation = validateQuestionAnswer(question, userAnswer);

    // Record the attempt in analytics
    const attemptId = analyticsEngine.recordQuestionAttempt({
      userId,
      sessionId: sessionId || 'unknown',
      questionId,
      userAnswer,
      isCorrect: validation.isCorrect,
      score: validation.score,
      timeSpent: timeSpent || 0,
      hintsUsed,
      errorTypes: [], // Could be enhanced with grammar engine integration
      difficulty: question.estimatedDifficulty,
      level: level || question.level,
      category: category || question.category
    });

    // Generate personalized feedback
    let enhancedFeedback = validation.feedback;
    if (!validation.isCorrect && question.hints.length > hintsUsed) {
      enhancedFeedback += ` Hint: ${question.hints[hintsUsed]}`;
    }

    return NextResponse.json({
      attemptId,
      isCorrect: validation.isCorrect,
      score: validation.score,
      feedback: enhancedFeedback,
      explanation: question.explanation,
      correctAnswers: validation.isCorrect ? undefined : question.acceptableAnswers.slice(0, 2), // Show only first 2 correct answers
      nextHint: hintsUsed < question.hints.length - 1 ? question.hints[hintsUsed + 1] : null,
      points: Math.round(validation.score * 10), // Convert to points
      encouragement: validation.isCorrect
        ? getRandomEncouragement('positive')
        : getRandomEncouragement('supportive')
    });

  } catch (error) {
    console.error('Error validating answer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getRandomEncouragement(type: 'positive' | 'supportive'): string {
  const positive = [
    "Excellent work! 🌟",
    "Perfect! You're getting the hang of this! 🎉",
    "Amazing! Your English is improving! 🚀",
    "Well done! Keep up the great work! 👏",
    "Fantastic! You've mastered this pattern! ⭐"
  ];

  const supportive = [
    "Good try! Keep practicing! 💪",
    "Almost there! Don't give up! 🎯",
    "Learning takes time - you're doing great! 📚",
    "Every mistake is a step toward success! 🌱",
    "Keep going! You've got this! 💫"
  ];

  const messages = type === 'positive' ? positive : supportive;
  return messages[Math.floor(Math.random() * messages.length)];
}