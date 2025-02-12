import { useEventContext } from '@/contexts/EventContext'

export function VideoEmbedSettings() {
  const { currentFrame } = useEventContext()

  if (!currentFrame) return null

  return null
}
