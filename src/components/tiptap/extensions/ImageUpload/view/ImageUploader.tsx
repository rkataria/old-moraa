// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// import { Button } from '@components/tiptap/ui/Button'

import { useState } from 'react'

import { Button } from '@heroui/react'

import { ContentLoading } from '@/components/common/ContentLoading'
import { MediaPicker } from '@/components/common/MediaPicker/MediaPicker'
import { uploadFile } from '@/services/storage.service'

export function ImageUploader({
  onUpload,
}: {
  onUpload: (url: string) => void
}) {
  const [imageUploadProgress, setImageUploadProgress] = useState<number>(0)

  return (
    <div
      className="realtive tiptap-uppy-upload text-center"
      contentEditable={false}>
      {imageUploadProgress === 0 ? (
        <MediaPicker
          trigger={
            <Button fullWidth className="relative" variant="light">
              Select image
            </Button>
          }
          placement="center"
          onSelectCallback={(img) => {
            if (!img) return
            onUpload(img.src)
          }}
          onSelect={async (file) => {
            const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '')
            const response = await uploadFile({
              file,
              fileName: `tiptap-${Date.now()}-${sanitizedName}`,
              bucketName: 'image-uploads',
              onProgressChange: setImageUploadProgress,
            }).promise
            if (response?.url) {
              onUpload(response.url)
            }
          }}
        />
      ) : (
        <ContentLoading
          fullPage
          overlay
          message={`Uploading ${imageUploadProgress}%`}
        />
      )}
    </div>
  )
}
