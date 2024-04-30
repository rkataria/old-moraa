/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import { useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

import {
  Button,
  ButtonProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@nextui-org/react'

import { CreateEventFormData, NewEventForm } from './NewEventForm'

import { useAuth } from '@/hooks/useAuth'
import { EventService } from '@/services/event.service'

interface ICreateEventButtonWithModal {
  buttonLabel: string
  buttonProps: ButtonProps
}

export function CreateEventButtonWithModal({
  buttonLabel,
  buttonProps,
}: ICreateEventButtonWithModal) {
  const [open, setOpen] = useState<boolean>(false)
  const { currentUser } = useAuth()

  const router = useRouter()

  const createEventMutation = useMutation({
    mutationFn: EventService.createEvent,
  })
  const onSubmit = async (values: CreateEventFormData) => {
    if (!currentUser) return

    // eslint-disable-next-line consistent-return
    return createEventMutation.mutateAsync(
      {
        name: values.name,
        description: values.description || '',
        type: values.eventType,
        owner_id: currentUser.id,
        start_date: null,
        end_date: null,
      },
      {
        onSuccess: ({ data }) => {
          if (data) {
            setOpen(false)
            toast.success('Event has been created!')
            router.push(`/events/${data.id}`)
          }
        },
      }
    )
  }

  return (
    <>
      <Button {...buttonProps} onClick={() => setOpen(true)}>
        {buttonLabel}
      </Button>

      <Modal size="2xl" isOpen={open} onClose={() => setOpen(false)}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 bg-primary text-white h-[9.125rem] p-6">
                <h2 className="font-md font-semibold">
                  Create new learning event
                </h2>
                <p className="text-sm font-normal">
                  Give your learning event a name and an optional description to
                  get going!
                </p>
              </ModalHeader>
              <ModalBody className="mt-4">
                <NewEventForm
                  onSubmit={onSubmit}
                  renderAction={() => (
                    <div className="flex justify-end mb-4">
                      <Button
                        variant="bordered"
                        className="mr-2"
                        onClick={() => setOpen(false)}
                        isDisabled={createEventMutation.isPending}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        color="primary"
                        variant="solid"
                        isLoading={createEventMutation.isPending}>
                        Create
                      </Button>
                    </div>
                  )}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
