'use client'

import { useState, useEffect } from 'react'

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const checkDevice = () => {
      const width = window.innerWidth
      setIsMobile(width < 768) // md breakpoint
      setIsTablet(width >= 768 && width < 1024) // lg breakpoint
    }

    // Check on mount
    checkDevice()

    // Add event listener
    window.addEventListener('resize', checkDevice)

    // Cleanup
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return { isMobile: isClient ? isMobile : false, isTablet: isClient ? isTablet : false, isClient }
}
