/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-param-reassign */

import { RefObject } from 'react'

import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
  ImperativePanelGroupHandle,
} from 'react-resizable-panels'

import { ImageBlock } from '../../ImageBlock'

import { TextBlockEditor } from '@/components/event-content/TextBlockEditor'
import { FileBlock, ISlide, TextBlock } from '@/types/slide.type'

export function ImageLeft({
  slide,
  panelGroupRef,
  handlePanelLayoutChange,
  imageRef,
  fileUploaderOpen,
  setFileUploaderOpen,
  handleFileUpload,
  onBlockChange,
}: {
  imageRef: RefObject<HTMLImageElement>

  slide: ISlide
  fileUploaderOpen: boolean

  panelGroupRef: React.RefObject<ImperativePanelGroupHandle>
  handlePanelLayoutChange: (sizes: number[]) => void
  onBlockChange: (block: TextBlock) => void

  handleFileUpload: (
    files: {
      signedUrl: string
      meta: { name: string; size: number; type: string }
    }[]
  ) => void
  setFileUploaderOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const blocks = slide.content?.blocks || []

  const textBlock = blocks.find(
    (block) => block.type === 'paragraph'
  ) as TextBlock

  const imageBlocks = blocks.find(
    (block) => block.type === 'image'
  ) as FileBlock

  return (
    <div className="w-full h-full flex justify-center items-center group pt-16 relative">
      <PanelGroup
        direction="horizontal"
        className="w-full"
        ref={panelGroupRef}
        onLayout={handlePanelLayoutChange}>
        <Panel minSize={30} maxSize={60}>
          <div className="flex justify-center items-center overflow-hidden rounded-md h-full">
            <ImageBlock
              slideId={slide.id}
              imageRef={imageRef}
              imageBlocks={imageBlocks}
              fileUploaderOpen={fileUploaderOpen}
              setFileUploaderOpen={setFileUploaderOpen}
              onFileUpload={handleFileUpload}
            />
          </div>
        </Panel>
        <PanelResizeHandle className="opacity-50 bg-gray-800 w-2 h-12 rounded-full relative z-10 -right-1 top-1/2 -translate-y-1/2 cursor-col-resize group-hover:opacity-100 transition-opacity duration-500" />

        <Panel minSize={30}>
          <div className="flex justify-center items-center h-full w-full">
            <TextBlockEditor
              stickyToolbar
              block={textBlock}
              onChange={onBlockChange}
            />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}
