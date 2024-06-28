import { Key, useState } from 'react'

import { IconTrash } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { CiEdit } from 'react-icons/ci'
import { IoEllipsisVerticalOutline, IoEyeOutline } from 'react-icons/io5'

import { Button, useDisclosure } from '@nextui-org/react'

import { CreateEventButtonWithModal } from '../common/CreateEventButtonWithModal'
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal'
import { DropdownActions } from '../common/DropdownActions'

import { EventService } from '@/services/event/event-service'

const ownerActions = [
  {
    key: 'view',
    label: 'View',
    icon: <IoEyeOutline className="w-[1.125rem] h-[1.125rem] text-slate-500" />,
  },
  {
    key: 'edit',
    label: 'Edit',
    icon: <CiEdit className="w-[1.125rem] h-[1.125rem] text-slate-500" />,
  },
  {
    key: 'delete-event',
    label: 'Delete',
    icon: <IconTrash className="w-[1.125rem] h-[1.125rem]  text-red-500" />,
  },
]

const participantActions: typeof ownerActions = [
  {
    key: 'view',
    label: 'View',
    icon: <IoEyeOutline className="text-[1.125rem] text-slate-600" />,
  },
]

export function EventActions({
  as,
  event,
  isOwner,
  onDone,
}: {
  as?: 'dropdown'
  event: {
    id: string
    name: string
    description?: string
    image_url: string | null | undefined
  }
  isOwner: boolean

  onDone: () => void
}) {
  const router = useRouter()
  const editEventModal = useDisclosure()

  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false)

  const actions = isOwner ? ownerActions : participantActions

  const deleteEventMutation = useMutation({
    mutationFn: () =>
      EventService.deleteEvent({ eventId: event.id }).then(() => {
        onDone()
        setDeleteConfirmationVisible(false)
      }),
    onSuccess: () => toast.success('Event deleted'),
    onError: () => toast.success('Failed to delete event'),
  })

  if (actions.length === 0) return null

  const actionHandler = (key: Key) => {
    if (key === 'delete-event') {
      setDeleteConfirmationVisible(true)
    }

    if (key === 'edit') {
      editEventModal.onOpen()
    }

    if (key === 'view') {
      router.push(`/events/${event.id}`)
    }
  }

  const getActionView = () => {
    if (as === 'dropdown') {
      return (
        <DropdownActions
          triggerIcon={
            <Button
              isIconOnly
              size="sm"
              variant="light"
              radius="full"
              className="shrink-0">
              <IoEllipsisVerticalOutline className="flex shrink-0 text-xl text-gray-600 cursor-pointer" />
            </Button>
          }
          actions={actions}
          onAction={actionHandler}
        />
      )
    }

    return (
      <div className="flex items-center gap-2">
        {actions.map((action) => (
          <Button
            isIconOnly
            variant="light"
            onClick={() => actionHandler(action.key)}
            className="w-auto h-auto flex items-center !gap-2 hover:bg-transparent">
            {action.icon}
          </Button>
        ))}
      </div>
    )
  }

  return (
    <>
      {getActionView()}
      <DeleteConfirmationModal
        open={deleteConfirmationVisible}
        description={
          <p>
            Are you sure want to delete the event{' '}
            <span className="font-bold">{event.name}</span>?
          </p>
        }
        onClose={() => setDeleteConfirmationVisible(false)}
        onConfirm={() => deleteEventMutation.mutate()}
      />

      <CreateEventButtonWithModal
        isEdit
        disclosure={editEventModal}
        defaultValues={{
          name: event.name,
          description: event?.description,
          eventType: 'workshop',
          id: event.id,
          imageUrl: event.image_url || '',
        }}
        buttonProps={{
          className:
            'w-auto h-auto flex items-center !gap-2 hover:bg-transparent',
          variant: 'light',
          isIconOnly: true,
        }}
        onDone={onDone}
      />
    </>
  )
}
