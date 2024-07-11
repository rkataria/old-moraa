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
import { FileBlock, IFrame, TextBlock } from '@/types/frame.type'

export function ImageLeft({
  frame,
  panelGroupRef,
  handlePanelLayoutChange,
  imageRef,
  fileUploaderOpen,
  editingBlock,
  setFileUploaderOpen,
  handleFileUpload,
  setEditingBlock,
  onBlockChange,
}: {
  imageRef: RefObject<HTMLImageElement>

  frame: IFrame
  fileUploaderOpen: boolean
  editingBlock: string | null
  panelGroupRef: React.RefObject<ImperativePanelGroupHandle>

  handlePanelLayoutChange: (sizes: number[]) => void
  setEditingBlock: (id: string) => void
  onBlockChange: (block: TextBlock) => void

  handleFileUpload: (
    files: {
      signedUrl: string
      meta: { name: string; size: number; type: string }
    }[]
  ) => void
  setFileUploaderOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const blocks = frame.content?.blocks || []

  const textBlock = blocks.find(
    (block) => block.type === 'paragraph'
  ) as TextBlock

  const headerBlock = blocks.find(
    (block) => block.type === 'header'
  ) as TextBlock

  const imageBlocks = blocks.find(
    (block) => block.type === 'image'
  ) as FileBlock

  return (
    <div className="w-full h-full flex flex-col justify-center items-start group relative">
      <div
        onClick={() => setEditingBlock(headerBlock.id)}
        className="w-full relative z-[1]">
        <TextBlockEditor
          block={headerBlock}
          editable={editingBlock === headerBlock.id}
          onChange={onBlockChange}
        />
      </div>
      <PanelGroup
        direction="horizontal"
        className="w-full"
        ref={panelGroupRef}
        onLayout={handlePanelLayoutChange}>
        <Panel minSize={30} maxSize={60}>
          <div className="flex justify-center items-center overflow-hidden rounded-md h-full">
            <ImageBlock
              frameId={frame.id}
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
          <div className="flex flex-col h-full">
            <div onClick={() => setEditingBlock(textBlock.id)}>
              <TextBlockEditor
                block={textBlock}
                editable={editingBlock === textBlock.id}
                onChange={onBlockChange}
              />
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}
