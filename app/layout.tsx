import type { Metadata } from 'next'
import './globals.css'
import Chatbot from '@/components/Chatbot'

export const metadata: Metadata = {
  title: 'Brokee - Learn Micro-Investing',
  description: 'A simple, friendly platform that helps students learn micro-investing using gamified learning, mini-courses, and virtual practice investing.',
}

export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Chatbot />
      </body>
    </html>
  )
}

