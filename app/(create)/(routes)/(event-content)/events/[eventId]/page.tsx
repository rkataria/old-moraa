'use client'

import React from 'react'

import { SlideManager } from '@/components/event-content/SlideManager'
import { SlideManagerProvider } from '@/contexts/SlideManagerContext'

function EventSlidesPage() {
  return (
    <SlideManagerProvider>
      <SlideManager />
    </SlideManagerProvider>
  )
}

export default EventSlidesPage
