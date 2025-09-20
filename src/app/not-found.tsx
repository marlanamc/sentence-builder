'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center bg-white/80 backdrop-blur shadow-xl">
        <div className="space-y-6">
          {/* Icon */}
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <Search className="w-12 h-12 text-gray-500" />
          </div>

          {/* Title */}
          <div>
            <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
            <p className="text-gray-600">
              Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => router.push('/')}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold"
              size="lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>

            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Suggestions */}
          <div className="text-sm text-gray-500 space-y-1">
            <p>You might want to:</p>
            <ul className="space-y-1">
              <li>• Check the URL for typos</li>
              <li>• Go back to the homepage</li>
              <li>• Try the grammar levels page</li>
              <li>• Play a quick match game</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}