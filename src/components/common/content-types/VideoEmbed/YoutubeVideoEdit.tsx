/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-unescaped-entities */

import { useState } from 'react'

import { Input } from '@nextui-org/react'
import toast from 'react-hot-toast'
import { FaYoutube } from 'react-icons/fa'

import { FrameFormContainer } from '@/components/event-content/FrameFormContainer'
import { Button } from '@/components/ui/Button'
import { useEventContext } from '@/contexts/EventContext'
import { useStoreDispatch } from '@/hooks/useRedux'
import { setFrameSettingsViewAction } from '@/stores/slices/layout/studio.slice'
import { IFrame } from '@/types/frame.type'
import { isValidYouTubeVideoUrl } from '@/utils/url'

type LocalVideoEditProps = {
  frame: IFrame & {
    content: {
      videoUrl: string
      provider: 'local' | 'youtube' | 'vimeo'
    }
  }
  onProviderChange: () => void
}

export function YoutubeVideoEdit({
  frame,
  onProviderChange,
}: LocalVideoEditProps) {
  const [videoUrl, setVideoUrl] = useState<string>(frame.content.videoUrl)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const { updateFrame } = useEventContext()
  const dispatch = useStoreDispatch()

  const updateVideoUrl = () => {
    const validUrl = isValidYouTubeVideoUrl(videoUrl)

    if (!validUrl) {
      toast.error('Please enter a valid Youtube video URL')

      return
    }

    if (frame.content.videoUrl === videoUrl) return

    setIsUpdating(true)

    updateFrame({
      framePayload: {
        content: {
          ...frame.content,
          videoUrl,
          provider: 'youtube',
        },
      },
      frameId: frame.id,
    })

    setIsUpdating(false)

    dispatch(setFrameSettingsViewAction('preview'))
  }

  return (
    <FrameFormContainer
      headerIcon={<FaYoutube size={72} className="text-primary" />}
      headerTitle="Embed Youtube Video"
      headerDescription="Easily embed Youtube video into Moraa Frame for smooth playing."
      footerNote={
        <div className="flex flex-col gap-2">
          <span>Make sure the Youtube video is publically accessible.</span>
          <span
            className="cursor-pointer text-blue-400 underline text-sm"
            onClick={onProviderChange}>
            Embed from Vimeo or Local?{' '}
          </span>
        </div>
      }>
      <Input
        variant="faded"
        classNames={{
          inputWrapper: 'shadow-none',
        }}
        errorMessage="Please enter a valid Youtube video URL"
        isInvalid={!isValidYouTubeVideoUrl(videoUrl)}
        value={videoUrl}
        color="primary"
        label="Youtube Video URL"
        placeholder="Enter youtube video url"
        disabled={isUpdating}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      <Button
        color="primary"
        variant="flat"
        size="md"
        fullWidth
        disabled={isUpdating}
        onClick={updateVideoUrl}>
        {isUpdating ? 'Embeding...' : 'Embed Video'}
      </Button>
    </FrameFormContainer>
  )
}
