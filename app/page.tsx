'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, Gamepad2, TrendingUp } from 'lucide-react'
import DailyStreak from '@/components/DailyStreak'
import Navigation from '@/components/Navigation'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <DailyStreak />
      <Navigation />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Learn Micro-Investing
          <span className="block text-primary-600">Made Simple & Fun</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Master the basics of investing through gamified learning, bite-sized courses, 
          and risk-free virtual practice. Perfect for students starting their financial journey.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/signup" 
            className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center justify-center gap-2"
          >
            Start Learning Free
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link 
            href="/courses" 
            className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition-colors"
          >
            Explore Courses
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose Brokee?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Gamepad2 className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Gamified Learning</h3>
            <p className="text-gray-600">
              Earn points, unlock achievements, and level up as you master investing concepts. 
              Learning has never been this engaging!
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-accent-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Mini-Courses</h3>
            <p className="text-gray-600">
              Bite-sized lessons designed for busy students. Learn at your own pace with 
              interactive content that sticks.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Virtual Practice</h3>
            <p className="text-gray-600">
              Practice investing with virtual money in a safe environment. Build confidence 
              before investing real money.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Investment Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students learning to invest smarter, one lesson at a time.
          </p>
          <Link 
            href="/signup" 
            className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <TrendingUp className="h-6 w-6 text-primary-600" />
            <span className="text-lg font-bold text-gray-900">Brokee</span>
          </div>
          <div className="flex space-x-6 text-gray-600">
            <Link href="/about" className="hover:text-primary-600 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-primary-600 transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-primary-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary-600 transition-colors">Terms</Link>
          </div>
        </div>
        <p className="text-center text-gray-500 mt-4">
          © 2024 Brokee. All rights reserved.
        </p>
      </footer>
    </main>
  )
}

