"use client"

import { useEffect, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { ISlide } from "@/types/slide.type"
import { OnDocumentLoadSuccess } from "react-pdf/dist/cjs/shared/types"
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.js"
import { downloadPDFFile } from "@/services/pdf.service"
import { NextPrevButtons } from "@/components/common/NextPrevButtons"

interface PDFViewerProps {
  slide: ISlide
}

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

const getFileObjectFromBlob = (fileName: string, blob: Blob) => {
  return new File([blob], fileName, { type: "application/pdf" })
}

export const PDFViewer = ({ slide }: PDFViewerProps) => {
  const [file, setFile] = useState<File | undefined>()
  const [totalPages, setTotalPages] = useState<null | number>(null)
  const [selectedPage, setSelectedPage] = useState(1)

  useEffect(() => {
    downloadPDFFile(slide.content?.pdfPath).then((data) => {
      if (data.data) {
        setFile(getFileObjectFromBlob(slide.content?.pdfPath, data.data))
      }
    })
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
      </div>
    </div>
  )
}
