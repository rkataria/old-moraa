import { ReactNode, useState } from 'react'

import {
  ButtonProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { DateTime } from 'luxon'
import toast from 'react-hot-toast'

import { RenderIf } from './RenderIf/RenderIf'
import { ScheduleEventForm, ScheduleEventFormData } from './ScheduleEventForm'
import { Button } from '../ui/Button'

import type { UseDisclosureReturn } from '@nextui-org/use-disclosure'

import { useEvent } from '@/hooks/useEvent'
import { EventService } from '@/services/event/event-service'
import { nextRoundedHour } from '@/utils/date'

export function ScheduleEventButtonWithModal({
  id = '',
  withoutModal = false,
  actionButtonLabel = 'Schedule Event',
  showLabel = true,
  disclosure,
  buttonProps,
}: {
  id?: string
  withoutModal?: boolean
  actionButtonLabel?: string | ReactNode
  showLabel?: boolean
  disclosure?: UseDisclosureReturn
  buttonProps?: ButtonProps
}) {
  const { eventId }: { eventId: string } = useParams({ strict: false })
  const event = useEvent({ id: eventId })

  const [open, setOpen] = useState<boolean>(false)

  const closeModal = () => {
    setOpen(false)
    disclosure?.onClose()
  }

  const scheduleEventMutation = useMutation({
    mutationFn: (data: {
      id: string
      startDate: string
      endDate: string
      timezone: string
      imageUrl: string
      name: string
      description: string
    }) =>
      EventService.scheduleEvent({
        id: eventId,
        startDate: data.startDate,
        endDate: data.endDate,
        timezone: data.timezone,
        imageUrl: data.imageUrl,
        name: data.name,
        description: data.description,
      }).then(
        () =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              event.refetch().then(resolve).catch(reject)
            }, 1000)
          })
      ),
    onSuccess: () => {
      toast.success('Event scheduled successfully')
      closeModal()
    },
    onError: () => toast.success('Failed to schedule the event'),
  })

  const onSubmit = (formData: ScheduleEventFormData) => {
    const startDate = DateTime.fromISO(
      `${formData.startDate}T${formData.startTime}:00.000`,
      {
        zone: formData.timezone,
      }
    ).toISO()

    const endDate = DateTime.fromISO(
      `${formData.endDate}T${formData.endTime}:00.000`,
      {
        zone: formData.timezone,
      }
    ).toISO()

    scheduleEventMutation.mutate({
      id: eventId,
      startDate: startDate || '',
      endDate: endDate || '',
      timezone: formData.timezone || '',
      imageUrl: formData.imageUrl || event.event.image_url || '',
      name: formData.name || event.event.name || '',
      description: formData.description || event.event.description || '',
    })
  }

  const startDate = DateTime.fromISO(event.event.start_date as string, {
    zone: event.event.timezone as string,
  }).toISO()

  const endDate = DateTime.fromISO(event.event.end_date as string, {
    zone: event.event.timezone as string,
  }).toISO()

  const form = () => (
    <ScheduleEventForm
      id={id}
      defaultValue={{
        startDate:
          startDate?.substring(0, 10) || DateTime.now().toFormat('yyyy-MM-dd'),
        startTime: startDate?.substring(11, 16) || nextRoundedHour(),
        endDate:
          endDate?.substring(0, 10) || DateTime.now().toFormat('yyyy-MM-dd'),
        endTime: endDate?.substring(11, 16) || nextRoundedHour(60),
        timezone: event.event.timezone || DateTime.local().zoneName,
        imageUrl: event.event.image_url as string,
        name: event.event.name as string,
        description: event.event.description as string,
      }}
      onSubmit={onSubmit}
      renderAction={(renderProps) => {
        const render = withoutModal ? renderProps.hasNewChanges : true

        return !render ? null : (
          <div className="flex justify-end my-4">
            <Button
              size="sm"
              variant="bordered"
              className="mr-2"
              onClick={closeModal}
              isDisabled={scheduleEventMutation.isPending}>
              Cancel
            </Button>
            <Button
              size="sm"
              type="submit"
              color="primary"
              variant="solid"
              isLoading={scheduleEventMutation.isPending}>
              Save
            </Button>
          </div>
        )
      }}
    />
  )

  if (withoutModal) {
    return form()
  }

  return (
    <div>
      <RenderIf isTrue={showLabel}>
        <Button
          size="sm"
          variant="solid"
          fullWidth
          gradient="primary"
          onClick={() => setOpen(true)}
          {...buttonProps}>
          {actionButtonLabel}
        </Button>
      </RenderIf>

      <Modal
        size="2xl"
        isOpen={open || disclosure?.isOpen}
        onClose={closeModal}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 bg-primary text-white h-[9.125rem] p-6">
                <h2 className="font-md font-semibold">Schedule event</h2>
                <p className="text-sm font-normal">
                  Change event date and time.
                </p>
              </ModalHeader>
              <ModalBody className="mt-4">
                {event.isLoading ? null : form()}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
