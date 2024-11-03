/* eslint-disable no-restricted-syntax */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useContext, useEffect, useRef, useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FaFilePdf } from 'react-icons/fa'

import { FrameFormContainer } from './FrameFormContainer'
import { PdfPage } from '../common/content-types/PageRenderer'
import { FilePickerDropzone } from '../common/FilePickerDropzone'
import { PageControls } from '../common/PageControls'

import { Loading } from '@/components/common/Loading'
import { EventContext } from '@/contexts/EventContext'
import { usePdfControls } from '@/hooks/usePdfControls'
import {
  deletePDFFile,
  downloadPDFFile,
  uploadPDFFile,
} from '@/services/pdf.service'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'
import { getLastVisitedPage, updateLastVisitedPage } from '@/utils/pdf.utils'
import { QueryKeys } from '@/utils/query-keys'
import { getFileObjectFromBlob } from '@/utils/utils'

interface PDFUploaderProps {
  frame: IFrame & {
    content: {
      pdfPath: string
      defaultPage: number
    }
  }
}

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

  const initialZoom = getLastVisitedPage(frame.id)?.pageScale

  const {
    zoomType,
    fitDimensions,
    isLandscape,
    fitPageToContainer,
    handleScaleChange,
  } = usePdfControls(containerRef, initialZoom)

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

  const handlePositionChange = (newPosition: number) => {
    if (newPosition < 1 || newPosition > totalPages) return
    setSelectedPage(newPosition)
  }

  const onChangeScale = (zoom: IPdfZoom) => {
    const updatedZoom = handleScaleChange(zoom)
    updateLastVisitedPage(frame.id, {
      pageScale: updatedZoom,
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
        return (
          <div className="relative h-full overflow-hidden" ref={containerRef}>
            <div className="overflow-y-auto h-full scrollbar-none">
              <PdfPage
                file={downloadPDFQuery.data}
                pageNumber={selectedPage}
                onDocumentLoadSuccess={onDocumentLoadSuccess}
                onPageLoadSuccess={fitPageToContainer}
                fitDimensions={fitDimensions}
              />
              <PageControls
                zoom={zoomType}
                currentPage={selectedPage}
                totalPages={totalPages}
                shouldRenderZoomControls={!isLandscape}
                handleCurrentPageChange={(page) => {
                  handlePositionChange(page <= totalPages ? page : totalPages)
                  updateLastVisitedPage(frame.id, {
                    position: page,
                  })
                }}
                handleScaleChange={onChangeScale}
              />
            </div>
          </div>
        )

      default:
        return 'Something went wrong...'
    }
  }

  return <>{getInnerContent()}</>
}
