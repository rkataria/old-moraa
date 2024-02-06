"use client"

import { useContext, useEffect, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { ISlide, SlideManagerContextType } from "@/types/slide.type"
import { OnDocumentLoadSuccess } from "react-pdf/dist/cjs/shared/types"
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.js"
import FilePicker from "../ui/file-picker"
import { NextPrevButtons } from "../common/NextPrevButtons"
import {
  deletePDFFile,
  downloadPDFFile,
  uploadPDFFile,
} from "@/services/pdf.service"
import SlideManagerContext from "@/contexts/SlideManagerContext"
import { Button, Input, Text } from "@chakra-ui/react"
import Loading from "../common/Loading"
import toast from "react-hot-toast"
import { useMutation } from "@tanstack/react-query"
import { getFileObjectFromBlob } from "@/utils/utils"

interface PDFUploaderProps {
  slide: ISlide
}

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

export const PDFUploader = ({ slide }: PDFUploaderProps) => {
  const isEditMode = !slide.content?.pdfPath
  const [file, setFile] = useState<File | undefined>()
  const [totalPages, setTotalPages] = useState<null | number>(null)
  const [defaultPage, setDefaultPage] = useState<null | number>(
    slide.content?.defaultPage || 1
  )
  const [selectedPage, setSelectedPage] = useState<number>(
    slide.content?.defaultPage || 1
  )
  const uploadPDFMutation = useMutation({
    mutationFn: (file: File) => {
      return uploadPDFFile(slide.id + `_pdf.pdf`, file)
    },
    onSuccess: () => toast.success("PDF uploaded successfully."),
    onError: () =>
      toast.error(
        "Failed to upload PDF, please try re-uploading again by deleting the slide."
      ),
    onSettled: () => toast.remove(slide.id),
    onMutate: () => {
      toast.loading("Uploading PDF...", {
        id: slide.id,
      })
    },
  })

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

  const { updateSlide } = useContext(
    SlideManagerContext
  ) as SlideManagerContextType

  useEffect(() => {
    if (!file && slide.content?.pdfPath) {
      downloadPDFMutation.mutate()
    }
  }, [slide.content?.pdfPath])

  const uploadAndSetFile = async (file: File) => {
    setFile(file)
    if (slide.content?.pdfPath) await deletePDFFile(slide.content?.pdfPath)
    uploadPDFMutation.mutate(file, {
      onSuccess: (res) => {
        updateSlide({
          ...slide,
          content: {
            pdfPath: res.data?.path,
          },
        })
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
      {!isEditMode || file ? (
        <div>
          {downloadPDFMutation.isPending && !file ? (
            <div className="mt-12 flex justify-center items-center flex-col">
              <Loading />
              <div>Loading the PDF...</div>
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
                  <Button size="sm" onClick={saveDefaultPageNumber}>
                    Save
                  </Button>
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
      ) : (
        <div className="h-96 flex flex-col justify-center items-center">
          <Text className="mb-4">Select the PDF file.</Text>
          <FilePicker
            hideClearButton
            placeholder="Select"
            onFileChange={(files) => {
              if (files?.[0]) uploadAndSetFile(files[0])
            }}
          />
        </div>
      )}
    </div>
  )
}
