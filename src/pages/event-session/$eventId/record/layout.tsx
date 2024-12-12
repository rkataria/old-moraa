import { useEffect, useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import { ContentLoading } from '@/components/common/ContentLoading'
import { supabaseClient } from '@/utils/supabase/client'

export const Route = createFileRoute('/event-session/$eventId/record/layout')({
  component: EventSessionRecordLayout,
})

export function EventSessionRecordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loginAnonymously() {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email: 'recording-bot@yopmail.com',
        password: 'letmepass',
      })

      if (error) {
        console.error(error)

        setIsLoading(true)

        return false
      }

      setIsLoading(false)

      return true
    }

    loginAnonymously()
  }, [])

  console.log('isLoading', isLoading)

  if (isLoading) {
    return <ContentLoading message="Setup recording" fullPage />
  }

  return <div>{children}</div>
}
