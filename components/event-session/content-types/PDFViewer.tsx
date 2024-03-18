'use client'

import { useCallback, useContext, useEffect, useState } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'
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
import { SlideEventManagerType, SlideEvents } from '@/utils/events.util'
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

const PositionChangeEvent = 'pdf-position-changed'

export function PDFViewer({ slide }: PDFViewerProps) {
  const [file, setFile] = useState<File | undefined>()
  const { isHost, metaData } = useContext(
    EventSessionContext
  ) as EventSessionContextType
  const [totalPages, setTotalPages] = useState<null | number>(null)
  const [selectedPage, setSelectedPage] = useState<number>(
    metaData.current.pdfLastPage || slide.content?.defaultPage || 1
  )
  const { meeting } = useDyteMeeting()
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
    if (totalPages === null) return

    const nextPosition = () =>
      setSelectedPage((pos) => {
        const newPos = pos + 1 > totalPages ? pos : pos + 1
        if (isHost) broadcastPagePosition(newPos)

        return newPos
      })
    const prevPosition = () =>
      setSelectedPage((pos) => {
        const newPos = pos > 1 ? pos - 1 : pos
        if (isHost) broadcastPagePosition(newPos)

        return newPos
      })

    const handleBroadcastedMessage = ({
      type,
      payload,
    }: {
      type: string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      payload: any
    }) => {
      switch (type) {
        case PositionChangeEvent: {
          setSelectedPage(payload.position || 1)
          metaData.current.pdfLastPage = payload.position || 1
          break
        }
        default:
          break
      }
    }
    meeting.participants.addListener(
      'broadcastedMessage',
      handleBroadcastedMessage
    )
    SlideEvents[SlideEventManagerType.OnRight].subscribe(nextPosition)
    SlideEvents[SlideEventManagerType.OnLeft].subscribe(prevPosition)

    // eslint-disable-next-line consistent-return
    return () => {
      meeting.participants.removeListener(
        'broadcastedMessage',
        handleBroadcastedMessage
      )
      SlideEvents[SlideEventManagerType.OnRight].unsubscribe(nextPosition)
      SlideEvents[SlideEventManagerType.OnLeft].unsubscribe(prevPosition)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages])

  const broadcastPagePosition = useCallback((newPosition: number) => {
    meeting.participants.broadcastMessage(PositionChangeEvent, {
      position: newPosition,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onDocumentLoadSuccess: OnDocumentLoadSuccess = ({
    numPages: nextNumPages,
  }) => {
    setTotalPages(nextNumPages)
  }
  const handleCurrentPageChange = (pageNumber: number) => {
    if ((totalPages && totalPages < pageNumber) || pageNumber === 0) return

    setSelectedPage(pageNumber)
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
          pageNumber={selectedPage}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          className="w-full"
        />
      </Document>
      {isHost && (
        <PageControls
          currentPage={selectedPage}
          totalPages={totalPages}
          handleCurrentPageChange={handleCurrentPageChange}
        />
      )}
    </div>
  )
}
