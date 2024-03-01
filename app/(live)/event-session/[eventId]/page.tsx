'use client'

import { useParams } from 'next/navigation'

import { Loading } from '@/components/common/Loading'
import { EventSession } from '@/components/event-session/EventSession'
import { useEnrollment } from '@/hooks/useEnrollment'

function EventSessionPage() {
  const { eventId } = useParams()
  const { enrollment } = useEnrollment({
    eventId: eventId as string,
  })

  if (!enrollment?.meeting_token) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    )
  }

  return <EventSession meetingToken={enrollment.meeting_token} />
}

export default EventSessionPage
