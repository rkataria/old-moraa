'use client'

import { CreateEventButtonWithModal } from '@/components/common/CreateEventButtonWithModal'
import { EventList } from '@/components/events/EventList'

export default function EventsPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-12">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto" />
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <CreateEventButtonWithModal
            buttonLabel="Create new event"
            buttonProps={{
              color: 'primary',
            }}
          />
        </div>
      </div>
      <EventList />
    </div>
  )
}
