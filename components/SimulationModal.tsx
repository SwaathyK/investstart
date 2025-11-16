'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle2, XCircle, ChevronRight, ChevronLeft, Trophy, Target, AlertTriangle } from 'lucide-react'
import { type SimulationScenario } from '@/data/courses'

interface SimulationModalProps {
  scenario: SimulationScenario | null
  isOpen: boolean
  onClose: () => void
}

interface SimulationStep {
  stepNumber: number
  title: string
  description: string
  options: {
    id: number
    text: string
    isCorrect: boolean
    explanation: string
  }[]
}

interface SimulationData {
  [key: number]: {
    steps: SimulationStep[]
    finalFeedback: {
      excellent: string
      good: string
      needsImprovement: string
    }
  }
}

const simulationData: SimulationData = {
  1: { // Bull Market
    steps: [
      {
        stepNumber: 1,
        title: 'Early Bull Market Signals',
        description: 'The market has been rising for 3 months. Your portfolio is up 15%. News shows strong economic indicators. What should you do?',
        options: [
          {
            id: 1,
            text: 'Increase position sizes and buy more aggressive stocks',
            isCorrect: false,
            explanation: 'This is FOMO behavior. In a bull market, it\'s important to maintain discipline and not overextend yourself.'
          },
          {
            id: 2,
            text: 'Maintain your current strategy and stick to your investment plan',
            isCorrect: true,
            explanation: 'Correct! Maintaining discipline during bull markets prevents emotional decisions and helps you stick to your long-term plan.'
          },
          {
            id: 3,
            text: 'Sell everything and wait for a correction',
            isCorrect: false,
            explanation: 'While timing the market can be tempting, selling everything means missing out on continued growth. Stay invested according to your plan.'
          }
        ]
      },
      {
        stepNumber: 2,
        title: 'Mid-Bull Market Momentum',
        description: 'The market continues rising. Your portfolio is now up 30%. Friends are making quick profits on meme stocks. Social media is full of success stories. How do you respond?',
        options: [
          {
            id: 1,
            text: 'Join the trend and invest heavily in trending stocks',
            isCorrect: false,
            explanation: 'Following the crowd and investing in hype stocks is dangerous. This often leads to buying at peaks and significant losses.'
          },
          {
            id: 2,
            text: 'Stay disciplined, rebalance if needed, and avoid FOMO',
            isCorrect: true,
            explanation: 'Excellent! Resisting FOMO and maintaining your strategy is key. Consider rebalancing to lock in some gains while staying invested.'
          },
          {
            id: 3,
            text: 'Pull all money out of the market',
            isCorrect: false,
            explanation: 'While taking profits is good, pulling everything out means you might miss continued growth. A better approach is partial rebalancing.'
          }
        ]
      },
      {
        stepNumber: 3,
        title: 'Late Bull Market - Peak Euphoria',
        description: 'The market has been rising for 18 months. Everyone is talking about stocks. Your portfolio is up 50%. There are signs of overvaluation. What\'s your move?',
        options: [
          {
            id: 1,
            text: 'Keep buying more, the market will keep going up',
            isCorrect: false,
            explanation: 'This is peak FOMO. Buying at market tops is one of the biggest mistakes investors make. Markets don\'t go up forever.'
          },
          {
            id: 2,
            text: 'Take some profits, rebalance portfolio, and prepare for volatility',
            isCorrect: true,
            explanation: 'Perfect! Taking profits, rebalancing, and preparing for potential downturns shows mature risk management.'
          },
          {
            id: 3,
            text: 'Sell everything immediately',
            isCorrect: false,
            explanation: 'While being cautious is good, selling everything is too extreme. A balanced approach of taking some profits while staying invested is better.'
          }
        ]
      }
    ],
    finalFeedback: {
      excellent: 'Outstanding! You demonstrated excellent discipline throughout the bull market. You resisted FOMO, maintained your strategy, and made smart decisions about when to take profits. This is exactly how successful investors navigate rising markets.',
      good: 'Good job! You made mostly sound decisions, though there were a few moments where you could have been more disciplined. Remember: bull markets test your ability to stick to your plan when everyone else is getting excited.',
      needsImprovement: 'There\'s room for improvement. You showed some FOMO tendencies and emotional decision-making. In bull markets, the key is discipline: stick to your plan, avoid chasing trends, and know when to take profits.'
    }
  },
  2: { // Bear Market / Crash
    steps: [
      {
        stepNumber: 1,
        title: 'Early Warning Signs',
        description: 'The market has dropped 10% over the past month. Economic indicators are weakening. Your portfolio is down 8%. What do you do?',
        options: [
          {
            id: 1,
            text: 'Panic sell everything to avoid further losses',
            isCorrect: false,
            explanation: 'Panic selling locks in losses and prevents you from participating in eventual recovery. This is emotional decision-making.'
          },
          {
            id: 2,
            text: 'Stay calm, review your portfolio, and stick to your long-term plan',
            isCorrect: true,
            explanation: 'Correct! Staying calm and sticking to your plan is crucial. Review your positions, but don\'t make emotional decisions based on short-term volatility.'
          },
          {
            id: 3,
            text: 'Double down and buy more to average down',
            isCorrect: false,
            explanation: 'While averaging down can work, doing it immediately without analysis is risky. First, assess whether your investments are still sound.'
          }
        ]
      },
      {
        stepNumber: 2,
        title: 'Market Crash - 20% Decline',
        description: 'The market has crashed 20%. Your portfolio is down 18%. News is all negative. Fear is widespread. How do you respond?',
        options: [
          {
            id: 1,
            text: 'Sell everything and wait on the sidelines',
            isCorrect: false,
            explanation: 'Selling at the bottom locks in losses. Historically, markets recover, and selling during crashes is often the worst time to exit.'
          },
          {
            id: 2,
            text: 'Stay invested, consider buying quality assets at discounts, maintain emergency fund',
            isCorrect: true,
            explanation: 'Excellent! Staying invested and potentially buying quality assets at discounts (if you have cash) is smart. Just ensure you maintain your emergency fund.'
          },
          {
            id: 3,
            text: 'Invest all available cash immediately',
            isCorrect: false,
            explanation: 'While buying during crashes can be good, investing ALL cash is risky. Maintain your emergency fund and invest gradually (dollar-cost averaging).'
          }
        ]
      },
      {
        stepNumber: 3,
        title: 'Recovery Phase',
        description: 'The market has been recovering for 6 months but is still 10% below peak. Your portfolio is recovering. There\'s still uncertainty. What\'s your strategy?',
        options: [
          {
            id: 1,
            text: 'Sell everything now that you\'re recovering losses',
            isCorrect: false,
            explanation: 'Selling during recovery often means missing out on full recovery. If your investments are sound, staying invested is usually better.'
          },
          {
            id: 2,
            text: 'Stay the course, continue regular investments, and be patient',
            isCorrect: true,
            explanation: 'Perfect! Staying the course and continuing regular investments (dollar-cost averaging) is the right approach. Recovery takes time.'
          },
          {
            id: 3,
            text: 'Wait for full recovery before investing more',
            isCorrect: false,
            explanation: 'Waiting for full recovery means missing opportunities. Continuing to invest during recovery (dollar-cost averaging) is typically better.'
          }
        ]
      }
    ],
    finalFeedback: {
      excellent: 'Excellent work! You demonstrated remarkable composure during the bear market. You stayed calm, stuck to your plan, and made rational decisions. This is exactly how successful investors weather market storms.',
      good: 'Good job! You handled most situations well, though there were moments of concern. Remember: bear markets are temporary, and staying disciplined is key to long-term success.',
      needsImprovement: 'You showed some panic and emotional decision-making. In bear markets, the key is to stay calm, stick to your plan, and remember that markets historically recover. Avoid making decisions based on fear.'
    }
  },
  3: { // 2008-Style Crisis
    steps: [
      {
        stepNumber: 1,
        title: 'Pre-Crisis: Market Peak (2007)',
        description: 'The market is at all-time highs. Housing prices have been rising rapidly. There are warnings about subprime mortgages, but most ignore them. Your portfolio is up 40%. What do you do?',
        options: [
          {
            id: 1,
            text: 'Leverage up and invest more aggressively',
            isCorrect: false,
            explanation: 'Leveraging at market peaks is extremely risky. This is exactly what led to massive losses in 2008. Never invest more than you can afford to lose.'
          },
          {
            id: 2,
            text: 'Take some profits, reduce risk, and prepare for potential downturn',
            isCorrect: true,
            explanation: 'Smart move! Taking profits, reducing risk exposure, and preparing for potential downturns shows prudent risk management before a crisis.'
          },
          {
            id: 3,
            text: 'Do nothing, markets always go up',
            isCorrect: false,
            explanation: 'While markets generally trend up long-term, ignoring warning signs and not preparing for downturns is naive. Prudent investors prepare for various scenarios.'
          }
        ]
      },
      {
        stepNumber: 2,
        title: 'Crisis Hits: Market Crash (2008)',
        description: 'The financial crisis hits. Major banks are failing. The market crashes 40%. Your portfolio is down 35%. Unemployment is rising. Panic is everywhere. How do you respond?',
        options: [
          {
            id: 1,
            text: 'Panic sell everything immediately',
            isCorrect: false,
            explanation: 'Panic selling at the bottom of a crisis locks in massive losses. Those who sold in 2008 missed the recovery that followed.'
          },
          {
            id: 2,
            text: 'Stay calm, maintain emergency fund, consider buying quality assets if you have cash',
            isCorrect: true,
            explanation: 'Excellent! Staying calm, maintaining your emergency fund, and potentially buying quality assets at crisis prices (if you have cash) is the right approach. This is what successful investors did in 2008.'
          },
          {
            id: 3,
            text: 'Invest all available cash immediately',
            isCorrect: false,
            explanation: 'While buying during crises can be profitable, investing ALL cash is risky. Maintain your emergency fund - crises can last longer than expected.'
          }
        ]
      },
      {
        stepNumber: 3,
        title: 'Recovery Phase (2009-2012)',
        description: 'The market is recovering but slowly. It\'s been 2 years since the crash. Your portfolio is still down 15% from peak. There\'s still economic uncertainty. What\'s your strategy?',
        options: [
          {
            id: 1,
            text: 'Sell everything and avoid stocks forever',
            isCorrect: false,
            explanation: 'Avoiding stocks forever means missing out on the recovery. The market recovered from 2008 and went on to new highs. Staying invested is key.'
          },
          {
            id: 2,
            text: 'Stay invested, continue regular contributions, and be patient for full recovery',
            isCorrect: true,
            explanation: 'Perfect! Staying invested and continuing regular contributions (dollar-cost averaging) during recovery is the right strategy. Full recovery takes time but eventually happens.'
          },
          {
            id: 3,
            text: 'Wait until full recovery before investing more',
            isCorrect: false,
            explanation: 'Waiting for full recovery means missing opportunities. Continuing to invest during recovery allows you to benefit from the eventual upturn.'
          }
        ]
      }
    ],
    finalFeedback: {
      excellent: 'Outstanding! You navigated the 2008-style crisis like a pro. You prepared before the crash, stayed calm during it, and positioned yourself for recovery. This is exactly how successful investors handle major market crises.',
      good: 'Good job! You handled most of the crisis well, though there were some areas for improvement. Remember: major crises are rare but preparing for them, staying calm, and staying invested for recovery is key.',
      needsImprovement: 'You showed panic and poor decision-making during the crisis. In major market crises, preparation before, calm during, and patience for recovery are essential. Avoid emotional decisions based on fear.'
    }
  },
  4: { // Meme Stock / Bubble Mania
    steps: [
      {
        stepNumber: 1,
        title: 'Early Hype Phase',
        description: 'A stock is trending on social media. It\'s up 200% in a week. Everyone is talking about it. Your friends are making money. FOMO is strong. What do you do?',
        options: [
          {
            id: 1,
            text: 'Jump in immediately with a large position',
            isCorrect: false,
            explanation: 'Jumping into a hyped stock with a large position is extremely risky. This is how people lose money in bubbles - buying at peaks based on FOMO.'
          },
          {
            id: 2,
            text: 'Stay away, stick to your investment plan, and avoid the hype',
            isCorrect: true,
            explanation: 'Correct! Avoiding hype and sticking to your plan is the right move. Meme stocks and bubbles are dangerous - most people lose money chasing them.'
          },
          {
            id: 3,
            text: 'Invest a small amount just to participate',
            isCorrect: false,
            explanation: 'Even small amounts in bubble stocks can be problematic. It normalizes risky behavior and can lead to larger positions. Better to avoid entirely.'
          }
        ]
      },
      {
        stepNumber: 2,
        title: 'Peak Mania',
        description: 'The stock is up 500%. It\'s all over the news. People are quitting jobs to day trade. Social media is full of "success" stories. The stock seems unstoppable. How do you respond?',
        options: [
          {
            id: 1,
            text: 'Invest heavily - this is a once-in-a-lifetime opportunity',
            isCorrect: false,
            explanation: 'Investing heavily in peak mania is how people lose everything. Bubbles always pop, and those who buy at peaks suffer massive losses.'
          },
          {
            id: 2,
            text: 'Continue avoiding it and focus on your long-term strategy',
            isCorrect: true,
            explanation: 'Excellent discipline! Continuing to avoid the bubble and focus on your long-term strategy is exactly right. Bubbles always pop eventually.'
          },
          {
            id: 3,
            text: 'Short the stock to profit from the crash',
            isCorrect: false,
            explanation: 'Shorting bubbles is extremely risky. Bubbles can go higher than expected, and shorting can lead to unlimited losses. Best to simply avoid.'
          }
        ]
      },
      {
        stepNumber: 3,
        title: 'Bubble Pops',
        description: 'The bubble has popped. The stock is down 80% from peak. Many people lost money. Your friends who invested are devastated. The hype is gone. What\'s your takeaway?',
        options: [
          {
            id: 1,
            text: 'I should have invested - I missed out',
            isCorrect: false,
            explanation: 'This is the wrong takeaway. You avoided significant losses. Missing out on bubble gains is much better than losing money in the crash.'
          },
          {
            id: 2,
            text: 'I made the right choice by avoiding it. Stick to fundamentals and long-term investing',
            isCorrect: true,
            explanation: 'Perfect! This is the right mindset. Avoiding bubbles and sticking to fundamentals and long-term investing is how you build real wealth sustainably.'
          },
          {
            id: 3,
            text: 'Next time I\'ll invest earlier and sell before it crashes',
            isCorrect: false,
            explanation: 'This is dangerous thinking. Timing bubbles is nearly impossible. Most people who try end up losing money. Stick to your disciplined approach.'
          }
        ]
      }
    ],
    finalFeedback: {
      excellent: 'Perfect! You demonstrated excellent discipline and resisted the bubble mania completely. You avoided FOMO, stuck to your principles, and protected your capital. This is exactly how successful investors handle market manias.',
      good: 'Good job! You mostly avoided the bubble, though there were moments of temptation. Remember: bubbles are always tempting, but avoiding them protects your capital and keeps you focused on real investing.',
      needsImprovement: 'You showed FOMO and were tempted by the bubble. Remember: bubbles always pop, and most people lose money. The key is discipline - stick to fundamentals and avoid hype-driven investments entirely.'
    }
  }
}

