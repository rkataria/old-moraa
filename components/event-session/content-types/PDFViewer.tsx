"use client"

import { useCallback, useContext, useEffect, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { ISlide } from "@/types/slide.type"
import { OnDocumentLoadSuccess } from "react-pdf/dist/cjs/shared/types"
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.js"
import { downloadPDFFile } from "@/services/pdf.service"
import { EventSessionContextType } from "@/types/event-session.type"
import EventSessionContext from "@/contexts/EventSessionContext"
import { useMutation } from "@tanstack/react-query"
import Loading from "@/components/common/Loading"
import { getFileObjectFromBlob } from "@/utils/utils"
import { useDyteMeeting } from "@dytesdk/react-web-core"
import { SlideEventManagerType, SlideEvents } from "@/utils/events.util"

interface PDFViewerProps {
  slide: ISlide
}

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

const PositionChangeEvent = "pdf-position-changed"

export const PDFViewer = ({ slide }: PDFViewerProps) => {
  const [file, setFile] = useState<File | undefined>()
  const { isHost, metaData } = useContext(
    EventSessionContext
  ) as EventSessionContextType
  const [totalPages, setTotalPages] = useState<null | number>(null)
  const [selectedPage, setSelectedPage] = useState<number>(
    metaData.current.pdfLastPage || slide.content?.defaultPage
  )
  const { meeting } = useDyteMeeting()
  const downloadPDFMutation = useMutation({
    mutationFn: () =>
      downloadPDFFile(slide.content?.pdfPath).then((data) =>
        getFileObjectFromBlob(
          slide.content?.pdfPath,
          data.data,
          "application/pdf"
        )
      ),
    onSuccess: (file) => setFile(file),
  })

  useEffect(() => {
    downloadPDFMutation.mutate()
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
      "broadcastedMessage",
      handleBroadcastedMessage
    )
    SlideEvents[SlideEventManagerType.OnRight].subscribe(nextPosition)
    SlideEvents[SlideEventManagerType.OnLeft].subscribe(prevPosition)

    return () => {
      meeting.participants.removeListener(
        "broadcastedMessage",
        handleBroadcastedMessage
      )
      SlideEvents[SlideEventManagerType.OnRight].unsubscribe(nextPosition)
      SlideEvents[SlideEventManagerType.OnLeft].unsubscribe(prevPosition)
    }
  }, [totalPages])

  const broadcastPagePosition = useCallback((newPosition: number) => {
    meeting.participants.broadcastMessage(PositionChangeEvent, {
      position: newPosition,
    })
  }, [])

  const onDocumentLoadSuccess: OnDocumentLoadSuccess = ({
    numPages: nextNumPages,
  }) => {
    setTotalPages(nextNumPages)
  }

  return (
    <div className="w-full flex justify-center items-center bg-white overflow-scroll">
      <div>
        {downloadPDFMutation.isSuccess ? (
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            className="rounded overflow-y-scroll shadow-lg"
            loading={"Please wait! Loading the PDF."}
          >
            <Page
              loading={" "}
              pageNumber={selectedPage}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              className="m-2 w-96"
            />
          </Document>
        ) : (
          <div className="mt-12 flex justify-center items-center flex-col">
            <Loading />
            <div>Loading the PDF...</div>
          </div>
        )}
      </div>
    </div>
  )
}
