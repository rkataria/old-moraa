/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import { useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import { UserRoundPlusIcon } from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@nextui-org/react'

import {
  AddParticipantsForm,
  ParticipantsFormData,
} from './AddParticipantsForm'
import { Modal } from './Modal'

import { useEvent } from '@/hooks/useEvent'
import { EventService } from '@/services/event/event-service'

const styles = {
  button: {
    default:
      'flex justify-center items-center hover:bg-gray-800 hover:text-white transition-all duration-200 rounded-md',
  },
}

export function AddParticipantsButtonWithModal({
  eventId,
}: {
  eventId: string
}) {
  const [open, setOpen] = useState<boolean>(false)
  const { participants, refetch } = useEvent({
    id: eventId,
  })
  const deleteParticipantMutation = useMutation({
    mutationFn: async (participantId: string) => {
      await EventService.deleteParticipant({ eventId, participantId })
      await refetch()
      toast.success('Participant deleted successfully')
    },
    onError: () => toast.error('Failed to delete the participant.'),
  })

  const addParticipantsMutation = useMutation({
    mutationFn: async ({
      participants: _participants,
    }: ParticipantsFormData) => {
      try {
        await EventService.addParticipant({
          eventId,
          participants: _participants,
        })
        refetch()
        toast.success('Participants updated successfully.')
        setOpen(false)
      } catch (err) {
        console.error(err)
        toast.error('Failed to update participants')
      }
    },
  })

  return (
    <>
      <Button
        isIconOnly
        onClick={() => setOpen(true)}
        className={clsx(
          styles.button.default,
          'cursor-pointer font-normal text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900 !rounded-full p-3'
        )}>
        <UserRoundPlusIcon />
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add Participants"
        description="Add participants to the event">
        <AddParticipantsForm
          defaultValue={
            participants?.map((participant) => ({
              email: participant.email,
              isHost: participant.event_role === 'Host',
              participantId: participant.id,
            })) || []
          }
          onSubmit={addParticipantsMutation.mutate}
          onParticipantRemove={async (participantId) => {
            await deleteParticipantMutation.mutateAsync(participantId)
          }}
          renderAction={() => (
            <div className="flex justify-end">
              <Button
                variant="bordered"
                color="default"
                className="mr-2"
                onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="solid"
                isLoading={addParticipantsMutation.isPending}>
                Save
              </Button>
            </div>
          )}
        />
      </Modal>
    </>
  )
}
