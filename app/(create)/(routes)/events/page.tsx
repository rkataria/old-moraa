'use client'

import { Button } from '@nextui-org/react'

import { EventList } from '@/components/events/EventList'
import { useModal } from '@/stores/use-modal-store'

export default function EventsPage() {
  const { onOpen } = useModal()

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-12">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto" />
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button
            color="primary"
            onClick={() => onOpen('createEvent', { data: {} })}>
            Create new event
          </Button>
        </div>
      </div>
      <EventList />
    </div>
  )
}
