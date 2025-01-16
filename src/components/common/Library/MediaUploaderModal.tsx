import { useEffect, useState } from 'react'

import {
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Progress,
  Chip,
} from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { v4 as uuidv4 } from 'uuid'

import { FilePickerDropzone } from '../FilePickerDropzone'

import { uploadFile } from '@/services/storage.service'
import { formatFileSize } from '@/utils/file-size-format'

enum UploadStatus {
  NOT_STARTED,
  IN_PROGRESS,
  UPLOADED,
  FAILED,
}

interface MediaFile {
  id: string
  file: globalThis.File
  progress: number
  status: UploadStatus
  path: string
  cancelUpload?: () => void
}

interface FilePickerModalProps {
  isOpen: boolean
  onClose: () => void
  onFileUploaded: (file: Omit<MediaFile, 'status' | 'progress'>) => void
}

const getFilePath = (fileName: string) => `media-library/file-${fileName}`

export function FilePickerModal({
  isOpen,
  onClose,
  onFileUploaded,
}: FilePickerModalProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const uploadFilesMutation = useMutation({
    mutationFn: async (file: MediaFile) => {
      const { promise, cancelUpload } = uploadFile({
        fileName: file.path,
        file: file.file,
        neverExpire: false,
        onProgressChange: (progress) =>
          setFiles((prevFiles) =>
            prevFiles.map((prevFile) =>
              prevFile.id === file.id ? { ...prevFile, progress } : prevFile
            )
          ),
      })

      // Attach the cancel method to the file object for external access
      setFiles((prevFiles) =>
        prevFiles.map((prevFile) =>
          prevFile.id === file.id ? { ...prevFile, cancelUpload } : prevFile
        )
      )

      return promise
    },
    onSuccess: (_, file) => {
      onFileUploaded({
        file: file.file,
        id: file.id,
        path: file.path,
      })
      setFiles((prevFiles) =>
        prevFiles.map((prevFile) =>
          prevFile.id === file.id
            ? { ...prevFile, status: UploadStatus.UPLOADED }
            : prevFile
        )
      )
    },
    onError: (err, file) => {
      setFiles((prevFiles) =>
        prevFiles.map((prevFile) =>
          prevFile.id === file.id
            ? { ...prevFile, status: UploadStatus.FAILED }
            : prevFile
        )
      )
      console.log('🚀 ~ ImageUploader ~ err:', err)
    },
    onMutate: (file) => {
      setFiles((prevFiles) =>
        prevFiles.map((prevFile) =>
          prevFile.id === file.id
            ? { ...prevFile, status: UploadStatus.IN_PROGRESS }
            : prevFile
        )
      )
    },
  })

  useEffect(() => {
    if (isOpen) return

    setFiles((prevFiles) =>
      prevFiles.filter((file) => file.status !== UploadStatus.UPLOADED)
    )
  }, [isOpen])

  const onCancelUpload = (file: MediaFile) => {
    file.cancelUpload?.()
    setFiles((prevFiles) =>
      prevFiles.filter((prevFile) => prevFile.id !== file.id)
    )
  }

  return (
    <Modal closeButton isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalContent>
        <ModalHeader>
          <div>
            <h2>Media Upload</h2>
            <p className="text-xs font-light">
              Add your documents here, and you can upload up to 5 ties max
            </p>
          </div>
        </ModalHeader>
        <ModalBody>
          <div>
            <FilePickerDropzone
              fullWidth
              label={
                <div className="flex flex-col justify-center align-center">
                  Drag your files to start uploading
                  <div className="my-4 text-gray-700">OR</div>
                  <Button
                    variant="bordered"
                    color="primary"
                    onClick={(e) => e.currentTarget.parentElement?.click()}>
                    Browse Files
                  </Button>
                </div>
              }
              supportedFormats={{
                'image/*': ['.jpg', '.jpeg', '.png'],
                'audio/*': ['.mp3', '.wav'],
                'video/*': ['.mp4'],
                'application/pdf': ['.pdf'],
              }}
              multiple
              onUpload={(pickedFile) => {
                if (!pickedFile) return

                const newFiles = [
                  ...files,
                  ...pickedFile.map((file) => {
                    const id = uuidv4()

                    return {
                      id,
                      file,
                      path: getFilePath(file.name),
                      progress: 0,
                      status: UploadStatus.NOT_STARTED,
                    }
                  }),
                ]
                newFiles.forEach((file) => {
                  if (file.status === UploadStatus.NOT_STARTED) {
                    uploadFilesMutation.mutate(file)
                  }
                })
                setFiles(newFiles)
              }}
            />
            <div className="text-gray-400 my-4 flex justify-between items-center">
              <span>Only support jpeg, png, mp3, mp4 and pdf files</span>
            </div>
          </div>

          {files.map((file) => (
            <div className="mb-2 border border-gray-200 px-4 py-2 rounded-md border-2">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold mb-1">
                    {file.file.name}{' '}
                    {file.status === UploadStatus.FAILED ? (
                      <Chip
                        color="danger"
                        variant="bordered"
                        size="sm"
                        className="ml-4">
                        Failed
                      </Chip>
                    ) : null}
                  </div>
                  <div className="font-light mb-2 text-gray-600">
                    {formatFileSize(file.file.size)}
                  </div>
                </div>
                <div>
                  <Button
                    isIconOnly
                    color="danger"
                    variant="light"
                    size="sm"
                    onClick={() => onCancelUpload(file)}>
                    <IoCloseCircleOutline size={20} />
                  </Button>
                </div>
              </div>
              <Progress
                aria-label="Loading..."
                color={
                  file.status === UploadStatus.FAILED ? 'danger' : 'default'
                }
                size="sm"
                value={file.progress}
              />
            </div>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button variant="bordered" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
