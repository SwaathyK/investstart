'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle2, Star, Trophy, Zap, ChevronRight, ChevronLeft, Award, Target, Sparkles, Clock, SkipForward } from 'lucide-react'
import { type Module, type Topic } from '@/data/courses'

interface ModuleLearningModalProps {
  module: Module | null
  isOpen: boolean
  onClose: () => void
  onComplete: (moduleId: number) => void
}

type QuestionType = 'multiple-choice' | 'multiple-answer' | 'matching'

interface QuizQuestion {
  type: QuestionType
  question: string
  options: string[]
  correctAnswer: number | number[] | Record<string, string> // Single answer, multiple answers, or matching pairs
  explanation: string
  // For matching questions
  leftColumn?: string[]
  rightColumn?: string[]
}

// Generate quiz questions based on module topics (up to 5 topics)
const generateQuizQuestions = (module: Module): QuizQuestion[] => {
  const questions: QuizQuestion[] = []
  const topics = module.topics.slice(0, 5) // Use first 5 topics
  
  if (topics.length === 0) return questions
  
  // Generate questions based on topics with different types
  topics.forEach((topic, index) => {
    const questionType = index % 3 // Rotate through question types
    
    if (questionType === 0) {
      // Multiple Choice Question
      questions.push({
        type: 'multiple-choice',
        question: `Which of the following best describes "${topic.title}"?`,
        options: [
          `A key concept in ${module.title.toLowerCase()} that requires understanding`,
          'An advanced technique only for experts',
          'Something optional that can be skipped',
          'Only relevant in specific market conditions'
        ],
        correctAnswer: 0,
        explanation: `${topic.title} is an important topic in this module. Understanding it will help you ${module.outcome.toLowerCase()}`
      })
    } else if (questionType === 1) {
      // Multiple Answer Question
      questions.push({
        type: 'multiple-answer',
        question: `Select all that apply regarding "${topic.title}":`,
        options: [
          `It's a fundamental concept in ${module.title.toLowerCase()}`,
          'It requires careful study and practice',
          'It can be ignored without consequences',
          'It helps achieve the module learning outcome',
          'It only applies to advanced investors'
        ],
        correctAnswer: [0, 1, 3], // First, second, and fourth options are correct
        explanation: `${topic.title} is a fundamental concept that requires study and helps you achieve the module's learning outcome.`
      })
    } else {
      // Matching Question
      const matchingPairs = generateMatchingPairs(topic, module)
      if (matchingPairs.leftColumn && matchingPairs.rightColumn) {
        questions.push({
          type: 'matching',
          question: `Match the following concepts related to "${topic.title}":`,
          options: [],
          correctAnswer: matchingPairs.correctMatches,
          explanation: `These matches help you understand the key relationships in ${topic.title}.`,
          leftColumn: matchingPairs.leftColumn,
          rightColumn: matchingPairs.rightColumn
        })
      }
    }
  })
  
  // Ensure we have at least 3 questions, mix of types
  if (questions.length < 3) {
    // Add a multiple choice question
    questions.push({
      type: 'multiple-choice',
      question: `What is the main learning outcome of "${module.title}"?`,
      options: [
        module.outcome,
        'To become an expert trader',
        'To avoid all investment risks',
        'To only invest in stocks'
      ],
      correctAnswer: 0,
      explanation: `The main goal of this module is: ${module.outcome}`
    })
  }
  
  return questions.slice(0, Math.min(8, questions.length)) // Max 8 questions
}

