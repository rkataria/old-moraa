/* eslint-disable no-restricted-syntax */

import React, { useContext, useEffect, useRef, useState } from 'react'

import { Button } from '@nextui-org/button'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FaFilePdf } from 'react-icons/fa'
import { pdfjs, Document, Page } from 'react-pdf'

import { FrameFormContainer } from './FrameFormContainer'
import { FilePickerDropzone } from '../common/FilePickerDropzone'
import { PageControls } from '../common/PageControls'

import { Loading } from '@/components/common/Loading'
import { EventContext } from '@/contexts/EventContext'
import { usePDFZoomControls } from '@/hooks/usePDFZoomControls'
import {
  deletePDFFile,
  downloadPDFFile,
  uploadPDFFile,
} from '@/services/pdf.service'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'
import { getLastVisitedPage, updateLastVisitedPage } from '@/utils/pdf.utils'
import { QueryKeys } from '@/utils/query-keys'
import { cn, getFileObjectFromBlob } from '@/utils/utils'

interface PDFUploaderProps {
  frame: IFrame & {
    content: {
      pdfPath: string
      defaultPage: number
    }
  }
}

pdfjs.GlobalWorkerOptions.workerSrc = '/scripts/pdf.worker.min.mjs'

const getPDFName = (frameId: string) => `${frameId}_pdf.pdf`

export function PDFUploader({ frame }: PDFUploaderProps) {
  const { updateFrame } = useContext(EventContext) as EventContextType

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerRef = useRef<any>()

  const {
    handleZoomIn,
    handleZoomOut,
    pageScale,
    pdfPageWidth,
    fitPageToContainer,
  } = usePDFZoomControls(containerRef)

  const [fileUrl, setFileURL] = useState<string | undefined>(
    frame.content?.pdfPath
  )

  const [uploadProgress, setUploadProgress] = useState(0)
  const [totalPages, setTotalPages] = useState<null | number>(null)
  const [selectedPage, setSelectedPage] = useState<number>(
    frame.content?.defaultPage || getLastVisitedPage(frame.id)
  )

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

  useEffect(() => {
    if (frame.content?.defaultPage) {
      setSelectedPage(frame.content?.defaultPage)
    }
  }, [frame.content?.defaultPage])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDocumentLoadSuccess: any = ({ numPages: nextNumPages }: any) => {
    setTotalPages(nextNumPages)
  }

  // const [zoom, setZoom] = useState(10) // Initialize zoom level

  // const [pageScale, setPageScale] = useState(0.5) // Manage the zoom scale
  // const [pdfPageWidth, setPdfPageWidth] = useState(0) // Actual page width

  // Callback to fit the page into the container
  // const fitPageToContainer = (page) => {
  //   if (containerRef.current) {
  //     const containerWidth = containerRef.current.clientWidth
  //     const viewport = page.getViewport({ scale: 1 })
  //     const scale = containerWidth / viewport.width // Scale based on container width

  //     setPdfPageWidth(viewport.width * scale) // Set width to container width
  //   }
  // }

  // const handleZoomIn = () => {
  //   setPageScale((prevScale) => Math.min(prevScale + 0.15, 1)) // Max zoom scale: 3x (300%)
  // }

  // const handleZoomOut = () => {
  //   setPageScale((prevScale) => Math.max(prevScale - 0.15, 0.3)) // Min zoom scale: 0.25x (25%)
  // }

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
        return (
          <div
            ref={containerRef}
            className={cn(
              'flex justify-start items-start gap-4 h-full w-full mx-auto'
            )}>
            <Document
              file={downloadPDFQuery.data}
              onLoadSuccess={onDocumentLoadSuccess}
              className={cn(
                'relative h-full ml-0 overflow-y-auto scrollbar-none',
                {
                  'w-full': frame.config.landcapeView,
                }
              )}
              loading={
                <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center">
                  <Loading />
                </div>
              }>
              <Page
                renderAnnotationLayer={false}
                renderTextLayer={false}
                pageNumber={selectedPage}
                width={pdfPageWidth * pageScale * devicePixelRatio} // Apply zoom scaling and DPR
                onLoadSuccess={fitPageToContainer} // Fit page initially when loaded
              />
            </Document>
            <Button onClick={handleZoomIn} className="fixed left-[40%] top-16">
              zoonIn
            </Button>
            <Button className="fixed left-[80%] top-16">{pageScale}</Button>
            <Button onClick={handleZoomOut} className="fixed left-[30%] top-16">
              zoonOut
            </Button>
            <PageControls
              currentPage={selectedPage}
              totalPages={totalPages}
              handleCurrentPageChange={(page: number) => {
                setSelectedPage(
                  page <= (totalPages || 1) ? page : totalPages || 1
                )
                updateLastVisitedPage(frame.id, page)
              }}
            />
          </div>
        )

      default:
        return 'Something went wrong...'
    }
  }

  return <>{getInnerContent()}</>
}
