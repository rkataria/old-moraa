/* eslint-disable no-restricted-syntax */

'use client'

import { useContext, useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.js'
import toast from 'react-hot-toast'
import { Document, Page, pdfjs } from 'react-pdf'
import { OnDocumentLoadSuccess } from 'react-pdf/dist/cjs/shared/types'

import { Button, Input } from '@nextui-org/react'

import { ContentLoading } from '../common/ContentLoading'
import { FilePicker } from '../common/FilePicker'
import { NextPrevButtons } from '../common/NextPrevButtons'

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
  const [totalPages, setTotalPages] = useState<null | number>(null)
  const [defaultPage, setDefaultPage] = useState<null | number>(
    slide.content?.defaultPage || 1
  )
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

      return uploadPDFFile(getPDFName(slide.id), file)
    },
    onSuccess: () => toast.success('PDF uploaded successfully.'),
    onError: () =>
      toast.error(
        'Failed to upload PDF, please try re-uploading again by deleting the slide.'
      ),
    onSettled: () => toast.remove(slide.id),
    onMutate: () => {
      toast.loading('Uploading PDF...', {
        id: slide.id,
      })
    },
  })

  const uploadAndSetFile = async (file: File) => {
    uploadPDFMutation.mutate(file, {
      onSuccess: (res) => {
        // Start the PDF download as soon as the URL is received.
        setFileURL(res.data?.path)
        // Update the slide in background.
        updateSlide({
          slidePayload: {
            content: {
              ...slide.content,
              pdfPath: res.data?.path,
            },
          },
          slideId: slide.id,
        })
      },
    })
  }

  const onDocumentLoadSuccess: OnDocumentLoadSuccess = ({
    numPages: nextNumPages,
  }) => {
    setTotalPages(nextNumPages)
  }

  const saveDefaultPageNumber = () => {
    if (!fileUrl) return
    updateSlide({
      slidePayload: {
        content: {
          ...slide.content,
          defaultPage,
          pdfPath: fileUrl,
        },
      },
      slideId: slide.id,
    })
    setSelectedPage(defaultPage || 1)
  }

  const getInnerContent = () => {
    switch (true) {
      case uploadPDFMutation.isPending || downloadPDFQuery.isLoading:
        return (
          <ContentLoading message="Please wait while we are uploading the PDF. This may take a few minutes!" />
        )

      case !fileUrl:
        return (
          <div className="flex flex-col justify-center items-center">
            <FilePicker
              label="Select PDF file"
              supportedFormats={['application/pdf']}
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
            <div className="m-4 flex justify-between items-center">
              <div className="flex items-center">
                <Input
                  placeholder="Initial page number"
                  className="mr-2"
                  type="number"
                  value={`${defaultPage}`}
                  onChange={(e) => {
                    if (
                      +e.target.value > 0 &&
                      +e.target.value <= (totalPages || 0)
                    ) {
                      setDefaultPage(+e.target.value)
                    }
                  }}
                />
                <Button size="sm" onClick={saveDefaultPageNumber}>
                  Save
                </Button>
              </div>
              <NextPrevButtons
                onPrevious={() =>
                  setSelectedPage((pos) => (pos > 1 ? pos - 1 : pos))
                }
                onNext={() => setSelectedPage((pos) => pos + 1)}
                prevDisabled={selectedPage === 1}
                nextDisabled={selectedPage === totalPages}
              />
            </div>
          </div>
        )

      default:
        return 'Something went wrong...'
    }
  }

  return (
    <div
      className={cn(
        'w-full h-full flex flex-col justify-center items-center px-8 bg-white',
        {
          'pt-[5rem]': !!downloadPDFQuery.data,
        }
      )}>
      {getInnerContent()}
    </div>
  )
}
