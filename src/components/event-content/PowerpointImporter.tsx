/* eslint-disable no-restricted-syntax */

import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { SiMicrosoftpowerpoint } from 'react-icons/si'

import { FrameFormContainer } from './FrameFormContainer'
import { ContentLoading } from '../common/ContentLoading'
import { FilePickerDropzone } from '../common/FilePickerDropzone'

import { FileConvertService } from '@/services/backend/file-convert-service'
import { IFrame } from '@/types/frame.type'

interface PowerpointImporterProps {
  frame: IFrame
}

export function PowerpointImporter({ frame }: PowerpointImporterProps) {
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('frameId', frame.id)

      await FileConvertService.importPowerpoint({
        file,
        sectionId: frame.section_id!,
        meetingId: frame.meeting_id!,
      })
    },
    onSuccess: () => toast.success('Powerpoint uploaded successfully.'),
    onError: (err) => {
      console.log('🚀 ~ PowerpointImporter ~ err:', err)
      toast.error(
        'Failed to upload Powerpoint, please try re-uploading again by deleting the frame.'
      )
    },
    onSettled: () => toast.remove(frame.id),
    onMutate: () => {
      toast.loading('Uploading Powerpoint...', {
        id: frame.id,
      })
    },
  })

  const uploadFile = async (file: File) => {
    uploadMutation.mutate(file, {
      onSuccess: () => {},
    })
  }

  if (uploadMutation.isPending) {
    return (
      <div>
        <ContentLoading />
      </div>
    )
  }

  return (
    <FrameFormContainer
      headerIcon={<SiMicrosoftpowerpoint size={72} className="text-primary" />}
      headerTitle="Import Powerpoint"
      headerDescription="Upload your Powerpoint file and get started."
      footerNote="This will take some time, depending on the size of the file.">
      <div className="w-full">
        <FilePickerDropzone
          fullWidth
          label="Drag & drop powerpoint file(.pptx) here or click here to upload file"
          supportedFormats={{ 'application/pptx': ['.pptx'] }}
          onUpload={(files) => {
            const fileList = []
            if (files) {
              for (const file of files) {
                fileList.push(file)
              }
              uploadFile(fileList[0])
            }
          }}
        />
      </div>
    </FrameFormContainer>
  )
}
