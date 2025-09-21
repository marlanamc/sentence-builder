'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Trophy,
  Target,
  Clock,
  TrendingUp,
  BookOpen,
  Award,
  LogOut,
  Play,
  BarChart3,
  Flame,
  Star,
  Calendar,
  CheckCircle
} from 'lucide-react'

interface UserProgress {
  total_xp: number
  current_streak: number
  longest_streak: number
  total_questions_answered: number
  correct_answers: number
  current_level: number
  unlocked_categories: string[]
  achievements: string[]
  last_activity: string
  study_time_minutes: number
}

interface UserProfile {
  email: string
  username: string
  role: string
  proficiency_level: string
  native_language: string
  created_at: string
}

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    try {
      // Fetch user progress
      const progressResponse = await fetch(`/api/user/progress?user_id=${user?.id}`)
      if (progressResponse.ok) {
        const progress = await progressResponse.json()
        setUserProgress(progress)
      }

      // Fetch user profile
      const profileResponse = await fetch(`/api/user/profile?user_id=${user?.id}`)
      if (profileResponse.ok) {
        const profile = await profileResponse.json()
        setUserProfile(profile)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const getAccuracyPercentage = () => {
    if (!userProgress || userProgress.total_questions_answered === 0) return 0
    return Math.round((userProgress.correct_answers / userProgress.total_questions_answered) * 100)
  }

  const getStudyTimeFormatted = () => {
    if (!userProgress) return '0h 0m'
    const hours = Math.floor(userProgress.study_time_minutes / 60)
    const minutes = userProgress.study_time_minutes % 60
    return `${hours}h ${minutes}m`
  }

  const getCategoryNames = (categories: string[]) => {
    const categoryMap: { [key: string]: string } = {
      'present-basics': 'Present Tense',
      'time-expressions': 'Time Expressions',
      'past-tense': 'Past Tense',
      'present-perfect': 'Present Perfect',
      'future-tenses': 'Future Tenses',
      'modals-special': 'Modal Verbs',
      'commands-suggestions': 'Commands',
      'comparisons': 'Comparisons',
      'advanced': 'Advanced Grammar'
    }
    return categories.map(cat => categoryMap[cat] || cat)
  }

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                Welcome, {userProfile?.username || user.email}!
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  👋 {getTimeBasedGreeting()}, {userProfile?.username || user?.email?.split('@')[0] || 'Student'}!
                </h1>
                <p className="text-blue-100 text-lg mb-4">
                  {userProgress?.last_activity
                    ? `Welcome back! Ready to continue learning?`
                    : `Welcome to your English learning journey!`
                  }
                </p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Level {userProgress?.current_level || 1}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4" />
                    <span>{userProgress?.total_xp || 0} XP</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Flame className="w-4 h-4" />
                    <span>{userProgress?.current_streak || 0} day streak</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Continue Learning</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => router.push('/game/levels')}
              className="h-16 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              <Play className="w-6 h-6 mr-3" />
              Continue Learning
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/game/level/1')}
              className="h-16"
            >
              <Target className="w-6 h-6 mr-3" />
              Practice Level 1
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/progress')}
              className="h-16"
            >
              <BarChart3 className="w-6 h-6 mr-3" />
              View Progress
            </Button>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="mb-8">
          <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {userProgress?.current_streak && userProgress.current_streak > 0
                    ? `Amazing! You're on a ${userProgress.current_streak} day streak! 🔥`
                    : "Ready to start your learning journey? 🚀"
                  }
                </h3>
                <p className="text-gray-600">
                  {userProgress?.current_level && userProgress.current_level > 1
                    ? `You've completed ${userProgress.current_level - 1} levels! Keep going!`
                    : "Start with Level 1 to build your first sentences!"
                  }
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total XP</p>
                <p className="text-2xl font-bold text-gray-900">{userProgress?.total_xp || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">{userProgress?.current_streak || 0} days</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Accuracy</p>
                <p className="text-2xl font-bold text-gray-900">{getAccuracyPercentage()}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Study Time</p>
                <p className="text-2xl font-bold text-gray-900">{getStudyTimeFormatted()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Progress Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Learning Progress */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Learning Progress
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current Level</span>
                  <span className="font-medium">{userProgress?.current_level || 1}/47</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${((userProgress?.current_level || 1) / 47) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Questions Answered</p>
                <p className="text-xl font-bold text-gray-900">
                  {userProgress?.total_questions_answered || 0}
                </p>
                <p className="text-sm text-green-600">
                  {userProgress?.correct_answers || 0} correct
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Longest Streak</p>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="font-semibold">{userProgress?.longest_streak || 0} days</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Unlocked Categories */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Unlocked Categories
            </h3>

            <div className="space-y-3">
              {userProgress?.unlocked_categories &&
                getCategoryNames(userProgress.unlocked_categories).map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700">{category}</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Unlocked
                    </Badge>
                  </div>
                ))
              }
            </div>

            {userProgress?.achievements && userProgress.achievements.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Recent Achievements</h4>
                <div className="space-y-2">
                  {userProgress.achievements.slice(0, 3).map((achievement, index) => (
                    <div key={index} className="flex items-center">
                      <Trophy className="w-4 h-4 text-yellow-500 mr-2" />
                      <span className="text-sm text-gray-700">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* User Profile Info */}
        <Card className="mt-8 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Profile Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Proficiency Level</p>
              <Badge className="mt-1 capitalize">
                {userProfile?.proficiency_level || 'beginner'}
              </Badge>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600">Native Language</p>
              <p className="text-gray-900 capitalize">
                {userProfile?.native_language || 'Not specified'}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600">Member Since</p>
              <p className="text-gray-900">
                {userProfile?.created_at ?
                  new Date(userProfile.created_at).toLocaleDateString() :
                  'Recently'
                }
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}