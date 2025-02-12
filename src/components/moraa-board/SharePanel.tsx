/* eslint-disable consistent-return */
import { useCallback, useMemo, useState } from 'react'

import {
  useBroadcastEvent,
  useEventListener,
  useOthers,
  useSelf,
} from '@liveblocks/react'
import { FullscreenIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { type Editor as TldrawEditor } from 'tldraw'

import { ToolButton } from './ToolButton'
import { UserPresences } from '../common/UserPresences'

import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import {
  MoraaBoardFrameState,
  setCurrentFrameStateAction,
} from '@/stores/slices/layout/studio.slice'

export function SharePanel({
  onStartFollowing,
  onStopFollowing,
  frameId,
}: {
  onStartFollowing?: TldrawEditor['startFollowingUser']
  onStopFollowing?: TldrawEditor['stopFollowingUser']
  frameId: string
}) {
  const currentFrameStates = useStoreSelector(
    (state) => state.layout.studio.currentFrameStates
  ) as MoraaBoardFrameState
  const dispatch = useStoreDispatch()
  const [followingUserId, setFollowingUserId] = useState<string | undefined>()
  const self = useSelf()
  const otherPresences = useOthers()
  const broadcast = useBroadcastEvent()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useEventListener(({ event }: any) => {
    if (!event) return
    if (
      event.type === 'BRING_ALL_TO_HOST' &&
      event.message.userId !== self?.id
    ) {
      // NOTE: This approach is not working as expected
      // editorInstance.zoomToUser(event.message.userId as string, {
      //   animation: {
      //     duration: 500,
      //   },
      // })

      // NOTE: Follow the host and unfollow instantly to bring all participants to host
      onStartFollowing?.(event.message.userId as string)
      setTimeout(() => {
        onStopFollowing?.()
      }, 500)
    }
  })

  const hostPresence = [self, ...otherPresences].find(
    (other) => other?.presence.isHost
  )
  const isFollowingHost = followingUserId === hostPresence?.id

  const handleBringAllToHost = useCallback(() => {
    if (!hostPresence) return
    if (!self?.presence.isHost) return
    broadcast({
      type: 'BRING_ALL_TO_HOST',
      message: { userId: hostPresence.id, frameId },
    })
    toast.success('All participants are brought to you')
  }, [hostPresence, self?.presence.isHost, broadcast, frameId])

  const memoizedUserPresences = useMemo(() => {
    if (!self?.id) return null
    if (!self?.info.name) return null
    if (!self?.info.avatar) return null

    return (
      <UserPresences
        self={{
          id: self.id,
          isHost: self.presence.isHost,
          name: self.info.name as string,
          role: self.presence.isHost ? 'Host' : 'Participant',
          avatar: self.info.avatar as string,
        }}
        others={otherPresences.map((other) => ({
          id: other.id,
          isHost: other.presence.isHost,
          name: other.info.name as string,
          role: other.presence.isHost ? 'Host' : 'Participant',
          avatar: other.info.avatar as string,
        }))}
        followingUserId={followingUserId}
        hostPresence={
          hostPresence
            ? {
                id: hostPresence.id,
                isHost: hostPresence.presence.isHost,
                name: hostPresence.info.name as string,
                role: hostPresence.presence.isHost ? 'Host' : 'Participant',
                avatar: hostPresence.info.avatar as string,
              }
            : undefined
        }
        isFollowingHost={isFollowingHost}
        onBringAllToHost={handleBringAllToHost}
        toggleFollowUser={(userId) => {
          if (followingUserId === userId) {
            onStopFollowing?.()
            setFollowingUserId(undefined)

            return
          }

          onStartFollowing?.(userId)
          setFollowingUserId(userId)
        }}
      />
    )
  }, [
    self?.id,
    self?.info.name,
    self?.info.avatar,
    self?.presence.isHost,
    otherPresences,
    followingUserId,
    hostPresence,
    isFollowingHost,
    handleBringAllToHost,
    onStartFollowing,
    onStopFollowing,
  ])

  if (!self) return null

  return (
    <div
      className="flex gap-1 bg-white p-1 border border-gray-200 rounded-md m-1"
      style={{ cursor: 'pointer', zIndex: 100000, pointerEvents: 'all' }}>
      <ToolButton
        icon={<FullscreenIcon size={20} />}
        label="Fullscreen"
        isActive={currentFrameStates?.isFullscreen}
        onClick={() => {
          dispatch(
            setCurrentFrameStateAction({
              ...currentFrameStates,
              isFullscreen: !currentFrameStates?.isFullscreen,
            })
          )
        }}
      />
      {memoizedUserPresences}
    </div>
  )
}
