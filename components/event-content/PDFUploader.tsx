/* eslint-disable no-restricted-syntax */

'use client'

import { useContext, useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.js'
import toast from 'react-hot-toast'
import { Document, Page, pdfjs } from 'react-pdf'
import { OnDocumentLoadSuccess } from 'react-pdf/dist/cjs/shared/types'

import { Button, Input } from '@nextui-org/react'

import { FilePicker } from '../common/FilePicker'

import { Loading } from '@/components/common/Loading'
import { NextPrevButtons } from '@/components/common/NextPrevButtons'
import { SlideManagerContext } from '@/contexts/SlideManagerContext'
import {
  deletePDFFile,
  downloadPDFFile,
  uploadPDFFile,
} from '@/services/pdf.service'
import { ISlide, SlideManagerContextType } from '@/types/slide.type'
import { QueryKeys } from '@/utils/query-keys'
import { getFileObjectFromBlob } from '@/utils/utils'

interface PDFUploaderProps {
  slide: ISlide
}

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

const getPDFName = (slideId: string) => `${slideId}_pdf.pdf`

export function PDFUploader({ slide }: PDFUploaderProps) {
  const { updateSlide } = useContext(
    SlideManagerContext
  ) as SlideManagerContextType

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
          ...slide,
          content: {
            pdfPath: res.data?.path,
          },
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
      ...slide,
      content: {
        ...slide.content,
        defaultPage,
        pdfPath: fileUrl,
      },
    })
    setSelectedPage(defaultPage || 1)
  }

  const getInnerContent = () => {
    switch (true) {
      case uploadPDFMutation.isPending || downloadPDFQuery.isLoading:
        return (
          <div className="mt-12 flex justify-center items-center flex-col">
            <Loading />
            <div>Please wait while we are loading the PDF...</div>
          </div>
        )

      case !fileUrl:
        return (
          <div className="h-96 flex flex-col justify-center items-center">
            <p className="mb-4">Select the PDF file.</p>
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
              className="rounded overflow-y-scroll shadow-lg"
              loading={
                <div className="h-96">
                  <Loading />
                </div>
              }>
              <Page
                loading={' '}
                pageNumber={selectedPage}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                className="m-2 w-96"
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
    <div className="w-full flex flex-col justify-center items-center px-8 bg-white">
      {getInnerContent()}
    </div>
  )
}
