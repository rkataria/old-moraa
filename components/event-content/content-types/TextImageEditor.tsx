/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import React, { useContext, useEffect, useRef, useState } from 'react'

import { useDebounce } from '@uidotdev/usehooks'
import {
  ImperativePanelGroupHandle,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from 'react-resizable-panels'

import { Image } from '@nextui-org/react'

import { FileUploader } from '../FileUploader'

import { TextBlockEditor } from '@/components/event-content/BlockEditor'
import { SlideManagerContext } from '@/contexts/SlideManagerContext'
import {
  FileBlock,
  ISlide,
  SlideManagerContextType,
  TextBlock,
} from '@/types/slide.type'
import { cn } from '@/utils/utils'

export function TextImageEditor() {
  const [localSlide, setLocalSlide] = useState<ISlide | null>(null)
  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null)
  const [editingBlock, setEditingBlock] = useState<string | null>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [fileUploaderOpen, setFileUploaderOpen] = useState<boolean>(false)
  const debouncedLocalSlide = useDebounce(localSlide, 500)

  const { currentSlide, updateSlide } = useContext(
    SlideManagerContext
  ) as SlideManagerContextType

  useEffect(() => {
    setLocalSlide(currentSlide)
  }, [currentSlide])

  useEffect(() => {
    if (!currentSlide?.content) {
      return
    }

    updateSlide({
      ...currentSlide,
      content: {
        ...currentSlide.content,
        ...debouncedLocalSlide?.content,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedLocalSlide])

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

  const textBlocks = blocks.filter((block) =>
    ['header', 'paragraph'].includes(block.type)
  ) as TextBlock[]

  const imageBlocks = blocks.find(
    (block) => block.type === 'image'
  ) as FileBlock

  return (
    <div className="w-full h-full flex justify-center items-center group">
      <PanelGroup
        direction="horizontal"
        className="w-full"
        ref={panelGroupRef}
        onLayout={handlePanelLayoutChange}>
        <Panel minSize={30}>
          <div className="h-full flex flex-col justify-center items-center">
            {textBlocks.map((block) => (
              <div
                onClick={() => setEditingBlock(block.id)}
                id={`block-editor-${block.id}`}
                className="w-full">
                <TextBlockEditor
                  key={block.id}
                  block={block}
                  editable={editingBlock === block.id}
                  onChange={handleBlockChange}
                />
              </div>
            ))}
          </div>
        </Panel>
        <PanelResizeHandle className="opacity-50 bg-gray-800 w-2 h-12 rounded-full relative z-10 -right-1 top-1/2 -translate-y-1/2 cursor-col-resize group-hover:opacity-100 transition-opacity duration-500" />
        <Panel minSize={30} maxSize={60}>
          <div className="flex justify-center items-center overflow-hidden rounded-md h-full">
            <div className="relative rounded-md overflow-hidden group">
              <Image
                ref={imageRef}
                src={imageBlocks?.data.file.url}
                loading="lazy"
                className={cn(
                  'relative z-0 flex-none rounded-md overflow-hidden'
                )}
                onError={() => {
                  if (imageRef.current) {
                    imageRef.current.style.opacity = '1'
                    imageRef.current.src =
                      'https://placehold.co/400x600?text=Placeholder+Image'
                  }
                }}
              />
              <div
                className={cn(
                  'opacity-0 absolute left-0 top-0 w-full h-full flex justify-center items-center hover:opacity-100',
                  {
                    'opacity-100': fileUploaderOpen,
                  }
                )}>
                <FileUploader
                  maxNumberOfFiles={1}
                  allowedFileTypes={['.jpg', '.jpeg', '.png']}
                  folderName={localSlide.id}
                  triggerProps={{
                    children: 'Upload Image',
                    variant: 'flat',
                    className: 'bg-black text-white',
                  }}
                  onFilePickerOpen={setFileUploaderOpen}
                  onFilesUploaded={handleFileUpload}
                />
              </div>
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}
