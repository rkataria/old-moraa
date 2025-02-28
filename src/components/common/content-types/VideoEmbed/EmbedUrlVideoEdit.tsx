/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-unescaped-entities */

import { useState } from 'react'

import { Input } from '@heroui/react'
import { FaVideo } from 'react-icons/fa'

import { VideoProvider } from './utils/types'

import { FrameFormContainer } from '@/components/event-content/FrameFormContainer'
import { Button } from '@/components/ui/Button'
import { useEventContext } from '@/contexts/EventContext'
import { IFrame } from '@/types/frame.type'

type EmbedUrlVideoEditProps = {
  frame: IFrame & {
    content: {
      videoUrl: string
      provider: VideoProvider | null
    }
  }
  onUpdate: () => void
  onProviderChange: () => void
}

export function EmbedUrlVideoEdit({
  frame,
  onUpdate,
  onProviderChange,
}: EmbedUrlVideoEditProps) {
  const [videoUrl, setVideoUrl] = useState<string>(frame.content.videoUrl)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const { updateFrame } = useEventContext()

  const updateVideoUrl = () => {
    if (frame.content.videoUrl === videoUrl) {
      onUpdate()

      return
    }

    setIsUpdating(true)

    updateFrame({
      framePayload: {
        content: {
          ...frame.content,
          videoUrl,
          provider: VideoProvider.EMBED_URL,
        },
      },
      frameId: frame.id,
    })

    onUpdate()

    setIsUpdating(false)
  }

  return (
    <FrameFormContainer
      headerIcon={<FaVideo size={72} className="text-primary" />}
      headerTitle="Embed Video"
      headerDescription="Easily embed video into Moraa Frame for smooth playing."
      footerNote={
        <div className="flex flex-col gap-2">
          <span>Make sure the video is publically accessible.</span>
          <span
            className="cursor-pointer text-blue-400 underline text-sm"
            onClick={onProviderChange}>
            Embed from Youtube or Local?{' '}
          </span>
        </div>
      }>
      <Input
        variant="faded"
        classNames={{
          inputWrapper: 'shadow-none',
        }}
        value={videoUrl}
        color="primary"
        label="Video URL"
        placeholder="Enter video url"
        disabled={isUpdating}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      <Button
        color="primary"
        variant="flat"
        size="md"
        fullWidth
        isDisabled={isUpdating || !videoUrl}
        onClick={updateVideoUrl}>
        {isUpdating ? 'Embeding...' : 'Embed Video'}
      </Button>
    </FrameFormContainer>
  )
}
