"use client"

import { useContext, useEffect, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { ISlide } from "@/types/slide.type"
import { OnDocumentLoadSuccess } from "react-pdf/dist/cjs/shared/types"
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.js"
import { downloadPDFFile } from "@/services/pdf.service"
import { NextPrevButtons } from "@/components/common/NextPrevButtons"
import { EventSessionContextType } from "@/types/event-session.type"
import EventSessionContext from "@/contexts/EventSessionContext"
import { useMutation } from "@tanstack/react-query"
import Loading from "@/components/common/Loading"
import { getFileObjectFromBlob } from "@/utils/utils"

interface PDFViewerProps {
  slide: ISlide
}

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

export const PDFViewer = ({ slide }: PDFViewerProps) => {
  const [file, setFile] = useState<File | undefined>()
  const [totalPages, setTotalPages] = useState<null | number>(null)
  const [selectedPage, setSelectedPage] = useState(1)
  const { isHost } = useContext(EventSessionContext) as EventSessionContextType
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
    setSelectedPage(slide.content?.defaultPage || 1)
  }, [slide.content?.pdfPath])

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
        {isHost && (
          <div className="m-4 flex justify-between items-center">
            <div />
            <NextPrevButtons
              onPrevious={() =>
                setSelectedPage((pos) => (pos > 1 ? pos - 1 : pos))
              }
              onNext={() => setSelectedPage((pos) => pos + 1)}
              prevDisabled={selectedPage === 1}
              nextDisabled={selectedPage === totalPages}
            />
          </div>
        )}
      </div>
    </div>
  )
}
