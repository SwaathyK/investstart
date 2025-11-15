'use client'

import Link from 'next/link'
import { 
  Gamepad2, 
  BookOpen, 
  Trophy, 
  Target, 
  Users, 
  BarChart3, 
  Shield, 
  Zap, 
  Award,
  CheckCircle2,
  ArrowLeft,
  TrendingUp
} from 'lucide-react'
import Navigation from '@/components/Navigation'

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: Gamepad2,
      title: 'Gamified Learning',
      description: 'Earn points, unlock achievements, and level up as you master investing concepts. Turn learning into an engaging game where every lesson completed brings you closer to the next milestone.',
      color: 'primary'
    },
    {
      icon: BookOpen,
      title: 'Mini-Courses',
      description: 'Bite-sized lessons designed for busy students. Learn at your own pace with interactive content that makes complex financial concepts easy to understand and remember.',
      color: 'accent'
    },
    {
      icon: TrendingUp,
      title: 'Virtual Practice',
      description: 'Practice investing with virtual money in a completely safe environment. Build confidence and test strategies before investing real money. Learn from mistakes without financial risk.',
      color: 'green'
    }
  ]

  const additionalFeatures = [
    {
      icon: Trophy,
      title: 'Achievement System',
      description: 'Unlock badges and achievements as you progress through courses and complete challenges.'
    },
    {
      icon: Target,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed progress reports and personalized insights.'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Connect with other students, share experiences, and learn together in a supportive community.'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Track your virtual portfolio performance with detailed analytics and visualizations.'
    },
    {
      icon: Shield,
      title: 'Risk-Free Learning',
      description: 'Learn and practice without any financial risk. All trading is done with virtual money.'
    },
    {
      icon: Zap,
      title: 'Quick Lessons',
      description: 'Complete lessons in just 10-15 minutes. Perfect for fitting learning into a busy schedule.'
    }
  ]

  const benefits = [
    'No prior investing knowledge required',
    'Learn at your own pace',
    'Interactive and engaging content',
    'Real-world examples and case studies',
    'Mobile-friendly platform',
    'Regular content updates',
    'Expert-designed curriculum',
    'Free to get started'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <Navigation />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Powerful Features for
            <span className="block text-primary-600">Smart Learning</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover everything Brokee has to offer. From gamified learning to virtual practice, 
            we&apos;ve built the perfect platform to help you master micro-investing.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon
            const bgColor = feature.color === 'primary' ? 'bg-primary-100' : 
                          feature.color === 'accent' ? 'bg-accent-100' : 'bg-green-100'
            const iconColor = feature.color === 'primary' ? 'text-primary-600' : 
                            feature.color === 'accent' ? 'text-accent-600' : 'text-green-600'
            
            return (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className={`${bgColor} w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
                  <Icon className={`h-8 w-8 ${iconColor}`} />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* Additional Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need to Succeed
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-primary-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl shadow-xl p-12 mb-20">
          <div className="text-center mb-12">
            <Award className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Students Love Brokee</h2>
            <p className="text-xl text-gray-600">
              Join thousands of students who are already mastering micro-investing
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-12 text-center text-white mb-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience These Features?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start your free account today and begin your investment learning journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup" 
              className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Get Started Free
            </Link>
            <Link 
              href="/courses" 
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors inline-block"
            >
              Explore Courses
            </Link>
          </div>
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
    </div>
  )
}

