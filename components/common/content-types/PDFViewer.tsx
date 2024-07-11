'use client'

import { useContext, useEffect, useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.js'
import { Document, Page, pdfjs } from 'react-pdf'
import { OnDocumentLoadSuccess } from 'react-pdf/dist/cjs/shared/types'

import { Skeleton } from '@nextui-org/react'

import { PageControls } from '@/components/common/PageControls'
import { EventContext } from '@/contexts/EventContext'
import { downloadPDFFile } from '@/services/pdf.service'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'
import { getFileObjectFromBlob } from '@/utils/utils'

export type PDFViewerFrameType = IFrame & {
  content: {
    pdfPath: string
    defaultPage: number
  }
}

interface PDFViewerProps {
  frame: PDFViewerFrameType
  blockPageChange?: boolean
}

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

export function PDFViewer({ frame, blockPageChange = false }: PDFViewerProps) {
  const [file, setFile] = useState<File | undefined>()
  const { isOwner } = useContext(EventContext) as EventContextType
  const [totalPages, setTotalPages] = useState<number>(0)
  const [position, setPosition] = useState<number>(
    frame.content?.defaultPage || 1
  )

  const downloadPDFMutation = useMutation({
    mutationFn: () =>
      downloadPDFFile(frame.content?.pdfPath).then((data) =>
        getFileObjectFromBlob(
          frame.content?.pdfPath,
          data.data,
          'application/pdf'
        )
      ),
    onSuccess: (_file) => setFile(_file),
  })

  useEffect(() => {
    downloadPDFMutation.mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame.content?.pdfPath])

  const handlePositionChange = (newPosition: number) => {
    if (newPosition < 1 || newPosition > totalPages) return

    setPosition(newPosition)
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
    <div className="relative w-full h-full flex justify-start items-start">
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
      {isOwner && !blockPageChange && (
        <PageControls
          currentPage={position}
          totalPages={totalPages}
          handleCurrentPageChange={(page) => {
            handlePositionChange(page <= totalPages ? page : totalPages)
          }}
        />
      )}
    </div>
  )
}