// Generate matching pairs for a topic
const generateMatchingPairs = (topic: Topic, module: Module): {
  leftColumn: string[]
  rightColumn: string[]
  correctMatches: Record<string, string>
} => {
  const topicTitle = topic.title.toLowerCase()
  
  // Common matching patterns based on topic keywords
  if (topicTitle.includes('budget') || topicTitle.includes('finance')) {
    return {
      leftColumn: ['50/30/20 Rule', 'Emergency Fund', 'Net Worth', 'Cash Flow'],
      rightColumn: ['Needs/Wants/Savings Split', '3-6 Months Expenses', 'Assets - Liabilities', 'Income - Expenses'],
      correctMatches: {
        '50/30/20 Rule': 'Needs/Wants/Savings Split',
        'Emergency Fund': '3-6 Months Expenses',
        'Net Worth': 'Assets - Liabilities',
        'Cash Flow': 'Income - Expenses'
      } as Record<string, string>
    }
  } else if (topicTitle.includes('stock') || topicTitle.includes('market')) {
    return {
      leftColumn: ['Stock', 'Market Order', 'Limit Order', 'Dividend'],
      rightColumn: ['Company Ownership', 'Immediate Execution', 'Price-Set Execution', 'Profit Share'],
      correctMatches: {
        'Stock': 'Company Ownership',
        'Market Order': 'Immediate Execution',
        'Limit Order': 'Price-Set Execution',
        'Dividend': 'Profit Share'
      } as Record<string, string>
    }
  } else if (topicTitle.includes('invest') || topicTitle.includes('portfolio')) {
    return {
      leftColumn: ['Index Fund', 'ETF', 'Diversification', 'Asset Allocation'],
      rightColumn: ['Passive Investment', 'Exchange-Traded', 'Risk Reduction', 'Portfolio Mix'],
      correctMatches: {
        'Index Fund': 'Passive Investment',
        'ETF': 'Exchange-Traded',
        'Diversification': 'Risk Reduction',
        'Asset Allocation': 'Portfolio Mix'
      } as Record<string, string>
    }
  } else if (topicTitle.includes('risk') || topicTitle.includes('reward')) {
    return {
      leftColumn: ['High Risk', 'Low Risk', 'Risk Tolerance', 'Risk Management'],
      rightColumn: ['High Potential Return', 'Stable Returns', 'Personal Comfort Level', 'Protection Strategy'],
      correctMatches: {
        'High Risk': 'High Potential Return',
        'Low Risk': 'Stable Returns',
        'Risk Tolerance': 'Personal Comfort Level',
        'Risk Management': 'Protection Strategy'
      } as Record<string, string>
    }
  } else {
    // Generic matching for other topics
    return {
      leftColumn: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
      rightColumn: ['Definition 1', 'Definition 2', 'Definition 3', 'Definition 4'],
      correctMatches: {
        'Concept A': 'Definition 1',
        'Concept B': 'Definition 2',
        'Concept C': 'Definition 3',
        'Concept D': 'Definition 4'
      } as Record<string, string>
    }
  }
}

