/* eslint-disable no-restricted-syntax */

import { useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FaFilePdf } from 'react-icons/fa'
import { pdfjs } from 'react-pdf'

import { Embed } from './Embed'

import { FilePickerDropzone } from '@/components/common/FilePickerDropzone'
import { Loading } from '@/components/common/Loading'
import { FrameFormContainer } from '@/components/event-content/FrameFormContainer'
import { useEventContext } from '@/contexts/EventContext'
import {
  deletePDFFile,
  downloadPDFFile,
  uploadPDFFile,
} from '@/services/pdf.service'
import { PdfFrame } from '@/types/frame-picker.type'
import { QueryKeys } from '@/utils/query-keys'
import { getFileObjectFromBlob } from '@/utils/utils'

interface EditProps {
  frame: PdfFrame
}

pdfjs.GlobalWorkerOptions.workerSrc = '/scripts/pdf.worker.min.mjs'

const getPDFName = (frameId: string) => `${frameId}_pdf.pdf`

export function Edit({ frame }: EditProps) {
  const { updateFrame } = useEventContext()

  const [fileUrl, setFileURL] = useState<string | undefined>(
    frame.content?.pdfPath
  )

  const [uploadProgress, setUploadProgress] = useState(0)

  const downloadPDFQuery = useQuery({
    queryKey: QueryKeys.DownloadPDF.item(fileUrl || ''),
    queryFn: () =>
      !fileUrl
        ? undefined
        : downloadPDFFile(fileUrl).then((data) =>
            getFileObjectFromBlob(
              frame.content?.pdfPath,
              data.data,
              'application/pdf'
            )
          ),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const uploadPDFMutation = useMutation({
    mutationFn: async (file: File) => {
      await deletePDFFile(getPDFName(frame.id)).catch(() => {})

      return uploadPDFFile(getPDFName(frame.id), file, setUploadProgress)
    },
    onSuccess: () => toast.success('PDF uploaded successfully.'),
    onError: (err) => {
      console.log('🚀 ~ PDFUploader ~ err:', err)
      toast.error(
        'Failed to upload PDF, please try re-uploading again by deleting the frame.'
      )
    },
    onSettled: () => toast.remove(frame.id),
    onMutate: () => {
      toast.loading('Uploading PDF...', {
        id: frame.id,
      })
    },
  })

  const uploadAndSetFile = async (file: File) => {
    uploadPDFMutation.mutate(file, {
      onSuccess: () => {
        // Start the PDF download as soon as the URL is received.
        setFileURL(getPDFName(frame.id))
        // Update the frame in background.
        updateFrame({
          framePayload: {
            content: {
              ...frame.content,
              pdfPath: getPDFName(frame.id),
            },
          },
          frameId: frame.id,
        })
      },
    })
  }

  const getInnerContent = () => {
    switch (true) {
      case downloadPDFQuery.isLoading:
        return (
          <div className="w-full h-full flex justify-center items-center">
            <Loading />
          </div>
        )

      case uploadPDFMutation.isPending:
      case !fileUrl:
        return (
          <FrameFormContainer
            headerIcon={<FaFilePdf size={72} className="text-primary" />}
            headerTitle="Embed PDF"
            headerDescription="Easily embed PDF file into Moraa Frame."
            footerNote="Uploading password protected PDF file won't be accessible by Participants">
            <div className="w-full">
              <FilePickerDropzone
                fullWidth
                label="Drag & drop pdf file here or click here to upload file"
                supportedFormats={{ 'application/pdf': ['.pdf'] }}
                uploadProgress={
                  uploadPDFMutation.isPending || downloadPDFQuery.isPending
                    ? uploadProgress
                    : 0
                }
                onUpload={(files) => {
                  const fileList = []
                  if (files) {
                    for (const file of files) {
                      fileList.push(file)
                    }
                    uploadAndSetFile(fileList[0])
                  }
                }}
              />
            </div>
          </FrameFormContainer>
        )

      case !!downloadPDFQuery.data:
        return <Embed frame={frame} />

      default:
        return 'Something went wrong...'
    }
  }

  return <>{getInnerContent()}</>
}
