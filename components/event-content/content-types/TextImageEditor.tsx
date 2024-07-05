/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import React, { useContext, useEffect, useRef, useState } from 'react'

import { useDebounce } from '@uidotdev/usehooks'
import { ImperativePanelGroupHandle } from 'react-resizable-panels'

import { LayoutTypes } from '../FrameAppearance/TextImageAppearance'

import { ImageBehind } from '@/components/common/frame-templates/text-image/ImageBehind'
import { ImageLeft } from '@/components/common/frame-templates/text-image/ImageLeft'
import { ImageRight } from '@/components/common/frame-templates/text-image/ImageRight'
import { NoImage } from '@/components/common/frame-templates/text-image/NoImage'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { FileBlock, IFrame, TextBlock } from '@/types/frame.type'
import { getFrameName } from '@/utils/getFrameName'

export function TextImageEditor() {
  const [localFrame, setLocalFrame] = useState<IFrame | null>(null)
  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null)
  const [editingBlock, setEditingBlock] = useState<string | null>(null)

  const imageRef = useRef<HTMLImageElement>(null)
  const [fileUploaderOpen, setFileUploaderOpen] = useState<boolean>(false)
  const debouncedLocalFrame = useDebounce(localFrame, 500)

  const { currentFrame, updateFrame } = useContext(
    EventContext
  ) as EventContextType

  useEffect(() => {
    setLocalFrame(currentFrame)
  }, [currentFrame])

  useEffect(() => {
    if (!currentFrame?.content) {
      return
    }

    if (!debouncedLocalFrame?.content) {
      return
    }

    if (
      JSON.stringify(debouncedLocalFrame?.content) ===
      JSON.stringify(currentFrame.content)
    ) {
      return
    }

    updateFrame({
      framePayload: {
        content: {
          ...currentFrame.content,
          ...debouncedLocalFrame?.content,
        },
        name: getFrameName({ frame: debouncedLocalFrame }),
      },
      frameId: currentFrame.id,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedLocalFrame?.content])

  useEffect(() => {
    if (panelGroupRef.current && localFrame?.content?.panelSizes) {
      panelGroupRef.current.setLayout(localFrame.content.panelSizes)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localFrame])

  if (!localFrame) {
    return null
  }

  const handleFileUpload = (
    files: {
      signedUrl: string
      meta: { name: string; size: number; type: string }
    }[]
  ) => {
    setLocalFrame({
      ...localFrame,
      content: {
        ...localFrame.content,
        blocks: (localFrame.content?.blocks as FileBlock[])?.map((b) => {
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
    setLocalFrame({
      ...localFrame,
      content: {
        ...localFrame.content,
        blocks: (localFrame.content?.blocks as TextBlock[]).map((b) => {
          if (b.id === block.id) {
            return block
          }

          return b
        }),
      },
    })
  }

  const handlePanelLayoutChange = (sizes: number[]) => {
    setLocalFrame({
      ...localFrame,
      content: {
        ...localFrame.content,
        panelSizes: sizes,
      },
    })
  }

  const blocks = localFrame.content?.blocks || []

  const imageBlocks = blocks.find(
    (block) => block.type === 'image'
  ) as FileBlock

  if (currentFrame?.config?.layoutType === LayoutTypes.NO_IMAGE) {
    return (
      <NoImage
        frame={localFrame}
        editingBlock={editingBlock}
        onBlockChange={handleBlockChange}
        setEditingBlock={setEditingBlock}
      />
    )
  }

  if (currentFrame?.config?.layoutType === LayoutTypes.IMAGE_BEHIND) {
    return (
      <ImageBehind
        frame={localFrame}
        fileUploaderOpen={fileUploaderOpen}
        editingBlock={editingBlock}
        setEditingBlock={setEditingBlock}
        onBlockChange={handleBlockChange}
        handleFileUpload={handleFileUpload}
        setFileUploaderOpen={setFileUploaderOpen}
      />
    )
  }

  if (currentFrame?.config?.layoutType === LayoutTypes.IMAGE_LEFT) {
    return (
      <ImageLeft
        editingBlock={editingBlock}
        frame={localFrame}
        imageRef={imageRef}
        panelGroupRef={panelGroupRef}
        fileUploaderOpen={fileUploaderOpen}
        setEditingBlock={setEditingBlock}
        onBlockChange={handleBlockChange}
        handleFileUpload={handleFileUpload}
        setFileUploaderOpen={setFileUploaderOpen}
        handlePanelLayoutChange={handlePanelLayoutChange}
      />
    )
  }

  return (
    <ImageRight
      frame={localFrame}
      editingBlock={editingBlock}
      imageRef={imageRef}
      panelGroupRef={panelGroupRef}
      fileUploaderOpen={fileUploaderOpen}
      setEditingBlock={setEditingBlock}
      onBlockChange={handleBlockChange}
      handleFileUpload={handleFileUpload}
      setFileUploaderOpen={setFileUploaderOpen}
      handlePanelLayoutChange={handlePanelLayoutChange}
    />
  )
}
