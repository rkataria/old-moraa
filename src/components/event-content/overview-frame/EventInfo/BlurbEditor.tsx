import { useContext } from 'react'

import { useParams } from '@tanstack/react-router'

import {
  initialCourseContent,
  initialWebinarContent,
  initialWorkshopContent,
} from '../InitalContent'

import { RichTextEditor } from '@/components/common/content-types/RichText/Editor'
import { EventContext } from '@/contexts/EventContext'
import { useEvent } from '@/hooks/useEvent'
import { EventType } from '@/types/enums'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

export function BlurbEditor({ editable = true }: { editable?: boolean }) {
  const { preview } = useContext(EventContext) as EventContextType
  const { eventId } = useParams({ strict: false })

  const eventData = useEvent({ id: eventId! })

  const { event } = eventData

  const getInitialContent = () => {
    if (event.type === EventType.COURSE) return initialCourseContent
    if (event.type === EventType.WEBINAR) return initialWebinarContent

    if (event.type === EventType.WORKSHOP) return initialWorkshopContent

    return initialCourseContent
  }

  return (
    <div
      className={cn('relative group/blurb', {
        'p-4 px-6 bg-default/30 shadow-sm backdrop-blur-2xl rounded-lg':
          preview,
        'min-h-[300px]': !preview,
      })}>
      <RichTextEditor
        key={`${editable && !preview}`}
        editorId={eventId!}
        showHeader={false}
        editable={editable && !preview}
        hideSideBar
        initalContent={getInitialContent()}
        classNames={{
          container: 'border-none bg-default/30 pt-6 !rounded-lg',
          menu: ' -mr-4',
          editor: 'overflow-visible p-0 h-auto',
          wrapper: 'h-auto',
        }}
      />
    </div>
  )
}
