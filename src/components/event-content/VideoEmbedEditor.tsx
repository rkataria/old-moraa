import { useContext, useState } from 'react'

import { Button, Input } from '@nextui-org/react'
import { FaYoutube } from 'react-icons/fa'

import { FrameFormContainer } from './FrameFormContainer'

import { ResponsiveVideoPlayer } from '@/components/common/ResponsiveVideoPlayer'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'
import { cn } from '@/utils/utils'

export type VideoEmbedFrameType = IFrame & {
  content: {
    videoUrl: string
  }
}
interface VideoEmbedEditorProps {
  frame: VideoEmbedFrameType
  showControls?: boolean
  fullWidth?: boolean
}

export function VideoEmbedEditor({
  frame,
  showControls = true,
  fullWidth,
}: VideoEmbedEditorProps) {
  const [videoUrl, setVideoUrl] = useState(frame.content.videoUrl || '')
  const [isEditMode, setIsEditMode] = useState(!frame.content.videoUrl)
  const { preview, updateFrame } = useContext(EventContext) as EventContextType
  const disabled = preview || !showControls

  const saveVideoUrl = () => {
    if (disabled) return
    updateFrame({
      framePayload: {
        content: {
          ...frame.content,
          videoUrl,
        },
      },
      frameId: frame.id,
    })
    setIsEditMode(false)
  }

  if (disabled || !isEditMode) {
    return (
      <div className="w-full h-full flex justify-start items-start">
        <div
          className={cn(
            'w-auto h-full aspect-video overflow-hidden rounded-md',
            {
              'max-w-[90%]': !fullWidth,
              'w-full': fullWidth,
            }
          )}>
          <ResponsiveVideoPlayer url={videoUrl} showControls={showControls} />
        </div>
      </div>
    )
  }

  return (
    <FrameFormContainer
      headerIcon={<FaYoutube size={72} className="text-primary" />}
      headerTitle="Embed Youtube Video"
      headerDescription="Easily embed Youtube video into Moraa Frame for smooth playing."
      footerNote="Make sure the Youtube video is publically accessible or shared with participants.">
      <Input
        variant="bordered"
        color="primary"
        label="Youtube Video URL"
        className="focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
        placeholder="Enter youtube video url"
        onChange={(e) => setVideoUrl(e.target.value)}
        value={videoUrl}
      />
      <Button color="primary" variant="ghost" fullWidth onClick={saveVideoUrl}>
        Embed Youtube Video
      </Button>
    </FrameFormContainer>
  )
}
