import { useEffect, useRef } from 'react'

import {
  ImperativePanelGroupHandle,
  Panel,
  PanelGroup,
} from 'react-resizable-panels'

import { RichTextView } from '@/components/common/content-types/RichTextView'
import { ImageBlockView } from '@/components/common/ImageBlockView'
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
    panelGroupRef.current?.setLayout(slide.content?.panelSizes || [50, 50])
  }, [slide.content?.panelSizes])

  const layoutType = slide.config.layoutType || LayoutTypes.IMAGE_RIGHT

  const textBlock = blocks.find(
    (block) => block.type === 'paragraph'
  ) as TextBlock

  const headerBlock = blocks.find(
    (block) => block.type === 'header'
  ) as TextBlock

  const imageBlock = blocks.find(
    (block: Block) => block.type === 'image'
  ) as ImageBlock

  if (layoutType === LayoutTypes.NO_IMAGE) {
    return (
      <div
        className="tiptap ProseMirror w-full h-full flex justify-center items-center !p-0"
        style={{ backgroundColor: slide.config.backgroundColor }}>
        <div className="flex flex-col w-full h-full">
          {slide.config.showTitle && <RichTextView block={headerBlock} />}
          {slide.config.showDescription && <RichTextView block={textBlock} />}
        </div>
      </div>
    )
  }

  if (layoutType === LayoutTypes.IMAGE_BEHIND) {
    return (
      <div className="tiptap ProseMirror w-full h-full flex flex-col justify-center items-center !p-0">
        {slide.config.showTitle && <RichTextView block={headerBlock} />}
        <div
          className="bg-center bg-cover h-full w-full"
          style={{ backgroundImage: `url(${imageBlock.data.file.url})` }}>
          {slide.config.showDescription && <RichTextView block={textBlock} />}
        </div>
      </div>
    )
  }

  if (layoutType === LayoutTypes.IMAGE_LEFT) {
    return (
      <div
        style={{ backgroundColor: slide.config.backgroundColor }}
        className="tiptap ProseMirror w-full h-full flex flex-col justify-center items-center relative !p-0">
        {slide.config.showTitle && <RichTextView block={headerBlock} />}

        <PanelGroup ref={panelGroupRef} direction="horizontal">
          <Panel defaultSize={30} minSize={30} maxSize={60}>
            <ImageBlockView imageBlock={imageBlock} />
          </Panel>
          <Panel minSize={30}>
            {slide.config.showDescription && <RichTextView block={textBlock} />}
          </Panel>
        </PanelGroup>
      </div>
    )
  }

  return (
    <div
      style={{ backgroundColor: slide.config.backgroundColor }}
      className="tiptap ProseMirror w-full h-full flex flex-col justify-center items-center relative !p-0">
      {slide.config.showTitle && <RichTextView block={headerBlock} />}

      <PanelGroup ref={panelGroupRef} direction="horizontal">
        <Panel minSize={30}>
          {slide.config.showDescription && <RichTextView block={textBlock} />}
        </Panel>
        <Panel defaultSize={30} minSize={30} maxSize={60}>
          <ImageBlockView imageBlock={imageBlock} />
        </Panel>
      </PanelGroup>
    </div>
  )
}
