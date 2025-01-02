/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-unescaped-entities */

import { useState } from 'react'

import { Input } from '@nextui-org/react'
import toast from 'react-hot-toast'
import { FaVimeo } from 'react-icons/fa'

import { FrameFormContainer } from '@/components/event-content/FrameFormContainer'
import { Button } from '@/components/ui/Button'
import { useEventContext } from '@/contexts/EventContext'
import { useStoreDispatch } from '@/hooks/useRedux'
import { setFrameSettingsViewAction } from '@/stores/slices/layout/studio.slice'
import { IFrame } from '@/types/frame.type'
import { isValidVimeoVideoUrl } from '@/utils/url'

type VimeoVideoEditProps = {
  frame: IFrame & {
    content: {
      videoUrl: string
      provider: 'local' | 'youtube' | 'vimeo'
    }
  }
  onProviderChange: () => void
}

export function VimeoVideoEdit({
  frame,
  onProviderChange,
}: VimeoVideoEditProps) {
  const [videoUrl, setVideoUrl] = useState<string>(frame.content.videoUrl)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const { updateFrame } = useEventContext()
  const dispatch = useStoreDispatch()

  const updateVideoUrl = () => {
    const validUrl = isValidVimeoVideoUrl(videoUrl)

    if (!validUrl) {
      toast.error('Please enter a valid Vimeo video URL')

      return
    }

    if (frame.content.videoUrl === videoUrl) return

    setIsUpdating(true)

    updateFrame({
      framePayload: {
        content: {
          ...frame.content,
          videoUrl,
          provider: 'vimeo',
        },
      },
      frameId: frame.id,
    })

    setIsUpdating(false)

    dispatch(setFrameSettingsViewAction('preview'))
  }

  return (
    <FrameFormContainer
      headerIcon={<FaVimeo size={72} className="text-primary" />}
      headerTitle="Embed Vimeo Video"
      headerDescription="Easily embed Vimeo video into Moraa Frame for smooth playing."
      footerNote={
        <div className="flex flex-col gap-2">
          <span>Make sure the Vimeo video is publically accessible.</span>
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
        errorMessage="Please enter a valid Vimeo video URL"
        isInvalid={!isValidVimeoVideoUrl(videoUrl)}
        value={videoUrl}
        color="primary"
        label="Vimeo Video URL"
        placeholder="Enter Vimeo video url"
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
