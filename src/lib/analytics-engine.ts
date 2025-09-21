// Advanced Analytics Engine for Learning Progress Tracking
// Comprehensive system for monitoring student progress and providing insights

export interface UserSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  questionsAttempted: number;
  correctAnswers: number;
  totalTime: number; // milliseconds
  categoriesPracticed: string[];
  levelsAttempted: number[];
  deviceType: string;
  achievements: string[];
}

export interface QuestionAttempt {
  id: string;
  userId: string;
  sessionId: string;
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  score: number; // 0.0 to 1.0
  timeSpent: number; // milliseconds
  hintsUsed: number;
  errorTypes: string[];
  timestamp: Date;
  difficulty: number;
  level: number;
  category: string;
}

export interface LearningMetric {
  userId: string;
  metricName: string;
  value: number;
  context: Record<string, any>;
  timestamp: Date;
  period: 'daily' | 'weekly' | 'monthly';
}

export interface SkillAssessment {
  userId: string;
  skillName: string;
  proficiencyLevel: number; // 0.0 to 1.0
  confidenceInterval: number;
  lastAssessed: Date;
  assessmentBasis: number; // number of questions
  trend: 'improving' | 'stable' | 'declining';
}

export interface LearningInsight {
  type: 'strength' | 'weakness' | 'recommendation' | 'achievement';
  title: string;
  description: string;
  data: any;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  suggestions: string[];
}

export class AnalyticsEngine {
  private sessions: Map<string, UserSession> = new Map();
  private attempts: QuestionAttempt[] = [];
  private metrics: LearningMetric[] = [];
  private skillAssessments: Map<string, SkillAssessment> = new Map();

  // Session Management
  startSession(userId: string, deviceType: string = 'unknown'): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const session: UserSession = {
      id: sessionId,
      userId,
      startTime: new Date(),
      questionsAttempted: 0,
      correctAnswers: 0,
      totalTime: 0,
      categoriesPracticed: [],
      levelsAttempted: [],
      deviceType,
      achievements: []
    };

