'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Home, Zap, Clock, Target, Star, Trophy } from 'lucide-react'
import { getRandomQuestions, validateQuestionAnswer } from '@/data/question-bank'

export default function QuickMatchPage() {
  const router = useRouter()
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [questions, setQuestions] = useState<{ question: string; correctAnswer: string; type: string }[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60) // 60 seconds
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)

  const [userStats, setUserStats] = useState({
    points: 180,
    streak: 3,
    correctAnswers: 11
  })

  useEffect(() => {
    const savedStats = localStorage.getItem('userStats')
    if (savedStats) {
      setUserStats(JSON.parse(savedStats))
    }
  }, [])

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0 && gameState === 'playing') {
      finishGame()
    }
    return () => clearTimeout(timer)
  }, [timeLeft, gameState])

  const startGame = (difficulty: 'easy' | 'medium' | 'hard') => {
    const difficultyMap = {
      easy: 'beginner',
      medium: 'elementary',
      hard: 'intermediate'
    }

    const gameQuestions = getRandomQuestions(10, {
      difficulty: difficultyMap[difficulty],
      maxDifficulty: difficulty === 'easy' ? 0.4 : difficulty === 'medium' ? 0.6 : 0.8
    })

    setQuestions(gameQuestions)
    setGameState('playing')
    setCurrentQuestion(0)
    setScore(0)
    setTimeLeft(60)
    setAnswers([])
    setUserAnswer('')
    setFeedback('')
    setShowFeedback(false)
  }

  const submitAnswer = () => {
    if (!userAnswer.trim()) return

    const question = questions[currentQuestion]
    const validation = validateQuestionAnswer(question, userAnswer)

    setAnswers([...answers, userAnswer])
    setFeedback(validation.feedback)
    setShowFeedback(true)

    if (validation.isCorrect) {
      const points = Math.round(validation.score * 10)
      setScore(score + points)
    }

    // Auto advance after showing feedback
    setTimeout(() => {
      nextQuestion()
    }, 2000)
  }

  const nextQuestion = () => {
    setShowFeedback(false)
    setUserAnswer('')

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      finishGame()
    }
  }

  const finishGame = () => {
    setGameState('finished')

    // Update user stats
    const correctAnswers = answers.filter((answer, index) => {
      const question = questions[index]
      return question && validateQuestionAnswer(question, answer).isCorrect
    }).length

    const newStats = {
      ...userStats,
      points: userStats.points + score,
      correctAnswers: userStats.correctAnswers + correctAnswers
    }

    setUserStats(newStats)
    localStorage.setItem('userStats', JSON.stringify(newStats))
  }

  const resetGame = () => {
    setGameState('menu')
    setCurrentQuestion(0)
    setQuestions([])
    setAnswers([])
    setScore(0)
    setTimeLeft(60)
    setUserAnswer('')
    setFeedback('')
    setShowFeedback(false)
  }

  const renderQuestion = () => {
    const question = questions[currentQuestion]
    if (!question) return null

    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">{question.instruction}</h3>
          {question.prompt && (
            <p className="text-lg text-gray-700 mb-4">{question.prompt}</p>
          )}
        </div>

        {question.type === 'multiple-choice' && question.options ? (
          <div className="grid grid-cols-1 gap-3">
            {question.options.map((option: string, index: number) => (
              <Button
                key={index}
                variant={userAnswer === option ? "default" : "outline"}
                onClick={() => setUserAnswer(option)}
                className="text-left justify-start p-4 h-auto"
              >
                <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            ))}
          </div>
        ) : question.type === 'fill-in-blank' ? (
          <div className="space-y-4">
            <p className="text-lg text-center">
              {question.sentence?.replace('[blank]', '_____')}
            </p>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
              className="w-full p-3 border border-gray-300 rounded-lg text-center text-lg"
              placeholder="Type your answer..."
              autoFocus
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {question.availableWords?.map((word: string, index: number) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => setUserAnswer(userAnswer + (userAnswer ? ' ' : '') + word)}
                  className="text-sm"
                >
                  {word}
                </Button>
              ))}
            </div>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
              className="w-full p-3 border border-gray-300 rounded-lg text-center text-lg"
              placeholder="Build your sentence..."
            />
          </div>
        )}

        <div className="text-center">
          <Button
            onClick={submitAnswer}
            disabled={!userAnswer.trim() || showFeedback}
            className="bg-green-600 hover:bg-green-700"
          >
            Submit Answer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <Card className="border-2 border-blue-200 bg-white/80 backdrop-blur">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/')}
                  className="flex items-center space-x-2 bg-white/80"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="flex items-center space-x-1 bg-yellow-100 text-yellow-800">
                  <Trophy className="w-4 h-4" />
                  <span>{userStats.points} XP</span>
                </Badge>
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                <Zap className="w-8 h-8 inline-block mr-2" />
                Quick Match
              </h1>
              <p className="text-gray-600">Fast-paced grammar practice!</p>
            </div>
          </div>
        </Card>

        {/* Game Menu */}
        {gameState === 'menu' && (
          <Card className="p-8 bg-white/80 backdrop-blur">
            <div className="text-center space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Choose Your Challenge</h2>
                <p className="text-gray-600 mb-6">
                  Answer as many questions as you can in 60 seconds!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => startGame('easy')}
                  className="p-6 h-auto flex-col bg-green-500 hover:bg-green-600"
                >
                  <Target className="w-8 h-8 mb-2" />
                  <span className="text-lg font-bold">Easy</span>
                  <span className="text-sm">Beginner friendly</span>
                </Button>

                <Button
                  onClick={() => startGame('medium')}
                  className="p-6 h-auto flex-col bg-yellow-500 hover:bg-yellow-600"
                >
                  <Star className="w-8 h-8 mb-2" />
                  <span className="text-lg font-bold">Medium</span>
                  <span className="text-sm">Balanced challenge</span>
                </Button>

                <Button
                  onClick={() => startGame('hard')}
                  className="p-6 h-auto flex-col bg-red-500 hover:bg-red-600"
                >
                  <Zap className="w-8 h-8 mb-2" />
                  <span className="text-lg font-bold">Hard</span>
                  <span className="text-sm">Expert level</span>
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Game Playing */}
        {gameState === 'playing' && (
          <>
            {/* Game Status */}
            <Card className="p-4 bg-white/80 backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{timeLeft}s</span>
                  </Badge>
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <Target className="w-4 h-4" />
                    <span>{currentQuestion + 1}/{questions.length}</span>
                  </Badge>
                </div>
                <Badge variant="secondary" className="flex items-center space-x-1 bg-yellow-100 text-yellow-800">
                  <Trophy className="w-4 h-4" />
                  <span>{score} pts</span>
                </Badge>
              </div>
              <Progress
                value={((currentQuestion + 1) / questions.length) * 100}
                className="mt-3 h-2"
              />
            </Card>

            {/* Current Question */}
            <Card className="p-6 bg-white/80 backdrop-blur">
              {renderQuestion()}
            </Card>

            {/* Feedback */}
            {showFeedback && (
              <Card className={`p-4 ${
                feedback.includes('Perfect') || feedback.includes('Correct')
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className="text-center font-medium">{feedback}</p>
              </Card>
            )}
          </>
        )}

        {/* Game Finished */}
        {gameState === 'finished' && (
          <Card className="p-8 bg-white/80 backdrop-blur">
            <div className="text-center space-y-6">
              <div>
                <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
                <h2 className="text-3xl font-bold mb-2">Game Complete!</h2>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-blue-600">{score}</div>
                  <div className="text-gray-600">Points Earned</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {answers.filter((answer, index) => {
                      const question = questions[index]
                      return question && validateQuestionAnswer(question, answer).isCorrect
                    }).length}
                  </div>
                  <div className="text-gray-600">Correct Answers</div>
                </div>
              </div>

              <div className="space-x-4">
                <Button
                  onClick={resetGame}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Play Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}