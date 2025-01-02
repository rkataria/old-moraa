import { useEffect, useState } from 'react'

import { Modal, ModalContent, ModalBody, Image } from '@nextui-org/react'
import { useDispatch } from 'react-redux'

import { RenderIf } from '../RenderIf/RenderIf'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreSelector } from '@/hooks/useRedux'
import { notificationDuration } from '@/utils/breakout.utils'
import { cn } from '@/utils/utils'

export function Notify() {
  const [timeLeft, setTimeLeft] = useState(notificationDuration)
  const dispatch = useDispatch()
  const { isHost } = useEventSession()
  const isBreakoutActive = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.breakout.isBreakoutActive
  )
  useEffect(() => {
    if (timeLeft === 0) {
      setTimeLeft(notificationDuration)

      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    // eslint-disable-next-line consistent-return
    return () => clearInterval(timer)
  }, [timeLeft, dispatch])

  return (
    <Modal hideCloseButton size="lg" isDismissable={false} isOpen>
      <ModalContent className="rounded-3xl">
        {() => (
          <ModalBody className="m-0 p-2 pb-10 rounded-2xl">
            <Image
              src="/images/breakout/collaboration-and-rooms.svg"
              width={800}
            />
            <div className="text-center flex flex-col gap-6 mt-1">
              <p className="text-xs text-gray-700">
                <RenderIf isTrue={!isBreakoutActive}>
                  {isHost
                    ? 'Participants will be redirected to breakout rooms. You’ll remain in the main session.'
                    : 'Get ready! You’ll be joining your breakout room in:'}
                </RenderIf>
                <RenderIf isTrue={isBreakoutActive}>
                  {isHost
                    ? 'Ending breakout session in'
                    : 'Your breakout session is about to end! You’ll be joining your main room in:'}
                </RenderIf>
              </p>
              <p
                className={cn('text-[36px] font-semibold', {
                  'text-red-500': isBreakoutActive,
                })}>
                00:0{timeLeft}
              </p>
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  )
}
