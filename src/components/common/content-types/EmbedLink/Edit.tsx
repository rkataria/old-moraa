/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable react/no-danger */
import { useState } from 'react'

import { Input } from '@nextui-org/react'
import toast from 'react-hot-toast'
import { PiCodeSimpleBold } from 'react-icons/pi'

import { Embed } from './Embed'

import { FrameFormContainer } from '@/components/event-content/FrameFormContainer'
import { Button } from '@/components/ui/Button'
import { useEventContext } from '@/contexts/EventContext'
import { IFramelyService } from '@/services/iframely.service'
import { EmbedLinkFrame } from '@/types/frame-picker.type'

type EditProps = {
  frame: EmbedLinkFrame
}

export function Edit({ frame }: EditProps) {
  const [url, setUrl] = useState('')
  const [embedHtml, setEmbedHtml] = useState('')
  const { updateFrame } = useEventContext()

  const handleEmbed = async () => {
    const data = await IFramelyService.fetchEmbed({ url })

    // Throw an alert if an error occurs
    if (data.isError) {
      toast.error(data.message)

      return
    }

    // Throw an alert if no embeddable content is found
    if (!data.html && !data.meta?.canonical) {
      toast.error('No embeddable content found.')

      return
    }

    // Update the frame content with the embeddable content, url and other details
    setEmbedHtml(data.html)
    updateFrame({
      framePayload: {
        content: {
          ...frame.content,
          html: data.html,
          url,
          raw: data,
        },
      },
      frameId: frame.id,
    })
    toast.success('Embed link added successfully.')
  }

  if (embedHtml || frame.content?.html || frame.content?.raw?.meta?.canonical) {
    return (
      <Embed
        html={embedHtml || frame.content?.html}
        canonical={frame.content?.raw?.meta?.canonical}
      />
    )
  }

  return (
    <FrameFormContainer
      headerIcon={<PiCodeSimpleBold size={72} className="text-primary" />}
      headerTitle="Embed Link"
      headerDescription="Embed any link that supports oEmbed."
      footerNote="Embedding is supported for links that support oEmbed.">
      <Input
        variant="faded"
        color="primary"
        label="Enter URL"
        placeholder="https://example.com"
        key={frame.content?.url}
        defaultValue={frame.content?.url}
        classNames={{
          inputWrapper: 'shadow-none',
        }}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button
        color="primary"
        variant="flat"
        size="md"
        fullWidth
        onClick={handleEmbed}
        disabled={!url}>
        {frame.content?.url ? 'Update' : 'Embed'} Link
      </Button>
    </FrameFormContainer>
  )
}
