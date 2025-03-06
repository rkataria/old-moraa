import { useState } from 'react'

import { useDyteSelector } from '@dytesdk/react-web-core'
import { Tooltip } from '@heroui/tooltip'
import { useIsMutating } from '@tanstack/react-query'

import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { StartPlannedBreakoutModal } from '@/components/frames/frame-types/Breakout/StartPlannedBreakoutModal'
import { Button } from '@/components/ui/Button'
import { useBreakoutManagerContext } from '@/contexts/BreakoutManagerContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { PresentationStatuses } from '@/types/event-session.type'
import { FrameType } from '@/utils/frame-picker.util'

export function BreakoutControls() {
  const [openStartBreakoutModal, setOpenStartBreakoutModal] = useState(false)
  const { presentationStatus } = useEventSession()
  const frame = useCurrentFrame()
  const { isBreakoutActive } = useBreakoutRooms()
  const { handleBreakoutEndWithTimerDialog } = useBreakoutManagerContext()
  const participants = useDyteSelector((state) => state.participants.joined)
  const sessionBreakoutFrameId = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.breakoutFrameId || null
  )

  const startBreakoutMutationLoading = useIsMutating({
    exact: true,
    mutationKey: ['START_BREAKOUT'],
    status: 'pending',
  })

  if (!frame) return null
  if (frame.type !== FrameType.BREAKOUT) return null

  const isNoParticipantsInRoom = !!participants.toArray().length
  const isBreakoutActiveOnAnotherFrame =
    isBreakoutActive && frame.id !== sessionBreakoutFrameId
  const showEndBreakoutButton =
    isBreakoutActive && frame.id === sessionBreakoutFrameId

  return (
    <>
      <RenderIf
        isTrue={
          !showEndBreakoutButton &&
          presentationStatus === PresentationStatuses.STARTED
        }>
        <Tooltip
          content={
            isBreakoutActiveOnAnotherFrame
              ? 'Breakout is active on another frame'
              : isNoParticipantsInRoom
                ? 'Cannot start the breakout without participants.'
                : ''
          }
          hidden={isNoParticipantsInRoom && !isBreakoutActiveOnAnotherFrame}>
          <Button
            title="Start breakout"
            color="primary"
            isLoading={!!startBreakoutMutationLoading}
            disabled={isBreakoutActive || !participants.toArray().length}
            disableRipple={!participants.toArray().length}
            disableAnimation={!participants.toArray().length}
            onPress={() => {
              setOpenStartBreakoutModal(true)
            }}>
            {startBreakoutMutationLoading
              ? 'Starting Breakout'
              : 'Start Breakout'}
          </Button>
        </Tooltip>
      </RenderIf>
      <RenderIf isTrue={showEndBreakoutButton}>
        <Button
          title="End breakout"
          className="bg-red-500 text-white"
          onPress={() => handleBreakoutEndWithTimerDialog()}>
          End Breakout
        </Button>
      </RenderIf>
      <StartPlannedBreakoutModal
        open={openStartBreakoutModal}
        setOpen={setOpenStartBreakoutModal}
      />
    </>
  )
}