export default function ModuleLearningModal({ module, isOpen, onClose, onComplete }: ModuleLearningModalProps) {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0)
  const [completedTopics, setCompletedTopics] = useState<number[]>([])
  const [xp, setXp] = useState(0)
  const [points, setPoints] = useState(0)
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number | number[] | Record<string, string>>>({})
  const [skippedQuestions, setSkippedQuestions] = useState<number[]>([])
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [moduleCompleted, setModuleCompleted] = useState(false)

  const quizQuestions = module ? generateQuizQuestions(module) : []
  const currentTopic = module?.topics[currentTopicIndex]
  const progress = module ? ((currentTopicIndex + 1) / module.topics.length) * 100 : 0
  const quizProgress = quizQuestions.length > 0 ? ((currentQuizIndex + 1) / quizQuestions.length) * 100 : 0

  useEffect(() => {
    if (isOpen && module) {
      setCurrentTopicIndex(0)
      setCompletedTopics([])
      setXp(0)
      setPoints(0)
      setCurrentQuizIndex(0)
      setQuizAnswers({})
      setSkippedQuestions([])
      setShowQuiz(false)
      setQuizCompleted(false)
      setModuleCompleted(false)
    }
  }, [isOpen, module])

  const handleTopicComplete = () => {
    if (!module) return
    
    if (!completedTopics.includes(currentTopicIndex)) {
      setCompletedTopics([...completedTopics, currentTopicIndex])
      setXp(prev => prev + 50)
      setPoints(prev => prev + 10)
    }
  }

  const handleNextTopic = () => {
    if (!module) return
    
    if (currentTopicIndex < module.topics.length - 1) {
      setCurrentTopicIndex(currentTopicIndex + 1)
      setShowQuiz(false)
      setQuizCompleted(false)
    } else {
      // All topics completed, show quiz
      setShowQuiz(true)
    }
  }

  const handlePreviousTopic = () => {
    if (currentTopicIndex > 0) {
      setCurrentTopicIndex(currentTopicIndex - 1)
      setShowQuiz(false)
      setQuizCompleted(false)
    }
  }

  const handleQuizAnswer = (answerIndex: number) => {
    if (!quizQuestions[currentQuizIndex]) return
    const question = quizQuestions[currentQuizIndex]
    
    if (question.type === 'multiple-choice') {
      setQuizAnswers({
        ...quizAnswers,
        [currentQuizIndex]: answerIndex
      })
    } else if (question.type === 'multiple-answer') {
      const currentAnswers = (quizAnswers[currentQuizIndex] as number[]) || []
      const newAnswers = currentAnswers.includes(answerIndex)
        ? currentAnswers.filter(a => a !== answerIndex)
        : [...currentAnswers, answerIndex]
      setQuizAnswers({
        ...quizAnswers,
        [currentQuizIndex]: newAnswers
      })
    }
  }

  const handleMatchingAnswer = (leftItem: string, rightItem: string) => {
    if (!quizQuestions[currentQuizIndex]) return
    const question = quizQuestions[currentQuizIndex]
    
    if (question.type === 'matching') {
      const currentMatches = (quizAnswers[currentQuizIndex] as Record<string, string>) || {}
      const newMatches = {
        ...currentMatches,
        [leftItem]: rightItem
      }
      setQuizAnswers({
        ...quizAnswers,
        [currentQuizIndex]: newMatches
      })
    }
  }

  const isAnswerCorrect = (question: QuizQuestion, answer: number | number[] | Record<string, string> | undefined): boolean => {
    if (answer === undefined) return false
    
    if (question.type === 'multiple-choice') {
      return answer === question.correctAnswer
    } else if (question.type === 'multiple-answer') {
      const correctAnswers = question.correctAnswer as number[]
      const userAnswers = answer as number[]
      if (userAnswers.length !== correctAnswers.length) return false
      return correctAnswers.every(ca => userAnswers.includes(ca)) && 
             userAnswers.every(ua => correctAnswers.includes(ua))
    } else if (question.type === 'matching') {
      const correctMatches = question.correctAnswer as Record<string, string>
      const userMatches = answer as Record<string, string>
      const correctKeys = Object.keys(correctMatches)
      if (Object.keys(userMatches).length !== correctKeys.length) return false
      return correctKeys.every(key => userMatches[key] === correctMatches[key])
    }
    return false
  }

  const handleNextQuiz = () => {
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1)
    } else {
      // Quiz completed
      setQuizCompleted(true)
      const correctAnswers = quizQuestions.filter((q, idx) => 
        !skippedQuestions.includes(idx) && isAnswerCorrect(q, quizAnswers[idx])
      ).length
      
      const answeredQuestions = quizQuestions.length - skippedQuestions.length
      const quizScore = answeredQuestions > 0 ? (correctAnswers / answeredQuestions) * 100 : 0
      const bonusXP = Math.round(quizScore * 2)
      const bonusPoints = Math.round(quizScore / 10)
      
      setXp(prev => prev + bonusXP)
      setPoints(prev => prev + bonusPoints)
    }
  }

  const handlePreviousQuiz = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1)
    }
  }

  const handleSkipQuestion = () => {
    if (!skippedQuestions.includes(currentQuizIndex)) {
      setSkippedQuestions([...skippedQuestions, currentQuizIndex])
    }
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1)
    } else {
      // Last question, complete quiz
      setQuizCompleted(true)
      const correctAnswers = quizQuestions.filter((q, idx) => 
        !skippedQuestions.includes(idx) && isAnswerCorrect(q, quizAnswers[idx])
      ).length
      
      const answeredQuestions = quizQuestions.length - skippedQuestions.length
      const quizScore = answeredQuestions > 0 ? (correctAnswers / answeredQuestions) * 100 : 0
      const bonusXP = Math.round(quizScore * 2)
      const bonusPoints = Math.round(quizScore / 10)
      
      setXp(prev => prev + bonusXP)
      setPoints(prev => prev + bonusPoints)
    }
  }

  const handleCompleteModule = () => {
    if (!module) return
    
    // Final completion bonus
    setXp(prev => prev + 100)
    setPoints(prev => prev + 50)
    setModuleCompleted(true)
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('brokee_module_xp') || '0'
      const savedPoints = localStorage.getItem('brokee_module_points') || '0'
      localStorage.setItem('brokee_module_xp', String(parseInt(saved) + xp + 100))
      localStorage.setItem('brokee_module_points', String(parseInt(savedPoints) + points + 50))
    }
    
    setTimeout(() => {
      onComplete(module.id)
      onClose()
    }, 2000)
  }

  if (!isOpen || !module) return null

  const currentQuiz = quizQuestions[currentQuizIndex]
  const selectedAnswer = quizAnswers[currentQuizIndex]
  const answerIsCorrect = currentQuiz && selectedAnswer !== undefined 
    ? isAnswerCorrect(currentQuiz, selectedAnswer) 
    : false
  
  const canProceedQuiz = () => {
    if (!currentQuiz || selectedAnswer === undefined) return false
    if (currentQuiz.type === 'multiple-choice') return true
    if (currentQuiz.type === 'multiple-answer') {
      const answers = selectedAnswer as number[]
      return answers.length > 0
    }
    if (currentQuiz.type === 'matching') {
      const matches = selectedAnswer as Record<string, string>
      return currentQuiz.leftColumn && Object.keys(matches).length === currentQuiz.leftColumn.length
    }
    return false
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-4 sm:p-6 flex items-center justify-between">
          <div className="flex-1 pr-4">
            <h2 className="text-xl sm:text-2xl font-bold mb-1">{module.title}</h2>
            <p className="text-primary-100 text-xs sm:text-sm">{module.description}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Gamification Stats */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200 px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                <span className="font-semibold text-gray-900 text-sm sm:text-base">{xp} XP</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-orange-600" />
                <span className="font-semibold text-gray-900 text-sm sm:text-base">{points} Points</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-gray-900 text-sm sm:text-base">
                  {Math.round(progress)}% Complete
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{module.duration}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {moduleCompleted ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
                <Trophy className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Module Completed! 🎉</h3>
              <p className="text-xl text-gray-600 mb-6">
                You earned <span className="font-bold text-primary-600">{xp} XP</span> and{' '}
                <span className="font-bold text-orange-600">{points} Points</span>!
              </p>
              <div className="flex items-center justify-center gap-2 text-yellow-600 mb-8">
                <Sparkles className="h-6 w-6" />
                <span className="text-lg font-semibold">Great job! Keep learning!</span>
              </div>
            </div>
          ) : showQuiz ? (
            quizCompleted ? (
              <div className="text-center py-8 animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Quiz Completed!</h3>
                <p className="text-gray-600 mb-6">
                  You answered{' '}
                  {quizQuestions.filter((q, idx) => !skippedQuestions.includes(idx) && isAnswerCorrect(q, quizAnswers[idx])).length} out of{' '}
                  {quizQuestions.length - skippedQuestions.length} answered questions correctly.
                  {skippedQuestions.length > 0 && (
                    <span className="block mt-2 text-sm text-gray-500">
                      ({skippedQuestions.length} question{skippedQuestions.length > 1 ? 's' : ''} skipped)
                    </span>
                  )}
                </p>
                <button
                  onClick={handleCompleteModule}
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold text-lg flex items-center gap-2 mx-auto"
                >
                  <Award className="h-5 w-5" />
                  Complete Module
                </button>
              </div>
            ) : currentQuiz ? (
              <div className="animate-fade-in">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Question {currentQuizIndex + 1} of {quizQuestions.length}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {Math.round(quizProgress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${quizProgress}%` }}
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                      {currentQuiz.type === 'multiple-choice' ? 'Multiple Choice' : 
                       currentQuiz.type === 'multiple-answer' ? 'Multiple Answer' : 'Matching'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{currentQuiz.question}</h3>
                  
                  {/* Multiple Choice or Multiple Answer */}
                  {(currentQuiz.type === 'multiple-choice' || currentQuiz.type === 'multiple-answer') && (
                    <div className="space-y-3">
                      {currentQuiz.options.map((option, idx) => {
                        const userAnswers = currentQuiz.type === 'multiple-answer' 
                          ? (selectedAnswer as number[]) || []
                          : []
                        const isSelected = currentQuiz.type === 'multiple-choice'
                          ? selectedAnswer === idx
                          : userAnswers.includes(idx)
                        const correctAnswers = currentQuiz.type === 'multiple-answer'
                          ? (currentQuiz.correctAnswer as number[])
                          : [currentQuiz.correctAnswer as number]
                        const isCorrect = correctAnswers.includes(idx)
                        const showResult = selectedAnswer !== undefined
                        
                        return (
                          <button
                            key={idx}
                            onClick={() => handleQuizAnswer(idx)}
                            disabled={showResult}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                              showResult && isCorrect
                                ? 'bg-green-100 border-green-500 text-green-900'
                                : showResult && isSelected && !isCorrect
                                ? 'bg-red-100 border-red-500 text-red-900'
                                : isSelected
                                ? 'bg-blue-100 border-blue-500 text-blue-900'
                                : 'bg-white border-gray-300 hover:border-blue-400 text-gray-700'
                            } ${showResult ? '' : 'hover:shadow-md cursor-pointer'}`}
                          >
                            <div className="flex items-center gap-3">
                              {currentQuiz.type === 'multiple-answer' ? (
                                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                                  isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                                }`}>
                                  {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                                </div>
                              ) : (
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-semibold ${
                                  showResult && isCorrect
                                    ? 'bg-green-500 text-white'
                                    : showResult && isSelected && !isCorrect
                                    ? 'bg-red-500 text-white'
                                    : isSelected
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {String.fromCharCode(65 + idx)}
                                </div>
                              )}
                              <span className="flex-1">{option}</span>
                              {showResult && isCorrect && (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* Matching Question */}
                  {currentQuiz.type === 'matching' && currentQuiz.leftColumn && currentQuiz.rightColumn && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <p className="text-sm text-gray-600">
                          <strong>Instructions:</strong> Select the correct definition for each term from the dropdown menu.
                        </p>
                      </div>
                      <div className="space-y-3">
                        {currentQuiz.leftColumn.map((leftItem, idx) => {
                          const userMatches = (selectedAnswer as Record<string, string>) || {}
                          const matchedRight = userMatches[leftItem]
                          const correctMatch = (currentQuiz.correctAnswer as Record<string, string>)[leftItem]
                          const showResult = selectedAnswer !== undefined
                          const availableOptions = currentQuiz.rightColumn || []
                          const usedOptions = Object.values(userMatches)
                          const unusedOptions = availableOptions.filter(opt => !usedOptions.includes(opt) || opt === matchedRight)
                          
                          return (
                            <div
                              key={idx}
                              className={`p-4 rounded-lg border-2 ${
                                showResult && matchedRight === correctMatch
                                  ? 'bg-green-50 border-green-500'
                                  : showResult && matchedRight && matchedRight !== correctMatch
                                  ? 'bg-red-50 border-red-500'
                                  : matchedRight
                                  ? 'bg-blue-50 border-blue-500'
                                  : 'bg-white border-gray-300'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div className="font-semibold text-gray-900 min-w-[150px]">
                                  {leftItem}
                                </div>
                                <select
                                  value={matchedRight || ''}
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      handleMatchingAnswer(leftItem, e.target.value)
                                    }
                                  }}
                                  disabled={showResult}
                                  className={`flex-1 p-2 rounded-lg border-2 ${
                                    showResult && matchedRight === correctMatch
                                      ? 'bg-green-100 border-green-500 text-green-900'
                                      : showResult && matchedRight && matchedRight !== correctMatch
                                      ? 'bg-red-100 border-red-500 text-red-900'
                                      : 'bg-white border-gray-300 text-gray-700'
                                  } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                  <option value="">Select a definition...</option>
                                  {unusedOptions.map((option, optIdx) => (
                                    <option key={optIdx} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                                {showResult && matchedRight === correctMatch && (
                                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                                )}
                                {showResult && matchedRight && matchedRight !== correctMatch && (
                                  <X className="h-5 w-5 text-red-600 flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {selectedAnswer !== undefined && (
                    <div className={`mt-4 p-4 rounded-lg ${
                      answerIsCorrect ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
                    }`}>
                      <p className="text-sm font-semibold mb-1">
                        {answerIsCorrect ? '✓ Correct!' : 'Not quite right. Explanation:'}
                      </p>
                      <p className="text-sm text-gray-700">{currentQuiz.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : null
          ) : currentTopic ? (
            <div className="animate-fade-in">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    {currentTopicIndex + 1}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{currentTopic.title}</h3>
                  {completedTopics.includes(currentTopicIndex) && (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  )}
                </div>
                
                {currentTopic.description && (
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                    {currentTopic.description}
                  </p>
                )}

                <div className="bg-gradient-to-r from-primary-50 to-blue-50 border-l-4 border-primary-500 p-6 rounded-lg mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Concepts:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span>Understanding the fundamentals of {currentTopic.title.toLowerCase()}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span>Practical applications in real-world scenarios</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span>Common mistakes to avoid</span>
                    </li>
                  </ul>
                </div>

                {!completedTopics.includes(currentTopicIndex) && (
                  <button
                    onClick={handleTopicComplete}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2 mb-6"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    Mark Topic as Complete
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-gray-200 px-4 sm:px-6 py-4 bg-gray-50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={showQuiz ? handlePreviousQuiz : handlePreviousTopic}
              disabled={showQuiz ? currentQuizIndex === 0 : currentTopicIndex === 0}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <div className="text-xs sm:text-sm text-gray-600 text-center">
              {showQuiz 
                ? `Quiz: ${currentQuizIndex + 1} / ${quizQuestions.length}`
                : `Topic: ${currentTopicIndex + 1} / ${module.topics.length}`
              }
            </div>

            <div className="flex items-center gap-2">
              {showQuiz && (
                <button
                  onClick={handleSkipQuestion}
                  className="px-4 py-2 rounded-lg border border-orange-300 text-orange-700 hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <SkipForward className="h-4 w-4" />
                  Skip
                </button>
              )}
              {showQuiz ? (
                <button
                  onClick={handleNextQuiz}
                  disabled={!canProceedQuiz() && !skippedQuestions.includes(currentQuizIndex)}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {currentQuizIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleNextTopic}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {currentTopicIndex < module.topics.length - 1 ? 'Next Topic' : 'Start Quiz'}
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          {showQuiz && skippedQuestions.includes(currentQuizIndex) && (
            <div className="mt-2 text-center">
              <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">Question skipped</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

