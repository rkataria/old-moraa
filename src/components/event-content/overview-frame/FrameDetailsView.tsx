/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'

import {
  Button,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react'
import { useParams } from '@tanstack/react-router'

import { Editor as RichTextEditor } from '@/components/common/content-types/RichText/Editor'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { IUserProfile, UserAvatar } from '@/components/common/UserAvatar'
import { Dates } from '@/components/enroll/Date'
import { Participantslist } from '@/components/enroll/ParticipantList'
import { useEvent } from '@/hooks/useEvent'
import { cn } from '@/utils/utils'

export function FrameDetailsView() {
  const { eventId }: { eventId: string } = useParams({ strict: false })
  const [showEditor, setShowEditor] = useState(true)

  const descriptionModalDisclosure = useDisclosure()

  const useEventData = useEvent({
    id: eventId as string,
    validateWithUser: false,
  })
  const { event, participants, profile } = useEventData

  if (!event) return null

  return (
    <div className="overflow-y-auto scrollbar-none h-full relative z-[50] pb-40">
      <div className="pt-4">
        <div className="grid grid-cols-[60%_27%] items-start gap-6">
          <div className="h-full flex flex-col gap-5 w-auto bg-white rounded-md p-4">
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
                  classNames={{ editorInPreview: 'overflow-y-visible' }}
                  onEmptyContent={() => setShowEditor(false)}
                />
              </div>
            </RenderIf>
          </div>
          <div className="flex flex-col gap-6">
            <Image
              src={
                event?.image_url ||
                'https://images.unsplash.com/photo-1525351159099-81893194469e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBhcnR5JTIwaW52aXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D'
              }
              classNames={{
                wrapper: 'w-full h-full',
                img: 'w-full object-cover rounded-lg shadow-xl aspect-square',
              }}
            />
            <Dates
              startDate={event?.start_date as string}
              endDate={event?.end_date as string}
              timeZone={event?.timezone as string}
              className="pl-1"
            />
            <div>
              <p className="text-sm font-medium text-slate-500">Hosted by</p>
              <Divider className="mt-2 mb-3" />
              <UserAvatar
                profile={profile as IUserProfile}
                withName
                nameClass="font-medium"
              />
            </div>

            <Participantslist participants={participants as any} />
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
    </div>
  )
}
