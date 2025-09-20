import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Timer, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Zap, 
  Trophy,
  Target,
  Clock,
  Star,
  ArrowRight
} from 'lucide-react'

// Quiz question generator
export const generateQuizQuestions = (level, verbDatabase, objectDatabase) => {
  const questions = []
  
  // Generate 5-10 questions per level
  const questionCount = Math.min(10, Math.max(5, level))
  
  for (let i = 0; i < questionCount; i++) {
    let question
    
    if (level <= 5) {
      // Basic levels: Simple affirmative sentences
      question = generateBasicQuestion(verbDatabase, objectDatabase)
    } else if (level <= 10) {
      // Elementary levels: Questions and negatives
      question = generateElementaryQuestion(verbDatabase, objectDatabase)
    } else if (level <= 15) {
      // Intermediate levels: Past tense and future
      question = generateIntermediateQuestion(verbDatabase, objectDatabase)
    } else {
      // Advanced levels: Complex tenses
      question = generateAdvancedQuestion(verbDatabase, objectDatabase)
    }
    
    if (question) {
      questions.push({
        id: i + 1,
        ...question,
        timeLimit: getTimeLimit(level),
        points: getQuestionPoints(level)
      })
    }
  }
  
  return questions
}

// Generate basic affirmative questions
function generateBasicQuestion(verbDatabase, objectDatabase) {
  const subjects = ['I', 'You', 'He', 'She', 'We', 'They', 'The cat', 'My friend']
  const subject = subjects[Math.floor(Math.random() * subjects.length)]
  const verb = verbDatabase[Math.floor(Math.random() * Math.min(10, verbDatabase.length))]
  const obj = objectDatabase[Math.floor(Math.random() * Math.min(10, objectDatabase.length))]
  
  // Determine correct verb form
  const needsThirdPerson = ['He', 'She', 'The cat', 'My friend'].includes(subject)
  const correctVerb = needsThirdPerson ? verb['V1-3rd'] : verb.V1
  
  // Create correct sentence
  const correctSentence = `${subject} ${correctVerb} ${obj.singular}`
  
  // Create scrambled cards (no labels!)
  const scrambledCards = [
    { word: subject, correctPosition: 0 },
    { word: correctVerb, correctPosition: 1 },
    { word: obj.singular, correctPosition: 2 }
  ].sort(() => Math.random() - 0.5) // Scramble the order
  
  return {
    type: 'basic_affirmative',
    instruction: 'Arrange these words to make a correct sentence:',
    scrambledCards,
    correctSentence,
    correctOrder: [subject, correctVerb, obj.singular],
    grammarFocus: needsThirdPerson ? 'V1-3rd form with third person' : 'V1 form',
    hint: `Remember: ${needsThirdPerson ? 'He/She needs V1-3rd' : 'I/You/We/They use V1'}`
  }
}

// Generate elementary questions (negatives, questions)
function generateElementaryQuestion(verbDatabase, objectDatabase) {
  const questionTypes = ['negative', 'yes_no_question', 'wh_question']
  const type = questionTypes[Math.floor(Math.random() * questionTypes.length)]
  
  const subjects = ['I', 'You', 'He', 'She', 'We', 'They']
  const subject = subjects[Math.floor(Math.random() * subjects.length)]
  const verb = verbDatabase[Math.floor(Math.random() * Math.min(15, verbDatabase.length))]
  const obj = objectDatabase[Math.floor(Math.random() * Math.min(15, objectDatabase.length))]
  
  if (type === 'negative') {
    const helper = ['He', 'She'].includes(subject) ? "doesn't" : "don't"
    const correctSentence = `${subject} ${helper} ${verb.V1} ${obj.singular}`
    
    const scrambledCards = [
      { word: subject, correctPosition: 0 },
      { word: helper, correctPosition: 1 },
      { word: verb.V1, correctPosition: 2 },
      { word: obj.singular, correctPosition: 3 }
    ].sort(() => Math.random() - 0.5)
    
    return {
      type: 'negative',
      instruction: 'Make a negative sentence:',
      scrambledCards,
      correctSentence,
      correctOrder: [subject, helper, verb.V1, obj.singular],
      grammarFocus: 'Negative with do/does + not',
      hint: `Use ${helper} with ${subject}`
    }
  } else if (type === 'yes_no_question') {
    const helper = ['He', 'She'].includes(subject) ? 'Does' : 'Do'
    const correctSentence = `${helper} ${subject.toLowerCase()} ${verb.V1} ${obj.singular}?`
    
    const scrambledCards = [
      { word: helper, correctPosition: 0 },
      { word: subject.toLowerCase(), correctPosition: 1 },
      { word: verb.V1, correctPosition: 2 },
      { word: obj.singular, correctPosition: 3 },
      { word: '?', correctPosition: 4 }
    ].sort(() => Math.random() - 0.5)
    
    return {
      type: 'yes_no_question',
      instruction: 'Make a yes/no question:',
      scrambledCards,
      correctSentence,
      correctOrder: [helper, subject.toLowerCase(), verb.V1, obj.singular, '?'],
      grammarFocus: 'Questions with Do/Does',
      hint: `Start with ${helper}`
    }
  } else {
    // Wh-question
    const whWords = ['What', 'Where', 'When', 'Why', 'How']
    const whWord = whWords[Math.floor(Math.random() * whWords.length)]
    const helper = ['He', 'She'].includes(subject) ? 'does' : 'do'
    const correctSentence = `${whWord} ${helper} ${subject.toLowerCase()} ${verb.V1}?`
    
    const scrambledCards = [
      { word: whWord, correctPosition: 0 },
      { word: helper, correctPosition: 1 },
      { word: subject.toLowerCase(), correctPosition: 2 },
      { word: verb.V1, correctPosition: 3 },
      { word: '?', correctPosition: 4 }
    ].sort(() => Math.random() - 0.5)
    
    return {
      type: 'wh_question',
      instruction: 'Make a wh-question:',
      scrambledCards,
      correctSentence,
      correctOrder: [whWord, helper, subject.toLowerCase(), verb.V1, '?'],
      grammarFocus: 'Wh-questions',
      hint: `Start with ${whWord}`
    }
  }
}

