'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your Brokee AI assistant powered by ChatGPT. I can help you learn about micro-investing, answer questions about our courses, or guide you through the platform. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages([...messages, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Call OpenAI API directly from client side
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY

      if (!apiKey) {
        throw new Error('OpenAI API key is not configured. Please set NEXT_PUBLIC_OPENAI_API_KEY in environment variables.')
      }

      const systemMessage = {
        role: 'system' as const,
        content: `You are a helpful AI assistant for Brokee, a platform that helps students learn micro-investing through gamified learning, mini-courses, and virtual practice investing.

Your role is to:
- Help users learn about micro-investing concepts
- Answer questions about Brokee's features
- Guide students on getting started
- Provide simple investing explainers
- Stay concise, friendly, and encouraging`
      }

      const formattedMessages = [
        systemMessage,
        ...messages.map((msg) => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.text
        })),
        {
          role: 'user' as const,
          content: userMessage.text
        }
      ]

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || 'Failed to get response from OpenAI')
      }

      const data = await response.json()
      const botResponseText = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

      const botResponse: Message = {
        id: messages.length + 2,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botResponse])
    } catch (error: any) {
      console.error('Error calling OpenAI API:', error)
      const errorMessage: Message = {
        id: messages.length + 2,
        text: error.message || "Sorry, I'm having trouble connecting right now. Please make sure the OpenAI API key is configured, or try again later.",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-all transform hover:scale-110 z-50 flex items-center justify-center w-14 h-14"
          aria-label="Open chatbot"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Brokee AI Assistant</h3>
                <p className="text-xs opacity-90">We&apos;re here to help!</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded-full transition-colors"
              aria-label="Close chatbot"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-accent-100 text-accent-600'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-accent-100 text-accent-600">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-white text-gray-800 shadow-sm border border-gray-200 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary-600" />
                    <p className="text-sm text-gray-500">Thinking...</p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-black"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by ChatGPT. For account support, contact us.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

