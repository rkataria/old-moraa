import { useContext, useState } from 'react'

import { Button, Input } from '@nextui-org/react'
import { AiOutlineClose } from 'react-icons/ai'
import { CiEdit } from 'react-icons/ci'
import { FaYoutube } from 'react-icons/fa'

import { FrameFormContainer } from './FrameFormContainer'
import { RenderIf } from '../common/RenderIf/RenderIf'

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
      <div className="relative w-full h-full flex justify-start items-start">
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
        <RenderIf isTrue={!preview}>
          <CiEdit
            className="absolute right-[-8px] bottom-[81px] z-[10] w-10 h-10 rounded-full p-2 shadow-lg border bg-primary text-white cursor-pointer"
            onClick={() => setIsEditMode(true)}
          />
        </RenderIf>
      </div>
    )
  }
  const isUpdating = isEditMode && frame.content?.videoUrl?.length > 0

  return (
    <FrameFormContainer
      headerIcon={<FaYoutube size={72} className="text-primary" />}
      headerTitle={`${isUpdating ? 'Edit' : 'Embed'} Youtube Video`}
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
      <Button
        color="primary"
        variant="ghost"
        fullWidth
        onClick={saveVideoUrl}
        disabled={!videoUrl}>
        {isUpdating ? 'Save' : 'Embed'} Youtube Video
      </Button>
      <RenderIf isTrue={isUpdating}>
        <AiOutlineClose
          className="absolute right-[-8px] bottom-[81px] z-[10] w-10 h-10 rounded-full p-2 shadow-lg border bg-primary text-white cursor-pointer"
          onClick={() => {
            setVideoUrl(frame.content.videoUrl)
            setIsEditMode(false)
          }}
        />
      </RenderIf>
    </FrameFormContainer>
  )
}
