/* eslint-disable no-restricted-syntax */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useContext, useEffect, useRef, useState } from 'react'

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

  const [fileUrl, setFileURL] = useState<string | undefined>(
    frame.content?.pdfPath
  )

  const [uploadProgress, setUploadProgress] = useState(0)
  const [totalPages, setTotalPages] = useState<null | number>(null)
  const [selectedPage, setSelectedPage] = useState<number>(
    frame.content?.defaultPage || getLastVisitedPage(frame.id).position || 1
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerRef = useRef<any>()

  const {
    handleZoomIn,
    handleZoomOut,
    pageScale,
    pdfPageWidth,
    isLandscape,
    fitPageToContainer,
  } = usePDFZoomControls(containerRef, getLastVisitedPage(frame.id).pageScale)

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
  const handleScaleChange = (zoomType: string) => {
    let newScale
    if (zoomType === 'zoomIn') {
      newScale = handleZoomIn()
    } else {
      newScale = handleZoomOut()
    }

    updateLastVisitedPage(frame.id, {
      pageScale: newScale,
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
              'flex justify-start items-start gap-4 h-full w-full mx-auto',
              {
                'w-auto aspect-video h-auto max-h-full': isLandscape,
                'justify-center': !isLandscape,
              }
            )}>
            <Document
              file={downloadPDFQuery.data}
              onLoadSuccess={onDocumentLoadSuccess}
              className={cn(
                'relative h-full ml-0 overflow-y-auto scrollbar-none',
                {
                  'w-fit h-[inherit]': isLandscape,
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
              {/* <Page
                width={pageDimensions.width / pageScale} // Adjust width based on scale
                height={pageDimensions.height / pageScale} // Adjust height based on scale
                pageNumber={selectedPage}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                onLoadSuccess={onLoadSuccess}
              /> */}
            </Document>
            <PageControls
              scale={pageScale}
              currentPage={selectedPage}
              totalPages={totalPages}
              shouldRenderZoomControls={!isLandscape}
              handleCurrentPageChange={(page: number) => {
                setSelectedPage(
                  page <= (totalPages || 1) ? page : totalPages || 1
                )
                updateLastVisitedPage(frame.id, {
                  position: page,
                })
              }}
              handleScaleChange={handleScaleChange}
            />
          </div>
        )

      default:
        return 'Something went wrong...'
    }
  }

  return <>{getInnerContent()}</>
}
// --scale-factor: 1.1013071895424837; background-color: white; position: relative; min-width: min-content; min-height: min-content;
