import { useState } from 'react'

import { Button } from '@nextui-org/react'
import { IconTrash } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { BsThreeDotsVertical } from 'react-icons/bs'

import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal'
import { DropdownActions } from '../common/DropdownActions'

import { EventService } from '@/services/event/event-service'

const ownerActions = [
  {
    key: 'delete-event',
    label: 'Delete',
    icon: <IconTrash className="h-4 w-4 text-red-500" />,
  },
]

const participantActions: typeof ownerActions = []

export function EventActionsWithModal({
  event,
  isOwner,
  onDone,
}: {
  event: { id: string; name: string }
  isOwner: boolean
  onDone: () => void
}) {
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

  if (actions.length === 0) return null

  return (
    <>
      <DropdownActions
        triggerIcon={
          <Button isIconOnly size="sm" variant="light" radius="full">
            <BsThreeDotsVertical />
          </Button>
        }
        actions={actions}
        onAction={(actionKey) => {
          if (actionKey === 'delete-event') {
            setDeleteConfirmationVisible(true)
          }
        }}
      />

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
