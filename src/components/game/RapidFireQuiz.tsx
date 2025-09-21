'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { X, Clock, Zap, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { UserStats } from '@/data/types';

interface RapidFireQuizProps {
  currentLevel: number;
  userStats: UserStats = { points: 0, completedLevels: [], totalPoints: 0, currentStreak: 0, totalSentences: 0, unlockedBadges: [], levelsAttempted: [], perfectSentences: 0 };
  onClose: () => void;
  onUpdateStats: (stats: UserStats) => void;
}

export const RapidFireQuiz: React.FC<RapidFireQuizProps> = ({
  currentLevel,
  userStats,
  onClose,
  onUpdateStats
}) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Sample quiz questions (in a real app, these would come from a database)
  const quizQuestions = [
    {
      question: "What is the correct form of 'be' for 'he'?",
      options: ["am", "is", "are", "be"],
      correct: "is"
    },
    {
      question: "Which auxiliary verb is used with 'I, you, we, they'?",
      options: ["does", "do", "is", "are"],
      correct: "do"
    },
    {
      question: "What is the past form of 'go'?",
      options: ["goed", "went", "gone", "goes"],
      correct: "went"
    },
    {
      question: "Which article is used before 'apple'?",
      options: ["a", "an", "the", "no article"],
      correct: "an"
    },
    {
      question: "What is the present perfect form of 'eat'?",
      options: ["eated", "ate", "eaten", "eating"],
      correct: "eaten"
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startQuiz = () => {
    setIsActive(true);
    setTimeLeft(60);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    const correct = answer === quizQuestions[currentQuestion].correct;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setIsActive(false);
        // Update user stats
        const newStats = {
          ...userStats,
          points: userStats.points + (score + (correct ? 1 : 0)) * 10,
          totalSentences: userStats.totalSentences + quizQuestions.length
        };
        onUpdateStats(newStats);
      }
    }, 2000);
  };

  const getScoreColor = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 80) return 'Excellent! 🎉';
    if (percentage >= 60) return 'Good job! 👍';
    return 'Keep practicing! 💪';
  };

  if (!isActive && timeLeft === 60) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-2xl font-bold flex items-center space-x-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              <span>Rapid Fire Quiz</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl">⚡</div>
              <h2 className="text-2xl font-bold">Test Your Speed!</h2>
              <p className="text-gray-600">
                Answer as many grammar questions as you can in 60 seconds. 
                Each correct answer gives you 10 points!
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{quizQuestions.length}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">60s</div>
                <div className="text-sm text-gray-600">Time Limit</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">10</div>
                <div className="text-sm text-gray-600">Points Each</div>
              </div>
            </div>
            
            <Button onClick={startQuiz} className="w-full" size="lg">
              <Zap className="w-5 h-5 mr-2" />
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isActive && timeLeft < 60) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-2xl font-bold flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <span>Quiz Complete!</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl">🎉</div>
              <h2 className={`text-3xl font-bold ${getScoreColor()}`}>
                {score}/{quizQuestions.length}
              </h2>
              <p className="text-xl">{getScoreMessage()}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{score * 10}</div>
                <div className="text-sm text-gray-600">Points Earned</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round((score / quizQuestions.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button onClick={startQuiz} className="flex-1">
                Try Again
              </Button>
              <Button onClick={onClose} variant="outline" className="flex-1">
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-red-500" />
              <span className="text-lg font-bold text-red-500">{timeLeft}s</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{currentQuestion + 1}/{quizQuestions.length}</span>
            </div>
            <Progress value={((currentQuestion + 1) / quizQuestions.length) * 100} className="h-2" />
          </div>
          
          {/* Question */}
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold">
              {quizQuestions[currentQuestion].question}
            </h2>
            
            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-3">
              {quizQuestions[currentQuestion].options.map((option, index) => {
                let buttonClass = "w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors";
                
                if (showResult) {
                  if (option === quizQuestions[currentQuestion].correct) {
                    buttonClass += " bg-green-100 border-green-300 text-green-800";
                  } else if (selectedAnswer === option && option !== quizQuestions[currentQuestion].correct) {
                    buttonClass += " bg-red-100 border-red-300 text-red-800";
                  } else {
                    buttonClass += " bg-gray-100 border-gray-300 text-gray-500";
                  }
                } else if (selectedAnswer === option) {
                  buttonClass += " bg-blue-100 border-blue-300 text-blue-800";
                }
                
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className={buttonClass}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showResult}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                      {showResult && option === quizQuestions[currentQuestion].correct && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {showResult && selectedAnswer === option && option !== quizQuestions[currentQuestion].correct && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
          
          {/* Score Display */}
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">Score: {score}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
