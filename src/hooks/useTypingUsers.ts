import { useCallback, useEffect, useState } from 'react'

import uniqBy from 'lodash.uniqby'

import { useEventSession } from '@/contexts/EventSessionContext'

export const useTypingUsers = () => {
  const { realtimeChannel } = useEventSession()
  const [typingUsers, setTypingUsers] = useState<
    Array<{ participantId: string; participantName: string }>
  >([])

  useEffect(() => {
    if (!realtimeChannel) return

    const removeTypingUser = (participantId: string) => {
      setTypingUsers((existingTypingUsers) => {
        const updatedUserTypings = existingTypingUsers.filter(
          (user) => user.participantId !== participantId
        )

        return updatedUserTypings
      })
    }

    let lastTimeoutId: null | NodeJS.Timeout = null

    realtimeChannel.on(
      'broadcast',
      { event: 'user-started-typing' },
      ({ payload }) => {
        const { participantId, participantName } = payload
        setTypingUsers((existingTypingUsers) => {
          const updatedUserTypings = uniqBy(
            [...existingTypingUsers, { participantId, participantName }],
            (user) => user.participantId
          )

          return updatedUserTypings
        })
        if (lastTimeoutId) clearTimeout(lastTimeoutId)
        lastTimeoutId = setTimeout(() => {
          removeTypingUser(participantId)
        }, 4000)
      }
    )
    realtimeChannel.on(
      'broadcast',
      { event: 'user-stopped-typing' },
      ({ payload }) => {
        const { participantId } = payload
        removeTypingUser(participantId)
      }
    )
  }, [realtimeChannel])

  const updateTypingUsers = useCallback(
    async ({
      isTyping,
      participantId,
      participantName,
    }: {
      isTyping: boolean
      participantId: string
      participantName?: string
    }) => {
      if (!realtimeChannel) return

      if (isTyping) {
        realtimeChannel?.send({
          type: 'broadcast',
          event: 'user-started-typing',
          payload: {
            participantId,
            participantName,
          },
        })
      } else {
        realtimeChannel?.send({
          type: 'broadcast',
          event: 'user-stopped-typing',
          payload: {
            participantId,
            participantName,
          },
        })
      }
    },
    [realtimeChannel]
  )

  return { updateTypingUsers, typingUsers }
}
