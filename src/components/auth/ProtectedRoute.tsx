'use client'

import React from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, LogIn } from 'lucide-react'
import Link from 'next/link'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  fallback?: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  fallback
}) => {
  const { user, loading } = useAuth()

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900/30 to-purple-900/30">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900/30 to-purple-900/30 p-4">
        <div className="max-w-md w-full">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Authentication Required</CardTitle>
              <CardDescription>
                You need to sign in to access this feature
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-sm text-muted-foreground mb-6">
                <p>Access to this area requires a valid account.</p>
                <p className="mt-2">Please sign in to continue.</p>
              </div>

              <div className="flex flex-col gap-3">
                <Button asChild className="w-full">
                  <Link href="/login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full">
                  <Link href="/signup">
                    Create Account
                  </Link>
                </Button>

                <Button asChild variant="ghost" className="w-full">
                  <Link href="/">
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // If user is logged in or auth is not required, render children
  return <>{children}</>
}

// Higher-order component for easy usage
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options?: { requireAuth?: boolean; fallback?: React.ReactNode }
) => {
  const WithAuthComponent = (props: P) => (
    <ProtectedRoute requireAuth={options?.requireAuth} fallback={options?.fallback}>
      <Component {...props} />
    </ProtectedRoute>
  )

  WithAuthComponent.displayName = `withAuth(${Component.displayName || Component.name})`

  return WithAuthComponent
}
