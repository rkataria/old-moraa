import { useState } from 'react'

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import { ChevronDownIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { RxReset } from 'react-icons/rx'

import { DeleteConfirmationModal } from '@/components/common/DeleteConfirmationModal'
import { Button } from '@/components/ui/Button'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { FrameResponseService } from '@/services/frame-response.service'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { toggleStartAndStopActivityAction } from '@/stores/slices/event/current-event/live-session.slice'
import { IFrame } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'
import { cn } from '@/utils/utils'

export function Actions({ frame }: { frame: IFrame }) {
  const [openResetConfirmationModal, setOpenResetConfirmationModal] =
    useState(false)
  const dispatch = useStoreDispatch()

  const session = useStoreSelector(
    (store) => store.event.currentEvent.liveSessionState.activeSession.data
  )

  const pollStarted = session?.data?.framesConfig?.[frame.id]?.pollStarted

  const deleteResponsesMutation = useMutation({
    mutationFn: () =>
      FrameResponseService.deleteResponses(frame.id).then(() => {
        setOpenResetConfirmationModal(false)
      }),
    onSuccess: () =>
      toast.success(
        'All responses were cleared. The poll is now ready for new submissions.'
      ),
    onError: () => toast.success('Failed to reset'),
  })

  if (![FrameType.POLL].includes(frame.type)) return null

  return (
    <>
      <div className={cn('flex items-center h-[50px] rounded-lg border', {})}>
        <Button
          size="sm"
          title="Start session"
          className="!bg-transparent"
          onClick={() => {
            if (!frame) return
            dispatch(
              toggleStartAndStopActivityAction({
                frameId: frame.id,
                activity: 'poll',
              })
            )
          }}>
          {pollStarted ? 'End' : 'Start'} Poll
        </Button>
        <Dropdown placement="bottom-end" className="rounded-md">
          <DropdownTrigger>
            <Button size="sm" isIconOnly className="!bg-transparent">
              <ChevronDownIcon className="rotate-[-90deg]" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            className="p-0"
            onAction={(key) => {
              if (key === 'reset') {
                setOpenResetConfirmationModal(true)
              }
            }}>
            <DropdownItem
              key="reset"
              className="p-2 rounded-md h-8 bg-gray-100 hover:bg-gray-200"
              closeOnSelect>
              <div className="flex items-center gap-3">
                <RxReset size={19} className="text-gray-600" />
                Reset
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <DeleteConfirmationModal
        open={openResetConfirmationModal}
        title="Are you sure you want to reset this poll?"
        description="All current responses will be permanently removed, and
                participants will need to submit their answers again. This
                action cannot be undone."
        onConfirm={() => deleteResponsesMutation.mutate()}
        onClose={() => setOpenResetConfirmationModal(false)}
      />
    </>
  )
}

export function LiveFrameActions() {
  const currentFrame = useCurrentFrame()
  const { isHost } = useEventSession()

  if (!currentFrame) return null
  if (!isHost) return null

  return <Actions frame={currentFrame as IFrame} />
}
