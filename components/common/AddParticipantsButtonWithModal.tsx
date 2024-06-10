/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import { useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'
import { FaLink } from 'react-icons/fa'
import { GoShareAndroid } from 'react-icons/go'

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
        const addResponse = await EventService.addParticipant({
          eventId,
          participants: _participants,
        })

        if (JSON.parse(addResponse?.data || '')?.success) {
          refetch()
        }

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
        <GoShareAndroid className="text-xl" />
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
