/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-param-reassign */

import { FileUploader } from '@/components/event-content/FileUploader'
import { TextBlockEditor } from '@/components/event-content/TextBlockEditor'
import { FileBlock, ISlide, TextBlock } from '@/types/slide.type'

export type ImageBehindProps = {
  showImage?: boolean
  slide: ISlide
  fileUploaderOpen: boolean
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
  setFileUploaderOpen,
  onBlockChange,
  handleFileUpload,
}: ImageBehindProps) {
  const blocks = slide.content?.blocks || []

  const textBlock = blocks.find(
    (block) => block.type === 'paragraph'
  ) as TextBlock

  const imageBlocks = blocks.find(
    (block) => block.type === 'image'
  ) as FileBlock

  return (
    <div className="relative w-full h-full pt-16">
      <div
        className="w-full h-full flex justify-center items-center bg-center bg-cover"
        style={{
          backgroundImage: showImage
            ? `url(${imageBlocks?.data.file.url})`
            : undefined,
        }}>
        <TextBlockEditor
          stickyToolbar
          block={textBlock}
          onChange={onBlockChange}
        />
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