export default function SimulationModal({ scenario, isOpen, onClose }: SimulationModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [completed, setCompleted] = useState(false)

  const simData = scenario ? simulationData[scenario.id] : null
  const steps = simData?.steps || []

  useEffect(() => {
    if (isOpen && scenario) {
      setCurrentStep(0)
      setSelectedAnswers({})
      setShowResults(false)
      setCompleted(false)
    }
  }, [isOpen, scenario])

  const handleSelectAnswer = (optionId: number) => {
    if (showResults || completed) return
    setSelectedAnswers({
      ...selectedAnswers,
      [currentStep]: optionId
    })
  }

  const handleNextStep = () => {
    if (showResults) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
        setShowResults(false)
      } else {
        setCompleted(true)
      }
    } else {
      setShowResults(true)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setShowResults(false)
    }
  }

  const getScore = () => {
    if (!simData) return 0
    const correctAnswers = steps.filter((step, idx) => {
      const selected = selectedAnswers[idx]
      const correctOption = step.options.find(opt => opt.isCorrect)
      return selected === correctOption?.id
    }).length
    return correctAnswers
  }

  const getFeedback = () => {
    if (!simData) return ''
    const score = getScore()
    if (score === 3) return simData.finalFeedback.excellent
    if (score === 2) return simData.finalFeedback.good
    return simData.finalFeedback.needsImprovement
  }

  if (!isOpen || !scenario || !simData) return null

  const currentStepData = steps[currentStep]
  const selectedAnswer = selectedAnswers[currentStep]
  const selectedOption = currentStepData?.options.find(opt => opt.id === selectedAnswer)
  const canProceed = selectedAnswer !== undefined

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-4 sm:p-6 flex items-center justify-between">
          <div className="flex-1 pr-4">
            <h2 className="text-xl sm:text-2xl font-bold mb-1">{scenario.title}</h2>
            <p className="text-primary-100 text-xs sm:text-sm">{scenario.description}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Progress */}
        <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {completed ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
                <Trophy className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Simulation Complete!</h3>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-6 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-6 w-6 text-blue-600" />
                  <h4 className="text-xl font-bold text-gray-900">Your Score: {getScore()} / {steps.length}</h4>
                </div>
                <p className="text-gray-700 leading-relaxed">{getFeedback()}</p>
              </div>
              
              {/* Step-by-step review */}
              <div className="space-y-4 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 text-left">Question Review:</h4>
                {steps.map((step, idx) => {
                  const selected = selectedAnswers[idx]
                  const selectedOpt = step.options.find(opt => opt.id === selected)
                  const isCorrect = selectedOpt?.isCorrect
                  
                  return (
                    <div 
                      key={idx}
                      className={`p-4 rounded-lg border-2 text-left ${
                        isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-1">Question {step.stepNumber}: {step.title}</h5>
                          <p className="text-sm text-gray-700 mb-2">Your choice: {selectedOpt?.text}</p>
                          <p className="text-sm text-gray-600">{selectedOpt?.explanation}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : currentStepData ? (
            <div className="animate-fade-in">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    {currentStepData.stepNumber}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{currentStepData.title}</h3>
                </div>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">{currentStepData.description}</p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">What would you do?</h4>
                <div className="space-y-3">
                  {currentStepData.options.map((option) => {
                    const isSelected = selectedAnswer === option.id
                    const showResult = showResults || completed
                    const isCorrect = option.isCorrect
                    
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleSelectAnswer(option.id)}
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
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-semibold ${
                            showResult && isCorrect
                              ? 'bg-green-500 text-white'
                              : showResult && isSelected && !isCorrect
                              ? 'bg-red-500 text-white'
                              : isSelected
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {String.fromCharCode(64 + option.id)}
                          </div>
                          <span className="flex-1">{option.text}</span>
                          {showResult && isCorrect && (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          )}
                          {showResult && isSelected && !isCorrect && (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {selectedOption && (showResults || completed) && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    selectedOption.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <div className="flex items-start gap-2 mb-2">
                      {selectedOption.isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-semibold mb-1">
                          {selectedOption.isCorrect ? '✓ Great choice!' : 'Not quite right'}
                        </p>
                        <p className="text-sm text-gray-700">{selectedOption.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-gray-200 px-4 sm:px-6 py-4 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handlePreviousStep}
            disabled={currentStep === 0}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="text-xs sm:text-sm text-gray-600 text-center">
            {completed ? 'Review Results' : `Question ${currentStep + 1} / ${steps.length}`}
          </div>

          {completed ? (
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              Close
            </button>
          ) : (
            <button
              onClick={() => {
                if (canProceed && !showResults) {
                  setShowResults(true)
                } else {
                  handleNextStep()
                }
              }}
              disabled={!canProceed}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {showResults ? (currentStep < steps.length - 1 ? 'Next Question' : 'View Results') : 'Submit Answer'}
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

