/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react'

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react'
import { useParams } from '@tanstack/react-router'

import { Editor as RichTextEditor } from '@/components/common/content-types/RichText/Editor'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Participantslist } from '@/components/enroll/ParticipantList'
import { EventImage } from '@/components/event-details/EventImage'
import { EventTimeline } from '@/components/event-details/Timeline'
import { useEvent } from '@/hooks/useEvent'
import { cn } from '@/utils/utils'

export function FrameDetailsView() {
  const { eventId }: { eventId: string } = useParams({ strict: false })

  const [showEditor, setShowEditor] = useState(true)

  const descriptionModalDisclosure = useDisclosure()

  const useEventData = useEvent({
    id: eventId as string,
  })
  const { event, participants, hosts } = useEventData

  if (!event) return null

  return (
    <div className="overflow-y-auto scrollbar-none h-full relative z-[50] pb-40">
      <div className="grid grid-cols-[60%_27%] items-start gap-6">
        <div className="h-full flex flex-col gap-5 w-auto rounded-md">
          <p className="text-[40px] font-semibold leading-[46px]">
            {event.name}
          </p>

          <RenderIf isTrue={!!event.description}>
            <div
              className={cn('text-lg rounded-xl backdrop-blur-3xl', {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                'p-4 bg-default/10': (event?.theme as any)?.theme === 'Emoji',
              })}>
              <p className="line-clamp-[7] text-base break-words">
                {event.description}
              </p>
              <RenderIf
                isTrue={
                  !!(event?.description && event.description.length > 400)
                }>
                <Button
                  variant="faded"
                  className="text-xs text-gray-400 cursor-pointer w-fit p-1 h-6 border-1 my-2"
                  onClick={() => descriptionModalDisclosure.onOpen()}>
                  Read More
                </Button>
              </RenderIf>
            </div>
          </RenderIf>

          <RenderIf isTrue={showEditor}>
            <p className="text-gray-600 border-b pb-3 font-medium">
              Event details
            </p>
          </RenderIf>

          <RenderIf isTrue={!!showEditor}>
            <div
              className={cn('backdrop-blur-3xl rounded-xl', {
                'p-4 bg-default/10 shadow-sm':
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (event?.theme as any)?.theme === 'Emoji',
              })}>
              <RichTextEditor
                editorId={eventId!}
                showHeader={false}
                editable={false}
                hideSideBar
                classNames={{
                  editorInPreview: 'overflow-y-visible',
                }}
                onEmptyContent={() => setShowEditor(false)}
              />
            </div>
          </RenderIf>
        </div>
        <div className="flex flex-col gap-6">
          <EventImage src={event?.image_url} />
          <EventTimeline event={event} hosts={hosts} />
          <Participantslist participants={participants as any} hosts={hosts} />
        </div>
      </div>

      <Modal
        size="xl"
        isOpen={descriptionModalDisclosure?.isOpen}
        onClose={descriptionModalDisclosure.onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 bg-primary text-white p-6">
                <h2 className="font-md font-semibold">Description</h2>
              </ModalHeader>
              <ModalBody className="mt-4 mb-4">
                <p className="break-words">{event.description}</p>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
