import { useEffect, useState } from 'react'

import { useParams, useRouter } from '@tanstack/react-router'

import { useStoreSelector } from './useRedux'

import { EventService } from '@/services/event.service'

export const useEnsureEventEnrollment = () => {
  const { eventId } = useParams({ strict: false })

  const user = useStoreSelector((state) => state.user.currentUser.user)

  const router = useRouter()
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null)

  const currentUrl = window.location.pathname + window.location.search

  useEffect(() => {
    if (!eventId || !user?.email) return

    const checkEnrollment = async () => {
      try {
        const enrolled = await EventService.isUserEnrolledInEvent({
          userId: user.id,
          eventId,
        })

        setIsEnrolled(enrolled)

        if (!enrolled) {
          router.navigate({
            to: `/enroll/${eventId}`,
            search: {
              redirectTo: currentUrl,
            },
          })
        }
      } catch (error) {
        console.error('Failed to check enrollment:', error)
        setIsEnrolled(false)
        router.navigate({ to: '/events' })
      }
    }

    checkEnrollment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, user])

  return { isEnrolled, eventId }
}