// Generate intermediate questions (past tense)
function generateIntermediateQuestion(verbDatabase, objectDatabase) {
  const subjects = ['I', 'You', 'He', 'She', 'We', 'They']
  const subject = subjects[Math.floor(Math.random() * subjects.length)]
  const verb = verbDatabase[Math.floor(Math.random() * Math.min(20, verbDatabase.length))]
  const obj = objectDatabase[Math.floor(Math.random() * Math.min(20, objectDatabase.length))]
  
  const timeWords = ['yesterday', 'last week', 'last month', 'last year', 'ago']
  const timeWord = timeWords[Math.floor(Math.random() * timeWords.length)]
  
  const correctSentence = `${subject} ${verb.V2} ${obj.singular} ${timeWord}`
  
  const scrambledCards = [
    { word: subject, correctPosition: 0 },
    { word: verb.V2, correctPosition: 1 },
    { word: obj.singular, correctPosition: 2 },
    { word: timeWord, correctPosition: 3 }
  ].sort(() => Math.random() - 0.5)
  
  return {
    type: 'past_simple',
    instruction: 'Make a past tense sentence:',
    scrambledCards,
    correctSentence,
    correctOrder: [subject, verb.V2, obj.singular, timeWord],
    grammarFocus: 'Past simple with V2',
    hint: `Use V2 form: ${verb.V2}`
  }
}

// Generate advanced questions (complex tenses)
function generateAdvancedQuestion(verbDatabase, objectDatabase) {
  const subjects = ['I', 'You', 'He', 'She', 'We', 'They']
  const subject = subjects[Math.floor(Math.random() * subjects.length)]
  const verb = verbDatabase[Math.floor(Math.random() * Math.min(25, verbDatabase.length))]
  const obj = objectDatabase[Math.floor(Math.random() * Math.min(25, objectDatabase.length))]
  
  const tenseTypes = ['present_continuous', 'present_perfect', 'future_will']
  const tenseType = tenseTypes[Math.floor(Math.random() * tenseTypes.length)]
  
  if (tenseType === 'present_continuous') {
    const beVerb = subject === 'I' ? 'am' : ['He', 'She'].includes(subject) ? 'is' : 'are'
    const correctSentence = `${subject} ${beVerb} ${verb['V1-ing']} ${obj.singular} now`
    
    const scrambledCards = [
      { word: subject, correctPosition: 0 },
      { word: beVerb, correctPosition: 1 },
      { word: verb['V1-ing'], correctPosition: 2 },
      { word: obj.singular, correctPosition: 3 },
      { word: 'now', correctPosition: 4 }
    ].sort(() => Math.random() - 0.5)
    
    return {
      type: 'present_continuous',
      instruction: 'Make a present continuous sentence:',
      scrambledCards,
      correctSentence,
      correctOrder: [subject, beVerb, verb['V1-ing'], obj.singular, 'now'],
      grammarFocus: 'Present continuous: be + V1-ing',
      hint: `Use ${beVerb} + ${verb['V1-ing']}`
    }
  } else if (tenseType === 'present_perfect') {
    const haveVerb = ['He', 'She'].includes(subject) ? 'has' : 'have'
    const correctSentence = `${subject} ${haveVerb} ${verb.V3} ${obj.singular} before`
    
    const scrambledCards = [
      { word: subject, correctPosition: 0 },
      { word: haveVerb, correctPosition: 1 },
      { word: verb.V3, correctPosition: 2 },
      { word: obj.singular, correctPosition: 3 },
      { word: 'before', correctPosition: 4 }
    ].sort(() => Math.random() - 0.5)
    
    return {
      type: 'present_perfect',
      instruction: 'Make a present perfect sentence:',
      scrambledCards,
      correctSentence,
      correctOrder: [subject, haveVerb, verb.V3, obj.singular, 'before'],
      grammarFocus: 'Present perfect: have/has + V3',
      hint: `Use ${haveVerb} + ${verb.V3}`
    }
  } else {
    // Future with will
    const correctSentence = `${subject} will ${verb.V1} ${obj.singular} tomorrow`
    
    const scrambledCards = [
      { word: subject, correctPosition: 0 },
      { word: 'will', correctPosition: 1 },
      { word: verb.V1, correctPosition: 2 },
      { word: obj.singular, correctPosition: 3 },
      { word: 'tomorrow', correctPosition: 4 }
    ].sort(() => Math.random() - 0.5)
    
    return {
      type: 'future_will',
      instruction: 'Make a future sentence with "will":',
      scrambledCards,
      correctSentence,
      correctOrder: [subject, 'will', verb.V1, obj.singular, 'tomorrow'],
      grammarFocus: 'Future: will + V1',
      hint: 'Use will + V1 form'
    }
  }
}

