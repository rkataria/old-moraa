import { useEffect } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import { supabaseClient } from '@/utils/supabase/client'

export const Route = createFileRoute('/event-session/$eventId/record/layout')({
  component: EventSessionRecordLayout,
})

export function EventSessionRecordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    async function loginAnonymously() {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email: 'recording-bot@yopmail.com',
        password: 'letmepass',
      })

      if (error) {
        console.error(error)

        return false
      }

      return true
    }

    loginAnonymously()
  }, [])

  return <div>{children}</div>
}
