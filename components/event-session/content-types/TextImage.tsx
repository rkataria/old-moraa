import { useEffect, useRef } from 'react'

import {
  ImperativePanelGroupHandle,
  Panel,
  PanelGroup,
} from 'react-resizable-panels'

import { ImageBlockView } from '@/components/common/ImageBlockView'
import { TextBlockView } from '@/components/common/TextBlockView'
import { LayoutTypes } from '@/components/common/TextImageSlideSettings'
import { Block, ISlide, TextBlock } from '@/types/slide.type'

type TextImageProps = {
  slide: ISlide
}

export type ImageBlock = {
  type: 'image'
  data: {
    file: {
      url: string
    }
  }
}

export function TextImage({ slide }: TextImageProps) {
  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null)
  const blocks = slide.content?.blocks || []

  useEffect(() => {
    panelGroupRef.current?.setLayout(slide.content?.panelSizes || [60, 40])
  }, [slide.content?.panelSizes])

  const layoutType = slide.config.layoutType || LayoutTypes.IMAGE_RIGHT

  const textBlocks = blocks.filter((block) =>
    ['header', 'paragraph'].includes(block.type)
  ) as TextBlock[]

  const imageBlock = blocks.find(
    (block: Block) => block.type === 'image'
  ) as ImageBlock

  if (layoutType === LayoutTypes.NO_IMAGE) {
    return (
      <div
        className="tiptap ProseMirror relative w-full h-full flex flex-col justify-center items-start group bg-center bg-cover"
        style={{ backgroundColor: slide.config.backgroundColor }}>
        <TextBlockView textBlocks={textBlocks} />
      </div>
    )
  }

  if (layoutType === LayoutTypes.IMAGE_BEHIND) {
    return (
      <div
        className="tiptap ProseMirror relative w-full h-full flex flex-col justify-center items-start group bg-center bg-cover"
        style={{ backgroundImage: `url(${imageBlock.data.file.url})` }}>
        <TextBlockView textBlocks={textBlocks} />
      </div>
    )
  }

  if (layoutType === LayoutTypes.IMAGE_LEFT) {
    return (
      <div
        style={{ backgroundColor: slide.config.backgroundColor }}
        className="tiptap ProseMirror w-full h-full flex flex-col justify-center items-start">
        <PanelGroup ref={panelGroupRef} direction="horizontal">
          <Panel defaultSize={30} minSize={30} maxSize={60}>
            <ImageBlockView imageBlock={imageBlock} />
          </Panel>
          <Panel minSize={30}>
            <TextBlockView textBlocks={textBlocks} />
          </Panel>
        </PanelGroup>
      </div>
    )
  }

  return (
    <div
      style={{ backgroundColor: slide.config.backgroundColor }}
      className="tiptap ProseMirror w-full h-full flex flex-col justify-center items-start">
      <PanelGroup ref={panelGroupRef} direction="horizontal">
        <Panel minSize={30}>
          <TextBlockView textBlocks={textBlocks} />
        </Panel>
        <Panel defaultSize={30} minSize={30} maxSize={60}>
          <ImageBlockView imageBlock={imageBlock} />
        </Panel>
      </PanelGroup>
    </div>
  )
}