// Helper functions
function getTimeLimit(level) {
  if (level <= 5) return 30 // 30 seconds for basic
  if (level <= 10) return 25 // 25 seconds for elementary
  if (level <= 15) return 20 // 20 seconds for intermediate
  return 15 // 15 seconds for advanced
}

function getQuestionPoints(level) {
  return Math.max(10, level * 5) // More points for higher levels
}

// Main Rapid Fire Quiz Component
export function RapidFireQuiz({ 
  level, 
  verbDatabase, 
  objectDatabase, 
  onComplete, 
  onClose 
}) {
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState([])
  const [timeLeft, setTimeLeft] = useState(30)
  const [score, setScore] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [results, setResults] = useState([])
  const [quizStarted, setQuizStarted] = useState(false)
  
  const timerRef = useRef(null)
  
  // Initialize quiz
  useEffect(() => {
    const quizQuestions = generateQuizQuestions(level, verbDatabase, objectDatabase)
    setQuestions(quizQuestions)
  }, [level, verbDatabase, objectDatabase])
  
  // Timer effect
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleTimeUp()
    }
    
    return () => clearTimeout(timerRef.current)
  }, [isActive, timeLeft])
  
  const currentQuestion = questions[currentQuestionIndex]
  
  const startQuiz = () => {
    setQuizStarted(true)
    setIsActive(true)
    if (currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit)
    }
  }
  
  const handleCardClick = (card) => {
    if (!isActive || showResult) return
    
    // Add card to user answer
    setUserAnswer([...userAnswer, card])
  }
  
  const removeCard = (index) => {
    if (!isActive || showResult) return
    
    const newAnswer = userAnswer.filter((_, i) => i !== index)
    setUserAnswer(newAnswer)
  }
  
  const submitAnswer = () => {
    if (!isActive || !currentQuestion) return
    
    const userSentence = userAnswer.map(card => card.word).join(' ')
    const isCorrect = userSentence === currentQuestion.correctSentence
    
    const result = {
      questionId: currentQuestion.id,
      userAnswer: userSentence,
      correctAnswer: currentQuestion.correctSentence,
      isCorrect,
      timeUsed: currentQuestion.timeLimit - timeLeft,
      pointsEarned: isCorrect ? currentQuestion.points : 0
    }
    
    setResults([...results, result])
    
    if (isCorrect) {
      setScore(score + currentQuestion.points)
    }
    
    setShowResult(true)
    setIsActive(false)
    
    // Auto advance after 2 seconds
    setTimeout(() => {
      nextQuestion()
    }, 2000)
  }
  
  const handleTimeUp = () => {
    if (!currentQuestion) return
    
    const result = {
      questionId: currentQuestion.id,
      userAnswer: userAnswer.map(card => card.word).join(' '),
      correctAnswer: currentQuestion.correctSentence,
      isCorrect: false,
      timeUsed: currentQuestion.timeLimit,
      pointsEarned: 0
    }
    
    setResults([...results, result])
    setShowResult(true)
    setIsActive(false)
    
    setTimeout(() => {
      nextQuestion()
    }, 2000)
  }
  
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setUserAnswer([])
      setShowResult(false)
      setIsActive(true)
      setTimeLeft(questions[currentQuestionIndex + 1].timeLimit)
    } else {
      // Quiz complete
      completeQuiz()
    }
  }
  
  const completeQuiz = () => {
    const totalQuestions = questions.length
    const correctAnswers = results.filter(r => r.isCorrect).length
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100)
    const averageTime = Math.round(
      results.reduce((sum, r) => sum + r.timeUsed, 0) / totalQuestions
    )
    
    const finalResults = {
      level,
      totalQuestions,
      correctAnswers,
      accuracy,
      totalScore: score,
      averageTime,
      results
    }
    
    onComplete(finalResults)
  }
  
  const resetQuiz = () => {
    setCurrentQuestionIndex(0)
    setUserAnswer([])
    setTimeLeft(30)
    setScore(0)
    setIsActive(false)
    setShowResult(false)
    setResults([])
    setQuizStarted(false)
  }
  
  if (!quizStarted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Zap className="w-6 h-6 text-yellow-500" />
            Rapid Fire Quiz
            <Zap className="w-6 h-6 text-yellow-500" />
          </CardTitle>
          <p className="text-gray-600">
            Level {level} Challenge - Arrange scrambled words into correct sentences!
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span>{questions.length} Questions</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>{getTimeLimit(level)}s per question</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>Up to {getQuestionPoints(level)} points each</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-purple-500" />
              <span>Build fluency fast!</span>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">How to Play:</h3>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
              <li>• Click word cards to build your sentence</li>
              <li>• Cards have NO labels - use your grammar knowledge!</li>
              <li>• Work fast - you have limited time per question</li>
              <li>• Click "Submit" when your sentence is complete</li>
            </ul>
          </div>
          
          <Button onClick={startQuiz} className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3">
            <Zap className="w-5 h-5 mr-2" />
            Start Quiz!
          </Button>
        </CardContent>
      </Card>
    )
  }
  
  if (!currentQuestion) {
    return <div>Loading...</div>
  }
  
  const availableCards = currentQuestion.scrambledCards.filter(
    card => !userAnswer.find(ua => ua.word === card.word)
  )
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Question {currentQuestionIndex + 1} of {questions.length}
          </CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              {score} points
            </Badge>
            <Badge 
              variant={timeLeft <= 5 ? "destructive" : "secondary"}
              className="flex items-center gap-1"
            >
              <Timer className="w-3 h-3" />
              {timeLeft}s
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Instruction */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {currentQuestion.instruction}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Grammar Focus: {currentQuestion.grammarFocus}
          </p>
        </div>
        
        {/* User's sentence building area */}
        <div className="min-h-16 border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Your Sentence:</h4>
          {userAnswer.length === 0 ? (
            <p className="text-gray-500 text-center">Click cards below to build your sentence...</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {userAnswer.map((card, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-sm px-3 py-2 cursor-pointer hover:bg-red-100 border-2"
                  onClick={() => removeCard(index)}
                >
                  {card.word}
                  <XCircle className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        {/* Available cards (scrambled, no labels!) */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Available Words:</h4>
          <div className="flex flex-wrap gap-2 justify-center">
            {availableCards.map((card, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleCardClick(card)}
                className="text-sm px-4 py-2 border-2 hover:bg-blue-50 hover:border-blue-300"
                disabled={!isActive || showResult}
              >
                {card.word}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={submitAnswer}
            disabled={userAnswer.length === 0 || !isActive || showResult}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Submit Answer
          </Button>
          
          <Button
            onClick={() => setUserAnswer([])}
            variant="outline"
            disabled={userAnswer.length === 0 || !isActive || showResult}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
        
        {/* Result feedback */}
        {showResult && (
          <div className={`p-4 rounded-lg text-center ${
            results[results.length - 1]?.isCorrect 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              {results[results.length - 1]?.isCorrect ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span className="font-semibold">
                {results[results.length - 1]?.isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            
            <p className="text-sm">
              <strong>Correct answer:</strong> {currentQuestion.correctSentence}
            </p>
            
            {!results[results.length - 1]?.isCorrect && (
              <p className="text-xs mt-1">
                <strong>Hint:</strong> {currentQuestion.hint}
              </p>
            )}
            
            {currentQuestionIndex < questions.length - 1 && (
              <p className="text-xs mt-2 flex items-center justify-center gap-1">
                Next question in 2 seconds... <ArrowRight className="w-3 h-3" />
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

