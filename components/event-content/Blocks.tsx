/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRef, useState } from 'react'

import Cropper from 'react-easy-crop'
import { LuImage } from 'react-icons/lu'
import {
  ImperativePanelGroupHandle,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from 'react-resizable-panels'

import { Image } from '@nextui-org/react'

import { TextBlockEditor } from './BlockEditor'
import { ControlButton } from './BlockEditorControls'
import { ImageBlock } from '../event-session/content-types/TextImage'

import { FileBlock, TextBlock } from '@/types/slide.type'
import { cn } from '@/utils/utils'

type BlocksProps = {
  blocks: TextBlock[] | FileBlock[]
}

export function Blocks({ blocks }: BlocksProps) {
  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null)
  const [editingBlock, setEditingBlock] = useState<string | null>(null)
  const [editingImage, setEditingImage] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLImageElement>(null)
  const [imageContainerConstraints, setImageContainerConstraints] = useState<{
    width: number | 0
    height: number | 0
  }>({
    width: 0,
    height: 0,
  })

  const textBlocks = blocks.filter((block) =>
    ['header', 'paragraph'].includes(block.type)
  ) as TextBlock[]

  const imageBlocks = blocks.find(
    (block) => block.type === 'image'
  ) as ImageBlock

  return (
    <div className="w-full h-full flex justify-center items-center group">
      <PanelGroup direction="horizontal" className="w-full" ref={panelGroupRef}>
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
                />
              </div>
            ))}
          </div>
        </Panel>
        <PanelResizeHandle className="opacity-50 bg-gray-800 w-2 h-12 rounded-full relative z-10 -right-1 top-1/2 -translate-y-1/2 cursor-col-resize group-hover:opacity-100 transition-opacity duration-500" />
        <Panel defaultSize={30} minSize={30} maxSize={60}>
          <div className="flex justify-center items-center overflow-hidden rounded-md h-full">
            {editingImage ? (
              <div
                className="relative w-full"
                style={{
                  width: imageContainerConstraints.width,
                  height: imageContainerConstraints.height,
                }}>
                <Cropper
                  image={imageBlocks?.data.file.url}
                  crop={crop}
                  // zoom={zoom}
                  aspect={4 / 3}
                  onCropChange={setCrop}
                  onCropComplete={() => {}}
                  // onZoomChange={setZoom}
                />
                <div className="absolute right-2 top-2 flex justify-center items-center">
                  <div className="bg-black/80 p-2 rounded-md">
                    <ControlButton
                      active={false}
                      tooltipText="Reposotion image"
                      icon={<LuImage size={18} />}
                      onClick={() => {
                        setEditingImage(false)
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative bg-gray-900 rounded-md overflow-hidden group">
                <Image
                  ref={imageRef}
                  src={imageBlocks?.data.file.url}
                  removeWrapper
                  className={cn(
                    'relative z-0 flex-none rounded-md overflow-hidden'
                  )}
                />
                <div className="opacity-0 absolute left-0 top-0 w-full h-full flex justify-center items-center hover:opacity-100">
                  <div className="bg-black/80 p-2 rounded-md">
                    <ControlButton
                      active={false}
                      tooltipText="Replace image"
                      icon={<LuImage size={18} />}
                      onClick={() => {}}
                    />
                    <ControlButton
                      active={false}
                      tooltipText="Reposotion image"
                      icon={<LuImage size={18} />}
                      onClick={() => {
                        setImageContainerConstraints({
                          width: imageRef.current?.clientWidth || 0,
                          height: imageRef.current?.clientHeight || 0,
                        })
                        setEditingImage(true)
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}
