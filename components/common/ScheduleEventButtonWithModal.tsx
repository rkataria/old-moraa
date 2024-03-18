/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import { useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import toast from 'react-hot-toast'

import { Button } from '@nextui-org/react'

import { Modal } from './Modal'
import { ScheduleEventForm, ScheduleEventFormData } from './ScheduleEventForm'

import { TimeZones } from '@/constants/timezone'
import { useEvent } from '@/hooks/useEvent'
import { EventService } from '@/services/event/event-service'

export function ScheduleEventButtonWithModal({
  eventId,
  actionButtonLabel = 'Schedule Event',
}: {
  eventId: string
  actionButtonLabel?: string
}) {
  const event = useEvent({ id: eventId, fetchMeetingSlides: true })
  const [open, setOpen] = useState<boolean>(false)
  const scheduleEventMutation = useMutation({
    mutationFn: (data: {
      id: string
      startDate: string
      endDate: string
      timezone: string
    }) =>
      EventService.scheduleEvent({
        id: eventId,
        start_date: data.startDate,
        end_date: data.endDate,
        timezone: data.timezone,
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
      setOpen(false)
    },
    onError: () => toast.success('Failed to schedule the event'),
  })

  const onSubmit = (formData: ScheduleEventFormData) => {
    const timezone = TimeZones.find((tz) => tz.text === formData.timezone)
    const startDate = DateTime.fromISO(
      `${formData.startDate}T${formData.startTime}:00.000`,
      {
        zone: timezone?.utc[0],
      }
    ).toISO()
    const endDate = DateTime.fromISO(
      `${formData.endDate}T${formData.endTime}:00.000`,
      {
        zone: timezone?.utc[0],
      }
    ).toISO()

    scheduleEventMutation.mutate({
      id: eventId,
      startDate: startDate || '',
      endDate: endDate || '',
      timezone: timezone?.text || '',
    })
  }
  const startDate = DateTime.fromISO(event.event.start_date, {
    zone: TimeZones.find((tz) => tz.text === event.event.timezone)?.utc[0],
  }).toISO()
  const endDate = DateTime.fromISO(event.event.end_date, {
    zone: TimeZones.find((tz) => tz.text === event.event.timezone)?.utc[0],
  }).toISO()

  return (
    <div id="schedule-event-form-with-button">
      <Button
        onClick={() => setOpen(true)}
        variant="solid"
        color="primary"
        size="sm"
        fullWidth>
        {actionButtonLabel}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Schedule event"
        description="Change event date and time.">
        {event.isLoading ? null : (
          <ScheduleEventForm
            defaultValue={{
              startDate: startDate?.substring(0, 10) || '',
              startTime: startDate?.substring(11, 16) || '12:00',
              endDate: endDate?.substring(0, 10) || '',
              endTime: endDate?.substring(11, 16) || '13:00',
              timezone: event.event.timezone,
            }}
            onSubmit={onSubmit}
            renderAction={() => (
              <div className="flex flex-row-reverse">
                <div>
                  <Button
                    variant="bordered"
                    className="mr-2"
                    onClick={() => setOpen(false)}
                    isDisabled={scheduleEventMutation.isPending}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    variant="solid"
                    type="submit"
                    isLoading={scheduleEventMutation.isPending}>
                    Save
                  </Button>
                </div>
              </div>
            )}
          />
        )}
      </Modal>
    </div>
  )
}
