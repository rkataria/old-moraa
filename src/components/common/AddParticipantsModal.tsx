import { ModalBody, ModalContent, ModalHeader, Modal } from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import CopyToClipboard from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'
import { FaLink } from 'react-icons/fa'

import {
  AddParticipantsForm,
  ParticipantsFormData,
} from './AddParticipantsForm'
import { Button } from '../ui/Button'

import { useEvent } from '@/hooks/useEvent'
import { EventService } from '@/services/event/event-service'

type AddParticipant = ParticipantsFormData & {
  closeonSave?: boolean
}

export function AddParticipantsModal({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const { eventId } = useParams({ strict: false })
  const { participants, refetch } = useEvent({
    id: eventId!,
  })
  const deleteParticipantMutation = useMutation({
    mutationFn: async (participantId: string) => {
      await EventService.deleteParticipant({ eventId: eventId!, participantId })
      await refetch()
      toast.success('Participant deleted successfully')
    },
    onError: () => toast.error('Failed to delete the participant.'),
  })

  const addParticipantsMutation = useMutation({
    mutationFn: async ({
      participants: _participants,
      closeonSave = true,
    }: AddParticipant) => {
      try {
        const addResponse = await EventService.addParticipant({
          eventId: eventId!,
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
    <Modal size="2xl" isOpen={open} onClose={() => setOpen(false)}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 bg-primary text-white h-[9.125rem] p-6">
              <h2 className="font-semibold font-md">Invite People</h2>
              <p className="text-sm font-normal">
                Add participants, moderators and co-creators using their email
                address
              </p>
            </ModalHeader>
            <ModalBody className="mt-4">
              <AddParticipantsForm
                defaultValue={
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  participants?.map((participant: any) => ({
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
                  <div className="flex justify-between pt-3 my-4 border-t">
                    <CopyToClipboard
                      text={`${window.location.origin}/enroll/${eventId}`}
                      onCopy={() => toast.success('Copied')}>
                      <Button
                        size="sm"
                        variant="light"
                        className="px-0 text-blue-400 hover:bg-transparent"
                        startContent={<FaLink />}
                        disableAnimation
                        disableRipple>
                        Copy Link
                      </Button>
                    </CopyToClipboard>

                    {showActions && (
                      <div className="flex items-center">
                        <Button
                          size="sm"
                          variant="bordered"
                          color="default"
                          className="mr-2"
                          onClick={() => setOpen(false)}>
                          Close
                        </Button>
                        <Button
                          size="sm"
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
  )
}
