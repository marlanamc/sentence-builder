'use client'

import React, { useState } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { BookOpen, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  const handleLoginSuccess = () => {
    setShowSuccess(true)
    setTimeout(() => {
      router.push('/game/levels')
    }, 1500)
  }

  const handleSignUpSuccess = () => {
    setShowSuccess(true)
    setTimeout(() => {
      router.push('/game/levels')
    }, 2000)
  }

  const handleSwitchToSignUp = () => {
    setIsLogin(false)
    setShowSuccess(false)
  }

  const handleSwitchToLogin = () => {
    setIsLogin(true)
    setShowSuccess(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900/30 to-purple-900/30 p-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-600/10 to-yellow-600/10 rounded-full filter blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-green-600/10 to-teal-600/10 rounded-full filter blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">ESOL Sentence Builder</h1>
          </div>

          <p className="text-white/70 text-lg">
            {isLogin
              ? 'Sign in to continue your learning journey'
              : 'Create your account to start learning English grammar'
            }
          </p>
        </div>

        {/* Auth Forms */}
        {isLogin ? (
          <LoginForm
            onSuccess={handleLoginSuccess}
            onSwitchToSignUp={handleSwitchToSignUp}
          />
        ) : (
          <SignUpForm
            onSuccess={handleSignUpSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />
        )}

        {/* Success Message */}
        {showSuccess && (
          <div className="mt-4 p-4 bg-green-500/20 border border-green-400/30 rounded-lg text-center">
            <p className="text-green-200 font-medium">
              {isLogin
                ? 'Welcome back! Redirecting...'
                : 'Account created successfully! Welcome to your learning journey.'
              }
            </p>
          </div>
        )}

        {/* Additional Info for Signup */}
        {!isLogin && (
          <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg">
            <h3 className="text-white font-medium mb-2">What you'll get:</h3>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Access to 47 grammar levels</li>
              <li>• Track your progress and achievements</li>
              <li>• Interactive sentence building practice</li>
              <li>• Personalized learning experience</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
