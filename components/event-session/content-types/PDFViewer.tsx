'use client'

import { useContext, useEffect, useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.js'
import { Document, Page, pdfjs } from 'react-pdf'
import { OnDocumentLoadSuccess } from 'react-pdf/dist/cjs/shared/types'

import { Skeleton } from '@nextui-org/react'

import { PageControls } from '@/components/common/PageControls'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { downloadPDFFile } from '@/services/pdf.service'
import { EventSessionContextType } from '@/types/event-session.type'
import { ISlide } from '@/types/slide.type'
import { getFileObjectFromBlob } from '@/utils/utils'

interface PDFViewerProps {
  slide: ISlide & {
    content: {
      pdfPath: string
      defaultPage: number
    }
  }
}

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

const positionChangeEvent = 'pdf-position-changed'

export function PDFViewer({ slide }: PDFViewerProps) {
  const [file, setFile] = useState<File | undefined>()
  const { isHost, realtimeChannel, activeSession, updateActiveSession } =
    useContext(EventSessionContext) as EventSessionContextType
  const [totalPages, setTotalPages] = useState<number>(0)
  const [position, setPosition] = useState<number>(
    slide.content?.defaultPage || 1
  )

  useEffect(() => {
    if (!activeSession?.data?.PdfSlideLastPosition) return

    setPosition(activeSession?.data?.PdfSlideLastPosition)
  }, [activeSession?.data?.PdfSlideLastPosition])

  const downloadPDFMutation = useMutation({
    mutationFn: () =>
      downloadPDFFile(slide.content?.pdfPath).then((data) =>
        getFileObjectFromBlob(
          slide.content?.pdfPath,
          data.data,
          'application/pdf'
        )
      ),
    onSuccess: (_file) => setFile(_file),
  })

  useEffect(() => {
    downloadPDFMutation.mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide.content?.pdfPath])

  useEffect(() => {
    if (!realtimeChannel) return
    realtimeChannel.on(
      'broadcast',
      { event: positionChangeEvent },
      ({ payload }) => {
        setPosition(payload.position || 1)
        updateActiveSession({
          PdfSlideLastPosition: payload.position || 1,
        })
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realtimeChannel])

  const handlePositionChange = (newPosition: number) => {
    if (newPosition < 1 || newPosition > totalPages) return

    realtimeChannel.send({
      type: 'broadcast',
      event: positionChangeEvent,
      payload: { position: newPosition },
    })
  }

  const onDocumentLoadSuccess: OnDocumentLoadSuccess = ({
    numPages: nextNumPages,
  }) => {
    setTotalPages(nextNumPages)
  }

  if (!downloadPDFMutation.isSuccess) {
    return <Skeleton className="w-full h-full rounded-md" />
  }

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        className="absolute left-0 top-0 h-full w-full m-0 overflow-y-auto scrollbar-thin"
        loading="Please wait! Loading the PDF.">
        <Page
          loading={' '}
          pageNumber={position}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          className="w-full"
        />
      </Document>
      {isHost && (
        <PageControls
          currentPage={position}
          totalPages={totalPages}
          handleCurrentPageChange={handlePositionChange}
        />
      )}
    </div>
  )
}
