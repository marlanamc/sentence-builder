'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Home, Play, Target, Zap, Gift, Database, Settings,
  CheckCircle, Trophy, BookOpen,
  BarChart3, Brain, Gamepad2
} from 'lucide-react'

export default function FeaturesPage() {
  const router = useRouter()

  const features = [
    {
      category: 'Core Game Modes',
      items: [
        {
          name: 'Sentence Tiles',
          description: 'Build sentences using interactive word tiles with grammar validation',
          icon: Play,
          route: '/game/sentence-tiles',
          status: 'active',
          color: 'from-green-400 to-emerald-500'
        },
        {
          name: 'Grammar Levels',
          description: '45-level progression system with categorized grammar concepts',
          icon: Target,
          route: '/game/levels',
          status: 'active',
          color: 'from-blue-400 to-indigo-500'
        },
        {
          name: 'Quick Match',
          description: 'Fast-paced grammar challenges with time pressure',
          icon: Zap,
          route: '/game/quick-match',
          status: 'active',
          color: 'from-yellow-400 to-orange-500'
        }
      ]
    },
    {
      category: 'Special Features',
      items: [
        {
          name: 'Bonus Packs',
          description: 'Daily challenges, speed rounds, and special tournaments',
          icon: Gift,
          route: '/bonus-packs',
          status: 'active',
          color: 'from-purple-400 to-pink-500'
        },
        {
          name: 'Admin Dashboard',
          description: 'Database management and schema inspection tools',
          icon: Database,
          route: '/admin',
          status: 'active',
          color: 'from-gray-400 to-slate-500'
        }
      ]
    },
    {
      category: 'Learning Features',
      items: [
        {
          name: 'Adaptive Difficulty',
          description: 'AI-powered difficulty adjustment based on performance',
          icon: Brain,
          route: null,
          status: 'built-in',
          color: 'from-indigo-400 to-purple-500'
        },
        {
          name: 'Progress Tracking',
          description: 'Comprehensive analytics and learning insights',
          icon: BarChart3,
          route: null,
          status: 'built-in',
          color: 'from-emerald-400 to-teal-500'
        },
        {
          name: 'Gamification',
          description: 'Points, streaks, achievements, and leaderboards',
          icon: Trophy,
          route: null,
          status: 'built-in',
          color: 'from-amber-400 to-yellow-500'
        }
      ]
    },
    {
      category: 'Grammar System',
      items: [
        {
          name: 'Grammar Engine',
          description: 'Advanced validation with detailed error feedback',
          icon: CheckCircle,
          route: null,
          status: 'backend',
          color: 'from-green-400 to-lime-500'
        },
        {
          name: 'Question Bank',
          description: '1000+ questions across multiple difficulty levels',
          icon: BookOpen,
          route: null,
          status: 'backend',
          color: 'from-blue-400 to-cyan-500'
        },
        {
          name: 'Analytics Engine',
          description: 'Real-time learning analytics and recommendations',
          icon: Settings,
          route: null,
          status: 'backend',
          color: 'from-violet-400 to-purple-500'
        }
      ]
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">✓ Active</Badge>
      case 'built-in':
        return <Badge className="bg-blue-100 text-blue-800">🔧 Built-in</Badge>
      case 'backend':
        return <Badge className="bg-purple-100 text-purple-800">⚙️ Backend</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <Card className="border-2 border-blue-200 bg-white/80 backdrop-blur">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/')}
                className="flex items-center space-x-2 bg-white/80"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Button>
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                <Gamepad2 className="w-8 h-8 inline-block mr-2" />
                Features Overview
              </h1>
              <p className="text-gray-600">Complete feature set for the Sentence Builder Game</p>
            </div>
          </div>
        </Card>

        {/* Feature Categories */}
        <div className="space-y-8">
          {features.map((category) => (
            <div key={category.category}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{category.category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((feature) => (
                  <Card
                    key={feature.name}
                    className={`p-6 bg-white/80 backdrop-blur shadow-lg transition-all transform hover:scale-105 ${
                      feature.route ? 'cursor-pointer hover:shadow-xl' : ''
                    }`}
                    onClick={() => feature.route && router.push(feature.route)}
                  >
                    <div className="space-y-4">
                      {/* Icon and Status */}
                      <div className="flex items-start justify-between">
                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                          <feature.icon className="w-7 h-7 text-white" />
                        </div>
                        {getStatusBadge(feature.status)}
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {feature.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {feature.description}
                        </p>
                      </div>

                      {/* Action */}
                      {feature.route ? (
                        <Button
                          className={`w-full bg-gradient-to-r ${feature.color} text-white font-semibold shadow-md hover:shadow-lg`}
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(feature.route!)
                          }}
                        >
                          Try It Now
                        </Button>
                      ) : (
                        <div className="text-center py-2">
                          <span className="text-sm text-gray-500">
                            {feature.status === 'built-in' ? 'Integrated Feature' : 'Backend System'}
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Technical Overview */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h3 className="text-xl font-bold mb-4 text-gray-900">🛠️ Technical Architecture</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Frontend</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Next.js 15 with App Router</li>
                <li>• React 19 with TypeScript</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Radix UI components</li>
                <li>• Responsive mobile-first design</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Backend Systems</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Advanced Grammar Engine</li>
                <li>• Comprehensive Question Bank</li>
                <li>• Analytics & Progress Tracking</li>
                <li>• Adaptive Difficulty Algorithm</li>
                <li>• Supabase Database Integration</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Features</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• 45-level progression system</li>
                <li>• Real-time grammar validation</li>
                <li>• Gamification & achievements</li>
                <li>• Multi-device support</li>
                <li>• Admin management tools</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Quick Navigation */}
        <Card className="p-6 bg-white/80 backdrop-blur">
          <h3 className="text-xl font-bold mb-4 text-gray-900">🚀 Quick Start</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => router.push('/game/sentence-tiles')}
              className="flex flex-col items-center p-4 h-auto bg-green-500 hover:bg-green-600"
            >
              <Play className="w-6 h-6 mb-2" />
              <span>Start Playing</span>
            </Button>
            <Button
              onClick={() => router.push('/game/levels')}
              className="flex flex-col items-center p-4 h-auto bg-blue-500 hover:bg-blue-600"
            >
              <Target className="w-6 h-6 mb-2" />
              <span>Browse Levels</span>
            </Button>
            <Button
              onClick={() => router.push('/bonus-packs')}
              className="flex flex-col items-center p-4 h-auto bg-purple-500 hover:bg-purple-600"
            >
              <Gift className="w-6 h-6 mb-2" />
              <span>Bonus Content</span>
            </Button>
            <Button
              onClick={() => router.push('/admin')}
              className="flex flex-col items-center p-4 h-auto bg-gray-500 hover:bg-gray-600"
            >
              <Database className="w-6 h-6 mb-2" />
              <span>Admin Panel</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}