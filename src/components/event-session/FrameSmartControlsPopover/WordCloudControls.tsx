import { useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Button } from '@/components/ui/Button'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { FrameResponseService } from '@/services/frame-response.service'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { toggleStartAndStopActivityAction } from '@/stores/slices/event/current-event/live-session.slice'
import { PresentationStatuses } from '@/types/event-session.type'

export function WordCloudControls() {
  const { presentationStatus } = useEventSession()
  const [openResetConfirmationModal, setOpenResetConfirmationModal] =
    useState(false)
  const frame = useCurrentFrame()
  const dispatch = useStoreDispatch()
  const session = useStoreSelector(
    (store) => store.event.currentEvent.liveSessionState.activeSession.data
  )
  const deleteResponsesMutation = useMutation({
    mutationFn: () =>
      FrameResponseService.deleteResponses(frame?.id as string).then(() => {
        setOpenResetConfirmationModal(false)
      }),
    onSuccess: () =>
      toast.success(
        'All responses were cleared. The word cloud is now ready for new submissions.'
      ),
    onError: () => toast.success('Failed to reset'),
  })
  if (!frame) return null

  const wordCloudStarted =
    session?.data?.framesConfig?.[frame.id]?.wordCloudStarted

  return (
    <>
      <RenderIf isTrue={presentationStatus === PresentationStatuses.STARTED}>
        <Button
          title="Start Word cloud"
          color={wordCloudStarted ? 'danger' : 'primary'}
          onClick={() => {
            dispatch(
              toggleStartAndStopActivityAction({
                frameId: frame.id,
                activity: 'wordCloud',
              })
            )
          }}>
          {wordCloudStarted ? 'End' : 'Start'} Word cloud
        </Button>
      </RenderIf>
      <Button
        title="Reset"
        disabled={wordCloudStarted}
        onClick={() => {
          if (wordCloudStarted) return
          setOpenResetConfirmationModal(true)
        }}>
        Reset cloud
      </Button>

      <ConfirmationModal
        open={openResetConfirmationModal}
        title="Are you sure you want to reset this Word cloud?"
        description="All current responses will be permanently removed, and
                participants will need to submit their answers again. This
                action cannot be undone."
        onConfirm={() => deleteResponsesMutation.mutate()}
        onClose={() => setOpenResetConfirmationModal(false)}
      />
    </>
  )
}
