'use client'

import { useEffect, useState } from 'react'

import { CreateEventModal } from '@/components/events/CreateEventModal'

export function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <CreateEventModal />
}
