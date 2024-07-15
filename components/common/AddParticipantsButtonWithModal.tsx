/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import { useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'
import { FaLink } from 'react-icons/fa'
import { LuUserPlus } from 'react-icons/lu'

import {
  Button,
  ModalBody,
  ModalContent,
  ModalHeader,
  Modal,
} from '@nextui-org/react'

import {
  AddParticipantsForm,
  ParticipantsFormData,
} from './AddParticipantsForm'

import { useEvent } from '@/hooks/useEvent'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { EventService } from '@/services/event/event-service'

type addParticipant = ParticipantsFormData & {
  closeonSave?: boolean
}

export function ButtonWithModal({ eventId }: { eventId: string }) {
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
      closeonSave = true,
    }: addParticipant) => {
      try {
        const addResponse = await EventService.addParticipant({
          eventId,
          participants: _participants,
        })

        if (JSON.parse(addResponse?.data || '')?.success) {
          refetch()
        }

        toast.success('Participants updated successfully.')
        if (closeonSave) {
          setOpen(false)
        }
      } catch (err) {
        console.error(err)
        toast.error('Failed to update participants')
      }
    },
  })

  return (
    <>
      <Button isIconOnly variant="light" onClick={() => setOpen(true)}>
        <LuUserPlus size={20} className="text-[#52525B]" />
      </Button>

      <Modal size="2xl" isOpen={open} onClose={() => setOpen(false)}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 bg-primary text-white h-[9.125rem] p-6">
                <h2 className="font-md font-semibold">Invite People</h2>
                <p className="text-sm font-normal">
                  Add participants, moderators and co-creators using their email
                  address
                </p>
              </ModalHeader>
              <ModalBody className="mt-4">
                <AddParticipantsForm
                  key={JSON.stringify(participants)}
                  defaultValue={
                    participants?.map((participant) => ({
                      email: participant.email,
                      isHost: participant.event_role === 'Host',
                      participantId: participant.id,
                      role: participant.event_role,
                    })) || []
                  }
                  onSubmit={addParticipantsMutation.mutate}
                  addParticipantsMutation={addParticipantsMutation}
                  onParticipantRemove={async (participantId) => {
                    await deleteParticipantMutation.mutateAsync(participantId)
                  }}
                  renderAction={({ showActions = false }) => (
                    <div className="flex justify-between my-4 border-t pt-3">
                      <CopyToClipboard
                        text={`${window.location.origin}/enroll/${eventId}`}
                        onCopy={() => toast.success('Copied')}>
                        <Button
                          variant="light"
                          className="text-blue-400 px-0 hover:bg-transparent"
                          startContent={<FaLink />}
                          disableAnimation
                          disableRipple>
                          Copy Link
                        </Button>
                      </CopyToClipboard>

                      {showActions && (
                        <div className="flex items-center">
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

export function AddParticipantsButtonWithModal({
  eventId,
}: {
  eventId: string
}) {
  const { permissions } = useEventPermissions()

  if (!permissions.canManageEnrollment) {
    return null
  }

  return <ButtonWithModal eventId={eventId} />
}
