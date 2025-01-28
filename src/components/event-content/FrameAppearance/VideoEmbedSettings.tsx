import { useEventContext } from '@/contexts/EventContext'

export function VideoEmbedSettings() {
  const { currentFrame } = useEventContext()

  if (!currentFrame) return null

  return (
    <div className="text-center mt-20 text-gray-400">
      No settings available for Video embed
    </div>
  )
}
