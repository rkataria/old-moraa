/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import React, { useContext, useEffect, useRef, useState } from 'react'

import { useDebounce } from '@uidotdev/usehooks'
import { ImperativePanelGroupHandle } from 'react-resizable-panels'

import { ImageBehind } from '@/components/common/slide-templates/text-image/ImageBehind'
import { ImageLeft } from '@/components/common/slide-templates/text-image/ImageLeft'
import { ImageRight } from '@/components/common/slide-templates/text-image/ImageRight'
import { NoImage } from '@/components/common/slide-templates/text-image/NoImage'
import { LayoutTypes } from '@/components/common/TextImageSlideSettings'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { FileBlock, ISlide, TextBlock } from '@/types/slide.type'

export function TextImageEditor() {
  const [localSlide, setLocalSlide] = useState<ISlide | null>(null)
  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [fileUploaderOpen, setFileUploaderOpen] = useState<boolean>(false)
  const debouncedLocalSlide = useDebounce(localSlide, 500)

  const { currentSlide, updateSlide } = useContext(
    EventContext
  ) as EventContextType

  useEffect(() => {
    setLocalSlide(currentSlide)
  }, [currentSlide])

  useEffect(() => {
    if (!currentSlide?.content) {
      return
    }

    if (!debouncedLocalSlide?.content) {
      return
    }

    if (
      JSON.stringify(debouncedLocalSlide?.content) ===
      JSON.stringify(currentSlide.content)
    ) {
      return
    }

    updateSlide({
      slidePayload: {
        content: {
          ...currentSlide.content,
          ...debouncedLocalSlide?.content,
        },
      },
      slideId: currentSlide.id,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedLocalSlide?.content])

  useEffect(() => {
    if (panelGroupRef.current && localSlide?.content?.panelSizes) {
      panelGroupRef.current.setLayout(localSlide.content.panelSizes)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSlide])

  if (!localSlide) {
    return null
  }

  const handleFileUpload = (
    files: {
      signedUrl: string
      meta: { name: string; size: number; type: string }
    }[]
  ) => {
    setLocalSlide({
      ...localSlide,
      content: {
        ...localSlide.content,
        blocks: (localSlide.content?.blocks as FileBlock[])?.map((b) => {
          if (b.id === imageBlocks?.id) {
            return {
              ...b,
              data: {
                ...b.data,
                file: {
                  url: files[0].signedUrl,
                  meta: files[0].meta,
                },
              },
            }
          }

          return b
        }),
      },
    })
  }

  const handleBlockChange = (block: TextBlock) => {
    setLocalSlide({
      ...localSlide,
      content: {
        ...localSlide.content,
        blocks: (localSlide.content?.blocks as TextBlock[]).map((b) => {
          if (b.id === block.id) {
            return block
          }

          return b
        }),
      },
    })
  }

  const handlePanelLayoutChange = (sizes: number[]) => {
    setLocalSlide({
      ...localSlide,
      content: {
        ...localSlide.content,
        panelSizes: sizes,
      },
    })
  }

  const blocks = localSlide.content?.blocks || []

  const imageBlocks = blocks.find(
    (block) => block.type === 'image'
  ) as FileBlock

  if (currentSlide?.config?.layoutType === LayoutTypes.NO_IMAGE) {
    return <NoImage slide={localSlide} onBlockChange={handleBlockChange} />
  }

  if (currentSlide?.config?.layoutType === LayoutTypes.IMAGE_BEHIND) {
    return (
      <ImageBehind
        slide={localSlide}
        fileUploaderOpen={fileUploaderOpen}
        onBlockChange={handleBlockChange}
        handleFileUpload={handleFileUpload}
        setFileUploaderOpen={setFileUploaderOpen}
      />
    )
  }

  if (currentSlide?.config?.layoutType === LayoutTypes.IMAGE_LEFT) {
    return (
      <ImageLeft
        slide={localSlide}
        imageRef={imageRef}
        panelGroupRef={panelGroupRef}
        fileUploaderOpen={fileUploaderOpen}
        onBlockChange={handleBlockChange}
        handleFileUpload={handleFileUpload}
        setFileUploaderOpen={setFileUploaderOpen}
        handlePanelLayoutChange={handlePanelLayoutChange}
      />
    )
  }

  return (
    <ImageRight
      slide={localSlide}
      imageRef={imageRef}
      panelGroupRef={panelGroupRef}
      fileUploaderOpen={fileUploaderOpen}
      onBlockChange={handleBlockChange}
      handleFileUpload={handleFileUpload}
      setFileUploaderOpen={setFileUploaderOpen}
      handlePanelLayoutChange={handlePanelLayoutChange}
    />
  )
}
