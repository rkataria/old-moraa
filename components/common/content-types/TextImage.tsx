import { useEffect, useRef } from 'react'

import {
  ImperativePanelGroupHandle,
  Panel,
  PanelGroup,
} from 'react-resizable-panels'

import { Image } from '@nextui-org/react'

import { Block, ISlide, TextBlock } from '@/types/slide.type'
import { cn } from '@/utils/utils'

export type TextImageSlideType = ISlide & {
  content: {
    blocks: Block[]
    panelSizes?: number[]
  }
}

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

  const textBlocks = blocks.filter((block) =>
    ['header', 'paragraph'].includes(block.type)
  ) as TextBlock[]

  const imageBlock = blocks.find(
    (block: Block) => block.type === 'image'
  ) as ImageBlock

  return (
    <div
      style={{ backgroundColor: slide.config.backgroundColor }}
      className="tiptap ProseMirror w-full h-full flex flex-col justify-center items-start">
      <PanelGroup ref={panelGroupRef} direction="horizontal">
        <Panel minSize={30}>
          <div className="h-full flex flex-col justify-center items-start">
            {textBlocks.map((block) => (
              <div
                key={`block-editor-${block.id}`}
                className={cn('w-full', {
                  'block-content-header': block.type === 'header',
                  'block-content-paragraph': block.type === 'paragraph',
                })}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: block.data.html,
                }}
              />
            ))}
          </div>
        </Panel>
        <Panel defaultSize={30} minSize={30} maxSize={60}>
          <div className="flex justify-center items-center overflow-hidden rounded-md h-full">
            <div className="relative rounded-md overflow-hidden group">
              <Image
                src={imageBlock?.data.file.url}
                removeWrapper
                className={cn(
                  'relative z-0 flex-none rounded-md overflow-hidden'
                )}
              />
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}
