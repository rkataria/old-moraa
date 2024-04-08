'use client'

import React from 'react'

import { SlideManager } from '@/components/event-content/SlideManager'
import { EventProvider } from '@/contexts/EventContext'

function EventSlidesPage() {
  return (
    <EventProvider eventMode="edit">
      <SlideManager />
    </EventProvider>
  )
}

export default EventSlidesPage