    this.sessions.set(sessionId, session);
    return sessionId;
  }

  endSession(sessionId: string): UserSession | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    session.endTime = new Date();
    session.totalTime = session.endTime.getTime() - session.startTime.getTime();

    // Calculate session metrics
    this.calculateSessionMetrics(session);

    return session;
  }

  // Question Attempt Tracking
  recordQuestionAttempt(attempt: Omit<QuestionAttempt, 'id' | 'timestamp'>): string {
    const attemptId = `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const fullAttempt: QuestionAttempt = {
      ...attempt,
      id: attemptId,
      timestamp: new Date()
    };

    this.attempts.push(fullAttempt);

    // Update session data
    const session = this.sessions.get(attempt.sessionId);
    if (session) {
      session.questionsAttempted++;
      if (attempt.isCorrect) {
        session.correctAnswers++;
      }

      if (!session.categoriesPracticed.includes(attempt.category)) {
        session.categoriesPracticed.push(attempt.category);
      }

      if (!session.levelsAttempted.includes(attempt.level)) {
        session.levelsAttempted.push(attempt.level);
      }
    }

    // Update skill assessments
    this.updateSkillAssessments(fullAttempt);

    // Record learning metrics
    this.recordLearningMetrics(fullAttempt);

    return attemptId;
  }

  // Skill Assessment System
  private updateSkillAssessments(attempt: QuestionAttempt) {
    const skillKey = `${attempt.userId}_${attempt.category}`;
    let assessment = this.skillAssessments.get(skillKey);

    if (!assessment) {
      assessment = {
        userId: attempt.userId,
        skillName: attempt.category,
        proficiencyLevel: attempt.score,
        confidenceInterval: 0.3, // High uncertainty initially
        lastAssessed: new Date(),
        assessmentBasis: 1,
        trend: 'stable'
      };
    } else {
      // Update using exponential moving average
      const alpha = Math.min(0.3, 2.0 / (assessment.assessmentBasis + 1));
      const oldProficiency = assessment.proficiencyLevel;

      assessment.proficiencyLevel = (1 - alpha) * assessment.proficiencyLevel + alpha * attempt.score;
      assessment.confidenceInterval = Math.max(0.1, assessment.confidenceInterval * 0.95);
      assessment.assessmentBasis++;
      assessment.lastAssessed = new Date();

      // Determine trend
      const change = assessment.proficiencyLevel - oldProficiency;
      if (Math.abs(change) < 0.05) {
        assessment.trend = 'stable';
      } else if (change > 0) {
        assessment.trend = 'improving';
      } else {
        assessment.trend = 'declining';
      }
    }

    this.skillAssessments.set(skillKey, assessment);
  }

  // Learning Metrics Calculation
  private recordLearningMetrics(attempt: QuestionAttempt) {
    const now = new Date();

    // Record various metrics
    const metrics: Partial<LearningMetric>[] = [
      {
        metricName: 'accuracy_rate',
        value: attempt.score,
        context: {
          category: attempt.category,
          level: attempt.level,
          difficulty: attempt.difficulty
        }
      },
      {
        metricName: 'response_time',
        value: attempt.timeSpent,
        context: {
          question_type: 'sentence-building',
          hints_used: attempt.hintsUsed
        }
      },
      {
        metricName: 'hint_usage',
        value: attempt.hintsUsed,
        context: {
          question_difficulty: attempt.difficulty,
          was_correct: attempt.isCorrect
        }
      }
    ];

    metrics.forEach(metric => {
      if (metric.metricName && metric.value !== undefined) {
        this.metrics.push({
          userId: attempt.userId,
          metricName: metric.metricName,
          value: metric.value,
          context: metric.context || {},
          timestamp: now,
          period: 'daily'
        });
      }
    });
  }

  // Session Analytics
  private calculateSessionMetrics(session: UserSession) {
    const accuracy = session.questionsAttempted > 0
      ? session.correctAnswers / session.questionsAttempted
      : 0;

    const sessionMetrics = [
      {
        metricName: 'session_accuracy',
        value: accuracy,
        context: {
          questions_attempted: session.questionsAttempted,
          session_duration: session.totalTime
        }
      },
      {
        metricName: 'session_duration',
        value: session.totalTime,
        context: {
          questions_attempted: session.questionsAttempted,
          categories_practiced: session.categoriesPracticed.length
        }
      },
      {
        metricName: 'categories_explored',
        value: session.categoriesPracticed.length,
        context: {
          categories: session.categoriesPracticed
        }
      }
    ];

    sessionMetrics.forEach(metric => {
      this.metrics.push({
        userId: session.userId,
        metricName: metric.metricName,
        value: metric.value,
        context: metric.context,
        timestamp: session.endTime || new Date(),
        period: 'daily'
      });
    });
  }

  // Advanced Analytics
  getUserProgress(userId: string, timeframe: 'week' | 'month' | 'all' = 'week'): {
    overallAccuracy: number;
    totalQuestions: number;
    streakDays: number;
    strongestSkills: string[];
    weakestSkills: string[];
    timeSpent: number;
    levelProgress: Record<string, number>;
    recentTrends: Array<{ date: string; accuracy: number; questions: number }>;
  } {
    const cutoffDate = this.getCutoffDate(timeframe);
    const userAttempts = this.attempts.filter(
      a => a.userId === userId && a.timestamp >= cutoffDate
    );

    // Calculate overall metrics
    const totalQuestions = userAttempts.length;
    const correctAnswers = userAttempts.filter(a => a.isCorrect).length;
    const overallAccuracy = totalQuestions > 0 ? correctAnswers / totalQuestions : 0;
    const timeSpent = userAttempts.reduce((sum, a) => sum + a.timeSpent, 0);

    // Skill analysis
    const skillPerformance = this.calculateSkillPerformance(userAttempts);
    const strongestSkills = Object.entries(skillPerformance)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([skill]) => skill);

    const weakestSkills = Object.entries(skillPerformance)
      .sort(([, a], [, b]) => a - b)
      .slice(0, 3)
      .map(([skill]) => skill);

    // Level progress
    const levelProgress = this.calculateLevelProgress(userAttempts);

    // Recent trends
    const recentTrends = this.calculateRecentTrends(userAttempts, 7);

    // Streak calculation
    const streakDays = this.calculateStreakDays(userId);

    return {
      overallAccuracy,
      totalQuestions,
      streakDays,
      strongestSkills,
      weakestSkills,
      timeSpent,
      levelProgress,
      recentTrends
    };
  }

  // Learning Insights Generation
  generateLearningInsights(userId: string): LearningInsight[] {
    const insights: LearningInsight[] = [];
    const userProgress = this.getUserProgress(userId, 'month');
    const userSkills = Array.from(this.skillAssessments.values())
      .filter(s => s.userId === userId);

    // Accuracy insights
    if (userProgress.overallAccuracy >= 0.8) {
      insights.push({
        type: 'strength',
        title: 'Excellent Accuracy!',
        description: `You're maintaining ${Math.round(userProgress.overallAccuracy * 100)}% accuracy. Great job!`,
        data: { accuracy: userProgress.overallAccuracy },
        priority: 'high',
        actionable: false,
        suggestions: ['Keep up the excellent work!', 'Ready for more challenging levels?']
      });
    } else if (userProgress.overallAccuracy < 0.6) {
      insights.push({
        type: 'weakness',
        title: 'Accuracy Opportunity',
        description: 'Your accuracy could improve with more focused practice.',
        data: { accuracy: userProgress.overallAccuracy },
        priority: 'high',
        actionable: true,
        suggestions: [
          'Review grammar rules before attempting questions',
          'Use hints more frequently to learn patterns',
          'Focus on one category at a time'
        ]
      });
    }

    // Skill-specific insights
    for (const skill of userSkills) {
      if (skill.proficiencyLevel >= 0.85) {
        insights.push({
          type: 'achievement',
          title: `${skill.skillName} Mastery!`,
          description: `You've mastered ${skill.skillName} with ${Math.round(skill.proficiencyLevel * 100)}% proficiency.`,
          data: { skill: skill.skillName, proficiency: skill.proficiencyLevel },
          priority: 'medium',
          actionable: false,
          suggestions: ['Move to more advanced topics', 'Help others with this skill']
        });
      } else if (skill.proficiencyLevel < 0.5 && skill.assessmentBasis >= 5) {
        insights.push({
          type: 'recommendation',
          title: `Focus on ${skill.skillName}`,
          description: `This area needs more attention. Consider dedicated practice.`,
          data: { skill: skill.skillName, proficiency: skill.proficiencyLevel },
          priority: 'high',
          actionable: true,
          suggestions: [
            `Review ${skill.skillName} explanations`,
            'Practice with easier questions first',
            'Use all available hints'
          ]
        });
      }
    }

    // Streak insights
    if (userProgress.streakDays >= 7) {
      insights.push({
        type: 'achievement',
        title: 'Consistent Learner!',
        description: `Amazing ${userProgress.streakDays}-day learning streak!`,
        data: { streak: userProgress.streakDays },
        priority: 'medium',
        actionable: false,
        suggestions: ['Keep the momentum going!', 'Set a new streak goal']
      });
    }

    // Time-based insights
    const avgTimePerQuestion = userProgress.totalQuestions > 0
      ? userProgress.timeSpent / userProgress.totalQuestions
      : 0;

    if (avgTimePerQuestion > 60000) { // More than 1 minute per question
      insights.push({
        type: 'recommendation',
        title: 'Speed Up Practice',
        description: 'Try to answer questions more quickly to build fluency.',
        data: { avgTime: avgTimePerQuestion },
        priority: 'low',
        actionable: true,
        suggestions: [
          'Set a timer for each question',
          'Trust your first instinct more',
          'Practice pattern recognition'
        ]
      });
    }

    return insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Adaptive Difficulty Recommendation
  getRecommendedDifficulty(userId: string, category: string): number {
    const skillKey = `${userId}_${category}`;
    const assessment = this.skillAssessments.get(skillKey);

    if (!assessment) {
      return 0.3; // Start with easy questions for new categories
    }

    // Adjust difficulty based on proficiency and recent performance
    let targetDifficulty = assessment.proficiencyLevel;

    // Increase difficulty if user is doing well
    if (assessment.trend === 'improving' && assessment.proficiencyLevel > 0.7) {
      targetDifficulty = Math.min(0.9, targetDifficulty + 0.1);
    }

    // Decrease difficulty if user is struggling
    if (assessment.trend === 'declining' || assessment.proficiencyLevel < 0.5) {
      targetDifficulty = Math.max(0.2, targetDifficulty - 0.1);
    }

    return targetDifficulty;
  }

  // Helper Methods
  private getCutoffDate(timeframe: 'week' | 'month' | 'all'): Date {
    const now = new Date();
    switch (timeframe) {
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case 'all':
        return new Date(0);
      default:
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
  }

  private calculateSkillPerformance(attempts: QuestionAttempt[]): Record<string, number> {
    const skillScores: Record<string, number[]> = {};

    attempts.forEach(attempt => {
      if (!skillScores[attempt.category]) {
        skillScores[attempt.category] = [];
      }
      skillScores[attempt.category].push(attempt.score);
    });

    const skillPerformance: Record<string, number> = {};
    Object.entries(skillScores).forEach(([skill, scores]) => {
      skillPerformance[skill] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    });

    return skillPerformance;
  }

  private calculateLevelProgress(attempts: QuestionAttempt[]): Record<string, number> {
    const levelProgress: Record<string, { total: number; correct: number }> = {};

    attempts.forEach(attempt => {
      const levelKey = `level_${attempt.level}`;
      if (!levelProgress[levelKey]) {
        levelProgress[levelKey] = { total: 0, correct: 0 };
      }
      levelProgress[levelKey].total++;
      if (attempt.isCorrect) {
        levelProgress[levelKey].correct++;
      }
    });

    const result: Record<string, number> = {};
    Object.entries(levelProgress).forEach(([level, data]) => {
      result[level] = data.total > 0 ? data.correct / data.total : 0;
    });

    return result;
  }

  private calculateRecentTrends(attempts: QuestionAttempt[], days: number): Array<{ date: string; accuracy: number; questions: number }> {
    const trends: Array<{ date: string; accuracy: number; questions: number }> = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];

      const dayAttempts = attempts.filter(a => {
        const attemptDate = a.timestamp.toISOString().split('T')[0];
        return attemptDate === dateStr;
      });

      const questions = dayAttempts.length;
      const correct = dayAttempts.filter(a => a.isCorrect).length;
      const accuracy = questions > 0 ? correct / questions : 0;

      trends.push({ date: dateStr, accuracy, questions });
    }

    return trends;
  }

  private calculateStreakDays(userId: string): number {
    const userSessions = Array.from(this.sessions.values())
      .filter(s => s.userId === userId && s.endTime)
      .sort((a, b) => (b.startTime?.getTime() || 0) - (a.startTime?.getTime() || 0));

    if (userSessions.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const session of userSessions) {
      const sessionDate = new Date(session.startTime);
      sessionDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (24 * 60 * 60 * 1000));

      if (daysDiff === streak) {
        streak++;
        currentDate.setTime(currentDate.getTime() - 24 * 60 * 60 * 1000);
      } else if (daysDiff > streak) {
        break;
      }
    }

    return streak;
  }

  // Data Export Methods
  exportUserData(userId: string): {
    sessions: UserSession[];
    attempts: QuestionAttempt[];
    skills: SkillAssessment[];
    metrics: LearningMetric[];
    insights: LearningInsight[];
  } {
    return {
      sessions: Array.from(this.sessions.values()).filter(s => s.userId === userId),
      attempts: this.attempts.filter(a => a.userId === userId),
      skills: Array.from(this.skillAssessments.values()).filter(s => s.userId === userId),
      metrics: this.metrics.filter(m => m.userId === userId),
      insights: this.generateLearningInsights(userId)
    };
  }

  // Aggregate Statistics for Teachers/Admins
  getClassroomAnalytics(userIds: string[]): {
    totalStudents: number;
    averageAccuracy: number;
    mostPopularCategories: string[];
    strugglingStudents: string[];
    topPerformers: string[];
    dailyEngagement: Array<{ date: string; activeUsers: number; questionsAnswered: number }>;
  } {
    const allAttempts = this.attempts.filter(a => userIds.includes(a.userId));

    // Calculate metrics
    const totalStudents = userIds.length;
    const averageAccuracy = allAttempts.length > 0
      ? allAttempts.filter(a => a.isCorrect).length / allAttempts.length
      : 0;

    // Most popular categories
    const categoryCount: Record<string, number> = {};
    allAttempts.forEach(a => {
      categoryCount[a.category] = (categoryCount[a.category] || 0) + 1;
    });
    const mostPopularCategories = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category]) => category);

    // Student performance analysis
    const studentPerformance = userIds.map(userId => {
      const userAttempts = allAttempts.filter(a => a.userId === userId);
      const accuracy = userAttempts.length > 0
        ? userAttempts.filter(a => a.isCorrect).length / userAttempts.length
        : 0;
      return { userId, accuracy, attempts: userAttempts.length };
    });

    const strugglingStudents = studentPerformance
      .filter(s => s.accuracy < 0.6 && s.attempts >= 5)
      .map(s => s.userId);

    const topPerformers = studentPerformance
      .filter(s => s.accuracy >= 0.8 && s.attempts >= 10)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 5)
      .map(s => s.userId);

    // Daily engagement (last 30 days)
    const dailyEngagement = this.calculateDailyEngagement(userIds, 30);

    return {
      totalStudents,
      averageAccuracy,
      mostPopularCategories,
      strugglingStudents,
      topPerformers,
      dailyEngagement
    };
  }

  private calculateDailyEngagement(userIds: string[], days: number): Array<{ date: string; activeUsers: number; questionsAnswered: number }> {
    const engagement: Array<{ date: string; activeUsers: number; questionsAnswered: number }> = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];

      const dayAttempts = this.attempts.filter(a => {
        const attemptDate = a.timestamp.toISOString().split('T')[0];
        return attemptDate === dateStr && userIds.includes(a.userId);
      });

      const activeUsers = new Set(dayAttempts.map(a => a.userId)).size;
      const questionsAnswered = dayAttempts.length;

      engagement.push({ date: dateStr, activeUsers, questionsAnswered });
    }

    return engagement;
  }
}

// Singleton instance
export const analyticsEngine = new AnalyticsEngine();