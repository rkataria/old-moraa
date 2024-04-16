/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-param-reassign */

import { TextBlockEditor } from '@/components/event-content/BlockEditor'
import { FileUploader } from '@/components/event-content/FileUploader'
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
  editingBlock,
  fileUploaderOpen,
  setFileUploaderOpen,
  setEditingBlock,
  onBlockChange,
  handleFileUpload,
}: ImageBehindProps) {
  const blocks = slide.content?.blocks || []

  const textBlocks = blocks.filter((block) =>
    ['header', 'paragraph'].includes(block.type)
  ) as TextBlock[]

  const imageBlocks = blocks.find(
    (block) => block.type === 'image'
  ) as FileBlock

  return (
    <div
      className="relative w-full h-full flex flex-col justify-center items-start group bg-center bg-cover"
      style={{
        backgroundImage: showImage
          ? `url(${imageBlocks?.data.file.url})`
          : undefined,
      }}>
      {textBlocks.map((block) => (
        <div
          onClick={() => setEditingBlock(block.id)}
          id={`block-editor-${block.id}`}
          className="w-full z-[1]">
          <TextBlockEditor
            key={block.id}
            block={block}
            editable={editingBlock === block.id}
            onChange={onBlockChange}
          />
        </div>
      ))}
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
  )
}
