'use client'

import Link from 'next/link'
import { DollarSign } from 'lucide-react'
import Navigation from '@/components/Navigation'

export default function PracticePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Virtual Practice</h1>
        <p className="text-xl text-gray-600 mb-12">
          Practice investing with virtual money in a risk-free environment
        </p>
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-600 mb-1">Virtual Portfolio Value</p>
              <p className="text-3xl font-bold text-gray-900">£1,000.00</p>
            </div>
            <DollarSign className="h-12 w-12 text-primary-600" />
          </div>
          <p className="text-gray-600 mb-6">
            Start practicing with £1,000 in virtual money. Build your portfolio and learn 
            without any real financial risk.
          </p>
          <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
            Start Practicing
          </button>
        </div>
      </div>
    </div>
  )
}

