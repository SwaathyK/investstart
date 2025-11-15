import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <TrendingUp className="h-8 w-8 text-primary-600" />
          <span className="text-2xl font-bold text-gray-900">Brokee</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/courses" className="text-gray-700 hover:text-primary-600 transition-colors">
            Courses
          </Link>
          <Link href="/features" className="text-gray-700 hover:text-primary-600 transition-colors">
            Features
          </Link>
          <Link href="/practice" className="text-gray-700 hover:text-primary-600 transition-colors">
            Practice
          </Link>
          <Link href="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
            Login
          </Link>
          <Link 
            href="/signup" 
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  )
}

