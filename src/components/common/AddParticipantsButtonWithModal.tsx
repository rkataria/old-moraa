/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useState } from 'react'

import {
  ModalBody,
  ModalContent,
  ModalHeader,
  Modal,
  ButtonProps,
} from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'
import { FaLink } from 'react-icons/fa'
import { LuUserPlus } from 'react-icons/lu'

import {
  AddParticipantsForm,
  ParticipantsFormData,
} from './AddParticipantsForm'
import { ControlButton } from './ControlButton'
import { RenderIf } from './RenderIf/RenderIf'
import { Button } from '../ui/Button'

import type { UseDisclosureReturn } from '@nextui-org/use-disclosure'

import { useEvent } from '@/hooks/useEvent'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { EventService } from '@/services/event/event-service'
import { cn } from '@/utils/utils'

type addParticipant = ParticipantsFormData & {
  closeonSave?: boolean
}

export function ButtonWithModal({
  showLabel = true,
  buttonProps = {},
  disclosure,
}: {
  showLabel?: boolean
  buttonProps?: ButtonProps
  disclosure?: UseDisclosureReturn
}) {
  const { eventId = '' } = useParams({ strict: false })

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
          closeModal()
        }
      } catch (err) {
        console.error(err)
        toast.error('Failed to update participants')
      }
    },
  })

  const closeModal = () => {
    setOpen(false)
    disclosure?.onClose()
  }

  return (
    <>
      <RenderIf isTrue={showLabel}>
        <ControlButton
          buttonProps={{
            size: 'sm',
            variant: 'light',
            disableRipple: true,
            disableAnimation: true,
            className: cn('live-button', {
              active: open,
            }),
            startContent: (
              <LuUserPlus size={20} className={open ? 'text-primary' : ''} />
            ),
          }}
          tooltipProps={{
            label: 'Invite and include participants',
          }}
          onClick={() => setOpen(true)}>
          {buttonProps.children || <>Invite</>}
        </ControlButton>
      </RenderIf>

      <Modal
        size="2xl"
        isOpen={open || disclosure?.isOpen}
        onClose={closeModal}>
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
                      profile: participant.profile,
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
                        onCopy={() =>
                          toast.success(
                            'Event link copied! Share this link to allow others to enroll, view details, and join the event.',
                            {
                              duration: 4000,
                            }
                          )
                        }>
                        <Button
                          size="sm"
                          variant="light"
                          className="px-0 text-blue-400 !bg-transparent"
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
                            onClick={closeModal}>
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
    </>
  )
}

export function AddParticipantsButtonWithModal({
  showLabel = true,
  triggerButtonProps,
  disclosure,
}: {
  showLabel?: boolean
  triggerButtonProps?: ButtonProps
  disclosure?: UseDisclosureReturn
}) {
  const { permissions } = useEventPermissions()

  if (!permissions.canManageEnrollment) {
    return null
  }

  return (
    <ButtonWithModal
      buttonProps={triggerButtonProps}
      disclosure={disclosure}
      showLabel={showLabel}
    />
  )
}
