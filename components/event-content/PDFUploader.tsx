"use client"

import { useContext, useEffect, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { ISlide, SlideManagerContextType } from "@/types/slide.type"
import { OnDocumentLoadSuccess } from "react-pdf/dist/cjs/shared/types"
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.js"
import FilePicker from "../ui/file-picker"
import { NextPrevButtons } from "../common/NextPrevButtons"
import { downloadPDFFile, uploadPDFFile } from "@/services/pdf.service"
import SlideManagerContext from "@/contexts/SlideManagerContext"
import { Button, Input } from "@chakra-ui/react"

interface PDFUploaderProps {
  slide: ISlide
}

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

const getFileObjectFromBlob = (fileName: string, blob: Blob) => {
  return new File([blob], fileName, { type: "application/pdf" })
}

export const PDFUploader = ({ slide }: PDFUploaderProps) => {
  const [file, setFile] = useState<File | undefined>()
  const [totalPages, setTotalPages] = useState<null | number>(null)
  const [defaultPage, setDefaultPage] = useState<null | number>(null)
  const [selectedPage, setSelectedPage] = useState(1)
  const { updateSlide } = useContext(
    SlideManagerContext
  ) as SlideManagerContextType

  useEffect(() => {
    downloadPDFFile(slide.content?.pdfPath).then((data) => {
      if (data.data) {
        setFile(getFileObjectFromBlob(slide.content?.pdfPath, data.data))
      }
    })
    setDefaultPage(slide.content?.defaultPage || null)
  }, [slide.content?.pdfPath])

  const uploadAndSetFile = async (file: File) => {
    const { data, error } = await uploadPDFFile(slide.id + `_pdf.pdf`, file)
    if (error) {
      return console.error(error)
    }
    updateSlide({
      ...slide,
      content: {
        pdfPath: data?.path,
      },
    })
  }

  const onDocumentLoadSuccess: OnDocumentLoadSuccess = ({
    numPages: nextNumPages,
  }) => {
    setTotalPages(nextNumPages)
  }

  const saveDefaultPageNumber = () => {
    updateSlide({
      ...slide,
      content: {
        ...slide.content,
        defaultPage,
      },
    })
    setSelectedPage(defaultPage || 1)
  }

  return (
    <div className="w-full flex flex-col justify-center items-center px-8 bg-white">
      {!file ? (
        <div className="h-96 flex justify-center items-center">
          <FilePicker
            hideClearButton
            placeholder="Select PDF file"
            onFileChange={(files) => {
              if (files?.[0]) uploadAndSetFile(files[0])
            }}
            buttonProps={{
              children: "Upload PDF file",
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
              loading={" "}
              pageNumber={selectedPage}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              className="m-2 w-96"
            />
          </Document>
          <div className="m-4 flex justify-between items-center">
            <div className="flex items-center">
              <Input
                placeholder="Initial page number"
                className="mr-2"
                type="number"
                value={`${defaultPage}`}
                onChange={(e) => {
                  if (
                    +e.target.value > 0 &&
                    +e.target.value <= (totalPages || 0)
                  )
                    setDefaultPage(+e.target.value)
                }}
              />
              <Button size="sm" onClick={saveDefaultPageNumber}>Save</Button>
            </div>
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
      )}
    </div>
  )
}
