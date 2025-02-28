/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useState } from 'react'

import { Button, Modal, ModalContent } from '@heroui/react'
import { MdOutlineDriveFolderUpload } from 'react-icons/md'

import { ImageCropper } from './MediaPicker/ImageCropper'

import { uploadFile } from '@/services/storage.service'
import { dataURLToFile } from '@/utils/file'

type LocalFilePickerProps = {
  accept?: string
  fileName: string
  bucketName?: string
  trigger?: React.ReactNode
  uploadRemote?: boolean
  className?: string
  crop?: boolean
  onSelect: (imageData: string) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpload?: (response: any) => void
  onProgressChange?: (progress: number) => void
}

export function LocalFilePicker({
  accept = 'image/png, image/jpeg, image/jpg',
  fileName,
  bucketName,
  trigger,
  uploadRemote,
  className,
  crop,
  onSelect,
  onUpload,
  onProgressChange,
}: LocalFilePickerProps) {
  const [isCropOpen, setIsCropOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(
    null
  )

  const handleUpload = async (fileUrl: string) => {
    const file = dataURLToFile(fileUrl, fileName)
    const response = await uploadFile({
      file,
      fileName,
      bucketName,
      onProgressChange,
    }).promise

    onUpload?.(response)
  }

  const handleCrop = (image: HTMLImageElement) => {
    setIsCropOpen(false)

    onSelect(image.src)

    if (uploadRemote) {
      handleUpload(image.src)
    }
  }

  if (isCropOpen && selectedImage) {
    return (
      <Modal
        size="2xl"
        isOpen={isCropOpen}
        onClose={() => setIsCropOpen(false)}>
        <ModalContent className="h-[28rem]">
          <ImageCropper
            selectedImage={selectedImage}
            onCrop={handleCrop}
            aspectRatio={1}
            onDiscard={() => {
              setIsCropOpen(false)
              setSelectedImage(null)
            }}
            onError={(error) => {
              console.error(error)
            }}
          />
        </ModalContent>
      </Modal>
    )
  }

  return (
    <label htmlFor="upload" className={className}>
      <input
        type="file"
        id="upload"
        className="hidden"
        accept={accept}
        onChange={async (e) => {
          const file = e.target.files?.[0]

          if (!file) return

          if (crop) {
            const image = new Image()
            image.src = URL.createObjectURL(file!)
            image.onload = () => {
              setSelectedImage(image)
              setIsCropOpen(true)
            }
          } else {
            // onSelect(file)
            // if (uploadRemote) {
            //   handleUpload(file)
            // }
          }
        }}
      />
      {trigger || (
        <Button variant="light">
          <MdOutlineDriveFolderUpload size={18} />
        </Button>
      )}
    </label>
  )
}
