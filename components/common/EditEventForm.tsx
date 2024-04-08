'use client'

import { useEffect } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useMutation } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { Button, Input } from '@nextui-org/react'

import { useEvent } from '@/hooks/useEvent'

import 'react-multi-email/dist/style.css'

interface NewEventFormProps {
  eventId: string
  onClose: () => void
}

const editEventValidationSchema = yup.object({
  // eslint-disable-next-line newline-per-chained-call
  eventName: yup.string().label('Event name').min(3).max(50).required(),
  description: yup
    .string()
    .label('Event description')
    .min(3)
    .max(200)
    .required(),
})

type FormData = yup.InferType<typeof editEventValidationSchema>

export function EditEventForm({
  onClose,
  eventId: _eventId,
}: NewEventFormProps) {
  const { eventId } = useParams()
  const { event, refetch } = useEvent({
    id: (eventId || _eventId) as string,
  })
  const editEventMutation = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      const supabase = createClientComponentClient()
      const response = await supabase
        .from('event')
        .update(data)
        .eq('id', eventId)

      return new Promise((resolve) => {
        setTimeout(async () => {
          await refetch()
          resolve(response)
          onClose()
        }, 1000)
      })
    },
  })

  const editEventForm = useForm<FormData>({
    resolver: yupResolver(editEventValidationSchema),
  })

  useEffect(() => {
    if (!event) return
    editEventForm.reset({
      eventName: event.name,
      description: event.description,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event])

  const editEvent: SubmitHandler<FormData> = async (formData) => {
    if (!event) return

    const payload = {
      name: formData.eventName,
      description: formData.description,
    }
    editEventMutation.mutate(payload)
  }

  return (
    <div>
      <form onSubmit={editEventForm.handleSubmit(editEvent)}>
        <div>
          <Controller
            control={editEventForm.control}
            name="eventName"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                variant="bordered"
                className="mb-4"
                isInvalid={!!fieldState.error?.message}
                errorMessage={fieldState.error?.message}
                label="Event Name"
              />
            )}
          />
          <Controller
            control={editEventForm.control}
            name="description"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                variant="bordered"
                className="mb-4"
                type="textarea"
                isInvalid={!!fieldState.error?.message}
                errorMessage={fieldState.error?.message}
                label="Description"
              />
            )}
          />
          <div className="flex justify-end">
            <Button variant="bordered" className="mr-4" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="solid"
              color="primary"
              type="submit"
              disabled={editEventMutation.isPending}
              isLoading={editEventMutation.isPending}>
              Save
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
