"use client"

import { useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { ISlide } from "@/types/slide.type"
import { OnDocumentLoadSuccess } from "react-pdf/dist/cjs/shared/types"
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.js"
import FilePicker from "../ui/file-picker"
import { NextPrevButtons } from "../common/NextPrevButtons"

interface PDFViewerProps {
  slide: ISlide
}

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

const getFileObjectForPDF = (url: string) => {
  return fetch(url)
    .then((r) => r.blob())
    .then((blob) => {
      var fileName = Math.random().toString(36).substring(6) + ".pdf"
      var fileObject = new File([blob], fileName, { type: "application/pdf" })
      return fileObject
    })
}

export const PDFViewer = ({ slide }: PDFViewerProps) => {
  const [file, setFile] = useState<File | undefined>()
  const [totalPages, setTotalPages] = useState<null | number>(null)
  const [selectedPage, setSelectedPage] = useState(1);

  // useEffect(() => {
  //   getFileObjectForPDF(
  //     "https://www.clickdimensions.com/links/TestPDFfile.pdf"
  //   ).then((file) => setFile(file))
  // }, [])

  const onDocumentLoadSuccess: OnDocumentLoadSuccess = ({
    numPages: nextNumPages,
  }) => {
    setTotalPages(nextNumPages)
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center px-8 bg-white">
      {!file ? (
        <div>
          <FilePicker
            hideClearButton
            placeholder="Select PDF file"
            onFileChange={(files) => {
              setFile(files?.[0])
            }}
            buttonProps={{
              children: 'Select PDF file'
            }}
          />
        </div>
      ) : (
        <div>
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            className="rounded overflow-y-scroll shadow-lg"
          >
            <Page
              loading={' '}
              pageNumber={selectedPage}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              className="m-2 w-96"
            />
          </Document>
          <NextPrevButtons
            onPrevious={() => setSelectedPage((pos) => (pos > 1 ? pos - 1 : pos))}
            onNext={() => setSelectedPage((pos) => pos + 1)}
            prevDisabled={selectedPage === 1}
            nextDisabled={selectedPage === totalPages}
          />
        </div>
      )}
    </div>
  )
}
