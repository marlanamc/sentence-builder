'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function SetupDemoPage() {
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()

  const createDemoUser = async () => {
    setIsLoading(true)
    setStatus('Creating demo user...')

    try {
      const { error } = await signUp('demo@example.com', 'demo123', 'demo_user')

      if (error) {
        if (error.message.includes('already registered')) {
          setStatus('✅ Demo user already exists! You can use: demo@example.com / demo123')
        } else {
          setStatus(`❌ Error: ${error.message}`)
        }
      } else {
        setStatus('✅ Demo user created successfully! Use: demo@example.com / demo123')
      }
    } catch (error) {
      setStatus(`❌ Unexpected error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Demo User Setup</h1>

        <div className="space-y-4">
          <p className="text-gray-600 text-center">
            Click below to create the demo user account for testing.
          </p>

          <Button
            onClick={createDemoUser}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Creating...' : 'Create Demo User'}
          </Button>

          {status && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm">{status}</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              After creation, demo credentials will be:
            </p>
            <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-2">
              Email: demo@example.com<br />
              Password: demo123
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}