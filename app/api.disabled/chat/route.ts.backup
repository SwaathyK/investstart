import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export const dynamic = "force-dynamic"  // <-- REQUIRED FIX

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      console.error('OPENAI_API_KEY is missing from environment variables')
      return NextResponse.json(
        { 
          error: 'OpenAI API key is not configured. Please set OPENAI_API_KEY in Cloudflare Pages environment variables.',
          details: 'The API key must be set in Cloudflare Pages Settings → Environment variables for Production, Preview, and Branch environments.'
        },
        { status: 500 }
      )
    }

    const openai = new OpenAI({ apiKey })

    const { messages } = await request.json()

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

    const response = completion.choices[0]?.message?.content 
      || 'Sorry, I could not generate a response.'

    return NextResponse.json({ message: response })
  } catch (error: any) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get response from ChatGPT' },
      { status: 500 }
    )
  }
}
