import { useContext, useState } from 'react'

import { useParams } from '@tanstack/react-router'
import { PiNoteThin } from 'react-icons/pi'

import { RichTextEditor } from '@/components/common/content-types/RichText/Editor'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

export function BlurbEditor({ editable = true }: { editable?: boolean }) {
  const { preview } = useContext(EventContext) as EventContextType

  const { eventId } = useParams({ strict: false })
  const [showPlaceholder, setShowPlaceholder] = useState(false)

  return (
    <div
      className={cn(
        'relative bg-white rounded-xl py-4 border min-h-[300px] group/blurb',
        {
          'px-4': preview,
        }
      )}
      onPointerOver={() => {
        if (preview) return
        setShowPlaceholder(false)
      }}>
      <RichTextEditor
        key={`${editable && !preview}`}
        editorId={eventId}
        showHeader={false}
        editable={editable && !preview}
        onEmptyContent={() => setShowPlaceholder(true)}
        classNames={{
          container: 'border-none',
          editor: 'p-0',
          menu: 'grid -mr-4 gap-[-10px] ',
          gripButton: '-mt-2',
        }}
      />
      <RenderIf isTrue={showPlaceholder}>
        <div
          className={cn(
            'absolute top-0 left-0 grid w-full h-full place-items-center rounded-xl ',
            {
              'group-hover/blurb:hidden': !preview,
            }
          )}>
          <div className="grid gap-2 place-items-center">
            <PiNoteThin className="w-16 h-16 text-black/40" />

            <div className="text-center">
              <p className="font-medium tracking-tight text-black/40">
                Additional Details{' '}
              </p>
              <p className="px-6 mt-2 text-sm text-center text-black/40">
                Provide a detailed overview of the event, including key
                highlights and what learners can expect.
              </p>
            </div>
          </div>
        </div>
      </RenderIf>
    </div>
  )
}
