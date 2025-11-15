import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    // Create a system message to give context about Brokee
    const systemMessage = {
      role: 'system' as const,
      content: `You are a helpful AI assistant for Brokee, a platform that helps students learn micro-investing through gamified learning, mini-courses, and virtual practice investing. 

Your role is to:
- Help users learn about micro-investing concepts
- Answer questions about Brokee's features (courses, virtual practice, gamification)
- Guide users on how to get started
- Provide educational information about investing basics
- Be friendly, encouraging, and student-focused

Keep responses concise, clear, and helpful. If asked about something outside your knowledge, politely redirect to relevant Brokee features or suggest they contact support.`
    }

    // Format messages for OpenAI (convert to OpenAI format)
    const formattedMessages = [
      systemMessage,
      ...messages.map((msg: { text: string; sender: string }) => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.text
      }))
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 500,
    })

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    return NextResponse.json({ message: response })
  } catch (error: any) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get response from ChatGPT' },
      { status: 500 }
    )
  }
}

