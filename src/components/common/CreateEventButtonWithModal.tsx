import { ReactNode, useState } from 'react'

import {
  Button,
  ButtonProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'react-hot-toast'
import { useHotkeys } from 'react-hotkeys-hook'

import { ContentLoading } from './ContentLoading'
import { CreateEventFormData, NewEventForm } from './NewEventForm'

import type { UseDisclosureReturn } from '@nextui-org/use-disclosure'

import { useAuth } from '@/hooks/useAuth'
import { EventService } from '@/services/event.service'
import { cn } from '@/utils/utils'

interface ICreateEventButtonWithModal {
  isEdit?: boolean
  buttonLabel?: string | ReactNode
  buttonProps?: ButtonProps
  defaultValues?: {
    name: string
    description: string | undefined
    eventType: string
    id: string
    imageUrl: string | null | undefined
  }
  disclosure?: UseDisclosureReturn
  onDone?: () => void
}

export function CreateEventButtonWithModal({
  isEdit,
  buttonLabel,
  buttonProps,
  defaultValues,
  disclosure,
  onDone,
}: ICreateEventButtonWithModal) {
  const [open, setOpen] = useState<boolean>(false)
  const { currentUser } = useAuth()
  const [showPageLoader, setShowPageLoader] = useState(false)
  useHotkeys('n', () => setOpen(true), [])
  const router = useRouter()

  const eventService = isEdit
    ? EventService.updateEvent
    : EventService.createEvent

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eventMutation = useMutation<any>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: eventService as any,
  })
  const onSubmit = async (values: CreateEventFormData) => {
    if (!currentUser) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let payload: any

    if (isEdit) {
      payload = {
        eventId: defaultValues?.id || '',
        data: {
          name: values.name,
          description: values.description || '',
          image_url: values.imageUrl,
        },
      }
    } else {
      payload = {
        name: values.name,
        description: values.description || '',
        type: values.eventType,
        owner_id: currentUser.id,
        start_date: null,
        end_date: null,
        image_url: values.imageUrl,
      }
    }

    // eslint-disable-next-line consistent-return
    return eventMutation.mutateAsync(payload, {
      onSuccess: ({ data }) => {
        if (isEdit) {
          onDone?.()
          closeModal()
          toast.success('Event has been updated!')

          return
        }

        if (data) {
          closeModal()
          toast.success('Event has been created!')
          router.navigate({ to: `/events/${data.id}` })
          setShowPageLoader(true)
        }
      },
    })
  }

  if (showPageLoader) {
    return <ContentLoading fullPage />
  }

  const getHeaderTitle = () => {
    if (isEdit) {
      return `Edit ${defaultValues?.name}`
    }

    return 'Create new learning event'
  }

  const closeModal = () => {
    setOpen(false)
    disclosure?.onClose()
  }

  return (
    <>
      {buttonLabel && (
        <Button {...buttonProps} onClick={() => setOpen(true)}>
          {buttonLabel}
        </Button>
      )}

      <Modal
        size="2xl"
        isOpen={open || disclosure?.isOpen}
        onClose={closeModal}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 bg-primary text-white h-[9.125rem] p-6">
                <h2 className="font-md font-semibold">{getHeaderTitle()}</h2>
                <p className="text-sm font-normal">
                  Give your learning event a name and an optional description to
                  get going!
                </p>
              </ModalHeader>
              <ModalBody className="mt-4">
                <NewEventForm
                  onSubmit={onSubmit}
                  defaultValue={defaultValues}
                  renderAction={({ disableAction }) => (
                    <div className="flex justify-end mb-4">
                      <Button
                        type="submit"
                        color="primary"
                        variant="solid"
                        disabled={disableAction}
                        isLoading={eventMutation.isPending}
                        className={cn({
                          'opacity-100': !disableAction,
                          'opacity-50 hover:opacity-50': disableAction,
                        })}>
                        {isEdit ? 'Update' : 'Create'}
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
