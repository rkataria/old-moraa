/* eslint-disable no-param-reassign */
import { Image } from '@nextui-org/react'

import { FileUploader } from '../event-content/FileUploader'

import { cn } from '@/utils/utils'

export function ImageBlock({
  slideId,
  imageRef,
  imageBlocks,
  fileUploaderOpen,
  setFileUploaderOpen,
  onFileUpload,
}: {
  slideId: string
  imageRef: React.RefObject<HTMLImageElement>
  imageBlocks: { data: { file: { url: string } } } | undefined
  fileUploaderOpen: boolean
  setFileUploaderOpen: React.Dispatch<React.SetStateAction<boolean>>
  onFileUpload: (
    files: {
      signedUrl: string
      meta: { name: string; size: number; type: string }
    }[]
  ) => void
}) {
  return (
    <div className="relative rounded-md overflow-hidden group">
      <Image
        ref={imageRef}
        src={imageBlocks?.data.file.url}
        loading="lazy"
        className={cn('relative z-0 flex-none rounded-md overflow-hidden')}
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
          folderName={slideId}
          triggerProps={{
            children: 'Upload Image',
            variant: 'flat',
            className: 'bg-black text-white',
          }}
          onFilePickerOpen={setFileUploaderOpen}
          onFilesUploaded={onFileUpload}
        />
      </div>
    </div>
  )
}
