import { useState } from 'react'

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@heroui/react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { ChevronDownIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { GrTestDesktop } from 'react-icons/gr'
import { RiCalendarScheduleLine } from 'react-icons/ri'

import { FrameDetailsView } from './overview-frame/FrameDetailsView'
import { ScheduleEventButtonWithModal } from '../common/ScheduleEventButtonWithModal'
import { Tooltip } from '../common/ShortuctTooltip'
import { Button } from '../ui/Button'

import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { EventService } from '@/services/event.service'
import { EventStatus } from '@/types/enums'

export function PublishButton({
  eventStatus,
  eventId,
  refetchEvent,
}: {
  eventStatus: string
  eventId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetchEvent: any
}) {
  const scheduleModal = useDisclosure()
  const router = useRouter()
  const { permissions } = useEventPermissions()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const { sections } = useEventContext()

  const publishMutation = useMutation({
    mutationFn: async () => {
      await EventService.publishEvent({ id: eventId })
    },
    onError: () => {
      console.error('Failed to publish the event.')
    },
    onSuccess: () => {
      toast.success('Event Published: Content is now accessible to learners.', {
        duration: 3000,
      })

      refetchEvent()
    },
  })

  function validatePublish() {
    return sections.every((section) =>
      section.frames.every((frame) => frame.type)
    )
  }

  const handlePublish = () => {
    if (!validatePublish()) {
      toast.error(
        'Event cannot be published: Some frames have missing types. Please assign a type to all frames before publishing.'
      )

      return
    }
    publishMutation.mutate()
  }

  if (
    eventStatus === EventStatus.ACTIVE ||
    eventStatus !== EventStatus.SCHEDULED
  ) {
    return null
  }

  if (!permissions.canUpdateFrame) return null

  return (
    <>
      <div className="flex justify-center items-center gap-0 overflow-hidden">
        <Tooltip content="Publish">
          <Button
            size="sm"
            className="rounded-e-none"
            variant="solid"
            onClick={() => setShowConfirmationModal(true)}>
            Publish
          </Button>
        </Tooltip>
        <Dropdown placement="bottom-end" className="rounded-md">
          <DropdownTrigger>
            <Button
              color="primary"
              size="sm"
              variant="solid"
              isIconOnly
              className="rounded-s-none">
              <ChevronDownIcon />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            className="p-0"
            onAction={(key) => {
              if (key === 'live-session') {
                router.navigate({ to: `/event-session/${eventId}` })
              }
              if (key === 're-schedule') {
                scheduleModal.onOpen()
              }
            }}>
            <DropdownItem
              key="re-schedule"
              className="p-2 rounded-md h-8 hover:bg-gray-200"
              closeOnSelect>
              <div className="flex items-center gap-3">
                <RiCalendarScheduleLine size={19} className="text-gray-600" />
                Re-schedule event
              </div>
            </DropdownItem>
            <DropdownItem
              key="live-session"
              className="p-2 rounded-md h-8 hover:bg-gray-200 flex items-center gap-2"
              closeOnSelect>
              <div className="flex items-center gap-3">
                <GrTestDesktop size={18} className="text-gray-600" />
                Test live session
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <ScheduleEventButtonWithModal
        id="re-schedule"
        showLabel={false}
        disclosure={scheduleModal}
      />
      <Modal
        scrollBehavior="inside"
        size="5xl"
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}>
        <ModalContent className="overflow-hidden">
          {() => (
            <>
              <ModalHeader className="flex items-center justify-between gap-1 bg-primary text-white h-[9.125rem] p-6 pr-10">
                <div className="grid">
                  <div className="flex items-center justify-between">
                    <h2 className="font-md font-semibold">Publish event</h2>
                  </div>
                  <p className="text-sm font-normal">
                    Once your event is published, it cannot be unpublished.
                    Please ensure all details are correct before confirming.
                  </p>
                </div>

                <Button
                  size="sm"
                  color="default"
                  variant="bordered"
                  className="text-sm text-white"
                  isLoading={publishMutation.isPending}
                  onClick={handlePublish}>
                  Yes , Publish
                </Button>
              </ModalHeader>
              <ModalBody className="mt-4">
                <FrameDetailsView />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
