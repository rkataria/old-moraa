import { useRef, useState } from 'react'

import { Input } from '@nextui-org/react'
import { FaYoutube } from 'react-icons/fa6'

import { Embed } from './Embed'

import { FrameFormContainer } from '@/components/event-content/FrameFormContainer'
import { Button } from '@/components/ui/Button'
import { useEventContext } from '@/contexts/EventContext'
import { IFrame } from '@/types/frame.type'

type EditProps = {
  frame: IFrame
  showControls?: boolean
}

export function Edit({ frame, showControls }: EditProps) {
  const [loading, setLoading] = useState(false)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const { updateFrame } = useEventContext()

  const videoUrl = frame.content?.videoUrl

  if (videoUrl) {
    return <Embed url={videoUrl as string} showControls={showControls} />
  }

  const updateVideoUrl = () => {
    const url = videoInputRef.current?.value
    if (!url) return

    setLoading(true)

    updateFrame({
      framePayload: {
        content: {
          ...frame.content,
          videoUrl: url,
        },
      },
      frameId: frame.id,
    })

    setLoading(false)
  }

  return (
    <FrameFormContainer
      headerIcon={<FaYoutube size={72} className="text-primary" />}
      headerTitle="Embed Youtube Video"
      headerDescription="Easily embed Youtube video into Moraa Frame for smooth playing."
      footerNote="Make sure the Youtube video is publically accessible or shared with participants.">
      <Input
        ref={videoInputRef}
        variant="bordered"
        color="primary"
        label="Youtube Video URL"
        className="focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
        placeholder="Enter youtube video url"
        disabled={loading}
      />
      <Button
        color="primary"
        variant="ghost"
        fullWidth
        disabled={loading}
        onClick={updateVideoUrl}>
        {loading ? 'Embeding...' : 'Embed Video'}
      </Button>
    </FrameFormContainer>
  )
}
