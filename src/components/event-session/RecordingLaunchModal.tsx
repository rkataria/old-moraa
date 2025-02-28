import { useEffect } from 'react'

import { Modal, ModalContent, ModalBody } from '@heroui/react'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useRecording } from '@/hooks/useRecording'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { setRecordingLaunchModalAction } from '@/stores/slices/event/current-event/live-session.slice'

export function RecordingLaunchModal() {
  const { isHost } = useEventSession()
  const dispatch = useStoreDispatch()
  const { isRecording } = useRecording()

  const isOpen = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.recording.notify
  )

  useEffect(() => {
    if (!isOpen || !isRecording) return

    dispatch(setRecordingLaunchModalAction(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording, isOpen])

  if (!isOpen) return null

  return (
    <Modal
      hideCloseButton
      size="lg"
      isDismissable
      isOpen={isOpen}
      onOpenChange={(value) => {
        dispatch(setRecordingLaunchModalAction(value))
      }}>
      <ModalContent className="rounded-3xl w-[25rem]">
        {() => (
          <ModalBody className="m-0 p-2 pb-10 rounded-2xl">
            <div className="relative w-[100%] h-[200px] grid place-items-center">
              {Array(7)
                .fill(0)
                .map((_, index) => (
                  <div
                    style={{
                      width: `${40 + index * 70}px`,
                      height: `${40 + index * 70}px`,
                      opacity: 1 - index / 6,
                      backgroundColor: 'rgba(255,0,0,0.05)',
                    }}
                    className="absolute border border-red-100 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-full"
                  />
                ))}
              <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[40px] h-[40px] bg-red-600 rounded-full animate-pulse" />
            </div>

            <div className="text-center flex flex-col gap-6 mt-1">
              <p className="text-2xl relative font-semibold text-black/80">
                {isHost ? 'Capturing the Moment!' : 'Recording started'}
              </p>
              <p className="text-xs text-gray-700 px-10">
                {isHost
                  ? 'We are starting the recording for your session. Hang tight for just a moment!'
                  : 'This session is now being recorded. Stay tuned!'}
              </p>
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  )
}
