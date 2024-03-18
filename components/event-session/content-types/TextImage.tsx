import { useEffect, useRef } from 'react'

import {
  ImperativePanelGroupHandle,
  Panel,
  PanelGroup,
} from 'react-resizable-panels'

import { Image } from '@nextui-org/react'

import { Block, ISlide, TextBlock } from '@/types/slide.type'
import { cn } from '@/utils/utils'

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
      className="w-full h-full flex flex-col justify-center items-center">
      <PanelGroup ref={panelGroupRef} direction="horizontal">
        <Panel minSize={30}>
          <div className="h-full flex flex-col justify-center items-center">
            {textBlocks.map((block) => (
              <div key={`block-editor-${block.id}`}>
                <div
                  className={
                    block.type === 'header'
                      ? 'block-content-header'
                      : 'block-content-paragraph'
                  }
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{
                    __html: block.data.html,
                  }}
                />
              </div>
            ))}
          </div>
        </Panel>
        <Panel defaultSize={30} minSize={30} maxSize={60}>
          <div className="flex justify-center items-center overflow-hidden rounded-md h-full">
            <div className="relative bg-gray-900 rounded-md overflow-hidden group">
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
