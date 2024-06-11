/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-param-reassign */

import { FileUploader } from '@/components/event-content/FileUploader'
import { TextBlockEditor } from '@/components/event-content/TextBlockEditor'
import { FileBlock, ISlide, TextBlock } from '@/types/slide.type'

export type ImageBehindProps = {
  showImage?: boolean
  slide: ISlide
  editingBlock: string | null
  fileUploaderOpen: boolean
  setEditingBlock: (id: string) => void
  onBlockChange: (block: TextBlock) => void
  handleFileUpload: (
    files: {
      signedUrl: string
      meta: { name: string; size: number; type: string }
    }[]
  ) => void
  setFileUploaderOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function ImageBehind({
  showImage = true,
  slide,
  fileUploaderOpen,
  editingBlock,
  setFileUploaderOpen,
  onBlockChange,
  handleFileUpload,
  setEditingBlock,
}: ImageBehindProps) {
  const blocks = slide.content?.blocks || []

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
    <div className="relative w-full h-full flex flex-col">
      {slide.config.showTitle && (
        <div onClick={() => setEditingBlock(headerBlock.id)}>
          <TextBlockEditor
            block={headerBlock}
            editable={editingBlock === headerBlock.id}
            onChange={onBlockChange}
          />
        </div>
      )}
      <div
        className="w-full h-full flex flex-col justify-center items-center bg-center bg-cover"
        style={{
          backgroundImage: showImage
            ? `url(${imageBlocks?.data.file.url})`
            : undefined,
        }}>
        <div className="flex flex-col h-full w-full">
          {slide.config.showDescription && (
            <div onClick={() => setEditingBlock(textBlock.id)}>
              <TextBlockEditor
                block={textBlock}
                editable={editingBlock === textBlock.id}
                onChange={onBlockChange}
              />
            </div>
          )}
        </div>

        {showImage ? (
          <div className="absolute right-2 bottom-2">
            <FileUploader
              maxNumberOfFiles={1}
              allowedFileTypes={['.jpg', '.jpeg', '.png']}
              folderName={slide.id}
              triggerProps={{
                children: 'Upload Image',
                variant: 'flat',
                className: fileUploaderOpen
                  ? 'bg-black text-white'
                  : 'bg-black/90 text-white',
              }}
              onFilePickerOpen={setFileUploaderOpen}
              onFilesUploaded={handleFileUpload}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
