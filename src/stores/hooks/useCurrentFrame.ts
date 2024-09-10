import { useStoreSelector } from '../../hooks/useRedux'

export const useCurrentFrame = () => {
  const currentFrame = useStoreSelector(
    (store) =>
      store.event.currentEvent.frameState.frame.data?.find(
        (frame) =>
          frame.id === store.event.currentEvent.eventState.currentFrameId
      ) || null
  )

  return currentFrame
}
