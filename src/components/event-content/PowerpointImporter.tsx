/* eslint-disable no-restricted-syntax */

import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { SiMicrosoftpowerpoint } from 'react-icons/si'

import { FrameFormContainer } from './FrameFormContainer'
import { ContentLoading } from '../common/ContentLoading'
import { FilePickerDropzone } from '../common/FilePickerDropzone'

import { useFlags } from '@/flags/client'
import { FileConvertService } from '@/services/backend/file-convert-service'
import { IFrame } from '@/types/frame.type'

interface PowerpointImporterProps {
  frame: IFrame
}

export function PowerpointImporter({ frame }: PowerpointImporterProps) {
  const { flags } = useFlags()

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('frameId', frame.id)

      if (!frame.section_id || !frame.meeting_id || !frame.id) return

      await FileConvertService.importPowerpoint({
        file,
        sectionId: frame.section_id!,
        meetingId: frame.meeting_id!,
        uploaderFrameId: frame.id,
        outputType: flags?.import_ppt_output === 'svg' ? 'svg' : 'png',
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
      <FrameFormContainer
        headerIcon={
          <SiMicrosoftpowerpoint size={72} className="text-primary" />
        }
        headerTitle="Uploading Powerpoint"
        headerDescription="Your Powerpoint is being uploaded. This will take some time, depending on the size of the file."
        footerNote="You can add/update other frames in the meantime.">
        <div className="w-full">
          <ContentLoading />
        </div>
      </FrameFormContainer>
    )
  }

  if (frame.content?.processing || uploadMutation.isSuccess) {
    return (
      <FrameFormContainer
        headerIcon={
          <SiMicrosoftpowerpoint size={72} className="text-primary" />
        }
        headerTitle="Processing Powerpoint"
        headerDescription="Your Powerpoint is being processed. This will take some time, depending on the size of the file."
        footerNote="You can add/update other frames in the meantime.">
        <div className="w-full">
          <ContentLoading />
        </div>
      </FrameFormContainer>
    )
  }

  return (
    <FrameFormContainer
      headerIcon={<SiMicrosoftpowerpoint size={72} className="text-primary" />}
      headerTitle="Import Powerpoint"
      headerDescription="Upload your Powerpoint file and get started. This will take some time, depending on the size of the file."
      footerNote={
        flags?.import_ppt_output === 'svg'
          ? 'You will be able to edit your Powerpoint in SVG format.'
          : 'You won’t be able to edit your Powerpoint as it will be imported in PNG format.'
      }>
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
