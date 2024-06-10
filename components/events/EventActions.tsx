import { useState } from 'react'

import { IconTrash } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { CiEdit } from 'react-icons/ci'
import { IoEyeOutline } from 'react-icons/io5'

import { Button } from '@nextui-org/react'

import { CreateEventButtonWithModal } from '../common/CreateEventButtonWithModal'
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal'

import { EventService } from '@/services/event/event-service'

const ownerActions = [
  {
    key: 'view',
    label: 'Delete',
  },
  {
    key: 'edit',
    label: 'Edit',
    icon: <CiEdit className="w-[1.125rem] h-[1.125rem] text-slate-500" />,
  },
  {
    key: 'delete-event',
    label: 'Delete',
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
  event,
  isOwner,
  onDone,
}: {
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
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false)

  const deleteEventMutation = useMutation({
    mutationFn: () =>
      EventService.deleteEvent({ eventId: event.id }).then(() => {
        onDone()
        setDeleteConfirmationVisible(false)
      }),
    onSuccess: () => toast.success('Event deleted'),
    onError: () => toast.success('Failed to delete event'),
  })

  const actions = isOwner ? ownerActions : participantActions

  const renderAction = (actionKey: string) => {
    if (actionKey === 'view') {
      return (
        <Button
          isIconOnly
          variant="light"
          onClick={() => router.push(`/events/${event.id}`)}
          className="w-auto h-auto hover:bg-transparent">
          <IoEyeOutline className="w-[1.125rem] h-[1.125rem] text-slate-500" />
        </Button>
      )
    }
    if (actionKey === 'delete-event') {
      return (
        <Button
          isIconOnly
          variant="light"
          onClick={() => setDeleteConfirmationVisible(true)}
          className="w-auto h-auto hover:bg-transparent">
          <IconTrash className="w-[1.125rem] h-[1.125rem]  text-red-500" />
        </Button>
      )
    }

    return (
      <CreateEventButtonWithModal
        isEdit
        defaultValues={{
          name: event.name,
          description: event?.description,
          eventType: 'workshop',
          id: event.id,
          imageUrl: event.image_url || '',
        }}
        buttonLabel={
          <CiEdit className="w-[1.125rem] h-[1.125rem] text-slate-500" />
        }
        buttonProps={{
          className: 'w-auto h-auto hover:bg-transparent',
          variant: 'light',
          isIconOnly: true,
        }}
        onDone={onDone}
      />
    )
  }

  if (actions.length === 0) return null

  return (
    <>
      <div className="flex items-center gap-2">
        {actions.map((action) => renderAction(action.key))}
      </div>

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
    </>
  )
}
