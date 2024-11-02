import { useEffect, useRef, useState } from 'react'

import { Skeleton } from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import { AiOutlineExclamationCircle } from 'react-icons/ai'

import { PdfPage } from './PageRenderer'
import { EmptyPlaceholder } from '../EmptyPlaceholder'

import { PageControls } from '@/components/common/PageControls'
import { usePdfControls } from '@/hooks/usePdfControls'
import { downloadPDFFile } from '@/services/pdf.service'
import { IFrame } from '@/types/frame.type'
import { getLastVisitedPage, updateLastVisitedPage } from '@/utils/pdf.utils'
import { getFileObjectFromBlob } from '@/utils/utils'

export type PDFViewerFrameType = IFrame & {
  content: {
    pdfPath: string
    defaultPage: number
  }
}

interface PDFViewerProps {
  frame: PDFViewerFrameType
  asThumbnail?: boolean
}

export function PDFViewer({ frame, asThumbnail = false }: PDFViewerProps) {
  const [file, setFile] = useState<File | undefined>()
  const [totalPages, setTotalPages] = useState<number>(0)

  const [position, setPosition] = useState<number>(
    asThumbnail
      ? 1
      : frame.content?.defaultPage || getLastVisitedPage(frame.id).position || 1
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerRef = useRef<any>(null)

  const {
    zoomType,
    fitDimensions,
    isLandscape,
    fitPageToContainer,
    handleScaleChange,
  } = usePdfControls(containerRef, frame.id)

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDocumentLoadSuccess: any = ({ numPages: nextNumPages }: any) => {
    setTotalPages(nextNumPages)
  }

  if (downloadPDFMutation.isError) {
    return (
      <EmptyPlaceholder
        icon={
          <AiOutlineExclamationCircle className="w-[60px] h-[60px] text-red-500" />
        }
        title="Failed to Load PDF"
        description="We encountered an issue while trying to load the PDF. Please try again..."
      />
    )
  }

  if (!downloadPDFMutation.isSuccess) {
    return <Skeleton className="w-full h-full rounded-md" />
  }

  // return <Sample file={file} />

  if (!file) {
    return <p>Sorry! Unable to load file</p>
  }

  return (
    <div className="relative h-full overflow-hidden" ref={containerRef}>
      <div className="overflow-y-auto h-full scrollbar-none">
        <PdfPage
          file={file}
          pageNumber={position}
          onDocumentLoadSuccess={onDocumentLoadSuccess}
          onPageLoadSucccess={fitPageToContainer}
          fitDimensions={fitDimensions}
        />
        <PageControls
          zoom={zoomType}
          currentPage={position}
          totalPages={totalPages}
          shouldRenderZoomControls={!isLandscape}
          handleCurrentPageChange={(page) => {
            handlePositionChange(page <= totalPages ? page : totalPages)
            updateLastVisitedPage(frame.id, {
              position: page,
            })
          }}
          handleScaleChange={handleScaleChange}
        />
      </div>
    </div>
  )
}
