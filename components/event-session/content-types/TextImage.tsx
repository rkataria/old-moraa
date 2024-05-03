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

  const imageBlock = blocks.find(
    (block: Block) => block.type === 'image'
  ) as ImageBlock

  if (layoutType === LayoutTypes.NO_IMAGE) {
    return (
      <div
        className="tiptap ProseMirror w-full h-full flex justify-center items-center !p-0"
        style={{ backgroundColor: slide.config.backgroundColor }}>
        <RichTextView block={textBlock} />
      </div>
    )
  }

  if (layoutType === LayoutTypes.IMAGE_BEHIND) {
    return (
      <div
        className="tiptap ProseMirror w-full h-full flex justify-center items-center bg-center bg-cover !p-0"
        style={{ backgroundImage: `url(${imageBlock.data.file.url})` }}>
        <RichTextView block={textBlock} />
      </div>
    )
  }

  if (layoutType === LayoutTypes.IMAGE_LEFT) {
    return (
      <div
        style={{ backgroundColor: slide.config.backgroundColor }}
        className="tiptap ProseMirror w-full h-full flex justify-center items-center relative !p-0">
        <PanelGroup ref={panelGroupRef} direction="horizontal">
          <Panel defaultSize={30} minSize={30} maxSize={60}>
            <ImageBlockView imageBlock={imageBlock} />
          </Panel>
          <Panel minSize={30}>
            <div className="flex justify-center items-center h-full w-full">
              <RichTextView block={textBlock} />
            </div>
          </Panel>
        </PanelGroup>
      </div>
    )
  }

  return (
    <div
      style={{ backgroundColor: slide.config.backgroundColor }}
      className="tiptap ProseMirror w-full h-full flex justify-center items-center relative !p-0">
      <PanelGroup ref={panelGroupRef} direction="horizontal">
        <Panel minSize={30}>
          <div className="flex justify-center items-center h-full w-full">
            <RichTextView block={textBlock} />
          </div>
        </Panel>
        <Panel defaultSize={30} minSize={30} maxSize={60}>
          <ImageBlockView imageBlock={imageBlock} />
        </Panel>
      </PanelGroup>
    </div>
  )
}
