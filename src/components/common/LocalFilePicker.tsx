/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { Button } from '@nextui-org/react'
import { MdOutlineDriveFolderUpload } from 'react-icons/md'

import { uploadFile } from '@/services/storage.service'

type LocalFilePickerProps = {
  accept?: string
  fileName: string
  bucketName?: string
  trigger?: React.ReactNode
  uploadRemote?: boolean
  className?: string
  onSelect: (file: File) => void
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
  onSelect,
  onUpload,
  onProgressChange,
}: LocalFilePickerProps) {
  return (
    <label htmlFor="upload" className={className}>
      <input
        type="file"
        id="upload"
        className="hidden"
        accept={accept}
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (file) {
            onSelect(file)

            if (uploadRemote) {
              const response = await uploadFile({
                file,
                fileName: `${fileName}.${file.name.split('.').pop()}`,
                bucketName,
                onProgressChange,
              })

              onUpload?.(response)
            }
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
