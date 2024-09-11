import { useState } from 'react'

import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react'
import { useParams } from '@tanstack/react-router'

import { RichTextEditor } from '@/components/common/content-types/RichText/Editor'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Date } from '@/components/enroll/Date'
import { ThemeEffects } from '@/components/events/ThemeEffects'
import { useEvent } from '@/hooks/useEvent'
import { cn } from '@/utils/utils'

function Dates({
  startDate,
  endDate,
  timeZone,
}: {
  startDate: string | undefined
  endDate: string | undefined
  timeZone: string | undefined
}) {
  if (!startDate || !endDate || !timeZone) return null

  return (
    <div className="flex items-center gap-10 mt-6">
      <Date date={startDate} timezone={timeZone} />
      <Date date={endDate} timezone={timeZone} />
    </div>
  )
}
export function FrameDetailsView({ className }: { className?: string }) {
  const { eventId }: { eventId: string } = useParams({ strict: false })
  const [showEditor, setShowEditor] = useState(true)

  const descriptionModalDisclosure = useDisclosure()

  const useEventData = useEvent({
    id: eventId as string,
    validateWithUser: false,
  })
  const { event } = useEventData

  if (!event) return null

  return (
    <ThemeEffects
      selectedTheme={event.theme}
      className={cn('h-full pt-4', className)}>
      <div className="overflow-y-scroll h-full relative z-[50] pb-40">
        <div className="max-w-[990px] mx-auto py-4 pt-8">
          <div className="grid grid-cols-[40%_60%] items-start gap-12">
            <Image
              src={
                event?.image_url ||
                'https://images.unsplash.com/photo-1525351159099-81893194469e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBhcnR5JTIwaW52aXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D'
              }
              classNames={{
                wrapper: 'w-full h-full',
                img: 'w-full object-cover rounded-3xl shadow-xl aspect-square',
              }}
            />
            <div className="h-full flex flex-col justify-between">
              <div>
                <p className="text-5xl font-bold mb-4">{event.name}</p>
                <p className="text-sm line-clamp-[8]">{event.description}</p>
                <RenderIf isTrue={event?.description?.length > 400}>
                  <Button
                    variant="faded"
                    className="text-xs text-gray-400 cursor-pointer w-fit p-1 h-6 border-1 my-4"
                    onClick={() => descriptionModalDisclosure.onOpen()}>
                    Read More
                  </Button>
                </RenderIf>
                <Dates
                  startDate={event?.start_date}
                  endDate={event?.end_date}
                  timeZone={event?.timezone}
                />
              </div>
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
                    <p>{event.description}</p>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
          <RenderIf isTrue={!!showEditor}>
            <div className="mt-10 bg-default/30 shadow-sm backdrop-blur-2xl p-6 rounded-xl">
              <RichTextEditor
                editorId={eventId!}
                showHeader={false}
                editable={false}
                hideSideBar
                classNames={{ editorInPreview: 'overflow-y-visible' }}
                onEmptyContent={() => setShowEditor(false)}
              />
            </div>
          </RenderIf>
        </div>
      </div>
    </ThemeEffects>
  )
}
