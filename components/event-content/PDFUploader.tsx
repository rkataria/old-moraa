/* eslint-disable no-restricted-syntax */

'use client'

import { useContext, useEffect, useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.js'
import toast from 'react-hot-toast'
import { Document, Page, pdfjs } from 'react-pdf'
import { OnDocumentLoadSuccess } from 'react-pdf/dist/cjs/shared/types'

import { FilePicker } from '../common/FilePicker'
import { PageControls } from '../common/PageControls'

import { Loading } from '@/components/common/Loading'
import { EventContext } from '@/contexts/EventContext'
import {
  deletePDFFile,
  downloadPDFFile,
  uploadPDFFile,
} from '@/services/pdf.service'
import { EventContextType } from '@/types/event-context.type'
import { ISlide } from '@/types/slide.type'
import { QueryKeys } from '@/utils/query-keys'
import { cn, getFileObjectFromBlob } from '@/utils/utils'

interface PDFUploaderProps {
  slide: ISlide & {
    content: {
      pdfPath: string
      defaultPage: number
    }
  }
}

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

const getPDFName = (slideId: string) => `${slideId}_pdf.pdf`

export function PDFUploader({ slide }: PDFUploaderProps) {
  const { updateSlide } = useContext(EventContext) as EventContextType

  const [fileUrl, setFileURL] = useState<string | undefined>(
    slide.content?.pdfPath
  )
  const [uploadProgress, setUploadProgress] = useState(0)
  const [totalPages, setTotalPages] = useState<null | number>(null)
  const [selectedPage, setSelectedPage] = useState<number>(
    slide.content?.defaultPage || 1
  )
  const downloadPDFQuery = useQuery({
    queryKey: QueryKeys.DownloadPDF.item(fileUrl || ''),
    queryFn: () =>
      !fileUrl
        ? undefined
        : downloadPDFFile(fileUrl).then((data) =>
            getFileObjectFromBlob(
              slide.content?.pdfPath,
              data.data,
              'application/pdf'
            )
          ),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const uploadPDFMutation = useMutation({
    mutationFn: async (file: File) => {
      await deletePDFFile(getPDFName(slide.id)).catch(() => {})

      return uploadPDFFile(getPDFName(slide.id), file, setUploadProgress)
    },
    onSuccess: () => toast.success('PDF uploaded successfully.'),
    onError: (err) => {
      console.log('🚀 ~ PDFUploader ~ err:', err)
      toast.error(
        'Failed to upload PDF, please try re-uploading again by deleting the slide.'
      )
    },
    onSettled: () => toast.remove(slide.id),
    onMutate: () => {
      toast.loading('Uploading PDF...', {
        id: slide.id,
      })
    },
  })

  const uploadAndSetFile = async (file: File) => {
    uploadPDFMutation.mutate(file, {
      onSuccess: () => {
        // Start the PDF download as soon as the URL is received.
        setFileURL(getPDFName(slide.id))
        // Update the slide in background.
        updateSlide({
          slidePayload: {
            content: {
              ...slide.content,
              pdfPath: getPDFName(slide.id),
            },
          },
          slideId: slide.id,
        })
      },
    })
  }

  useEffect(() => {
    if (slide.content?.defaultPage) {
      setSelectedPage(slide.content?.defaultPage)
    }
  }, [slide.content?.defaultPage])

  const onDocumentLoadSuccess: OnDocumentLoadSuccess = ({
    numPages: nextNumPages,
  }) => {
    setTotalPages(nextNumPages)
  }

  const getInnerContent = () => {
    switch (true) {
      case downloadPDFQuery.isLoading:
        return (
          <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center">
            <Loading />
          </div>
        )

      case uploadPDFMutation.isPending:
      case !fileUrl:
        return (
          <div className="flex flex-col justify-center w-[50vw]">
            <FilePicker
              fullWidth
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
        )

      case !!downloadPDFQuery.data:
        return (
          <div>
            <Document
              file={downloadPDFQuery.data}
              onLoadSuccess={onDocumentLoadSuccess}
              className="relative aspect-video h-[520px] m-auto overflow-y-auto scrollbar-thin"
              loading={
                <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center">
                  <Loading />
                </div>
              }>
              <Page
                pageNumber={selectedPage}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                className="w-full"
              />
            </Document>
            <PageControls
              currentPage={selectedPage}
              totalPages={totalPages}
              handleCurrentPageChange={(page) => {
                setSelectedPage(
                  page <= (totalPages || 1) ? page : totalPages || 1
                )
              }}
            />
          </div>
        )

      default:
        return 'Something went wrong...'
    }
  }

  return (
    <div
      className={cn(
        'w-full h-full flex flex-col justify-center items-center bg-white'
      )}>
      {getInnerContent()}
    </div>
  )
}
