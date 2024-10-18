import { useEffect, useRef, useState } from 'react'

import { Skeleton } from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import { AiOutlineExclamationCircle } from 'react-icons/ai'
import { pdfjs, Document, Page } from 'react-pdf'

import { ContentLoading } from '../ContentLoading'
import { EmptyPlaceholder } from '../EmptyPlaceholder'
import { Loading } from '../Loading'

import { PageControls } from '@/components/common/PageControls'
import { downloadPDFFile } from '@/services/pdf.service'
import { IFrame } from '@/types/frame.type'
import { getLastVisitedPage, updateLastVisitedPage } from '@/utils/pdf.utils'
import { cn, getFileObjectFromBlob } from '@/utils/utils'

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

pdfjs.GlobalWorkerOptions.workerSrc = '/scripts/pdf.worker.min.mjs'

export function PDFViewer({ frame, asThumbnail = false }: PDFViewerProps) {
  const [pageView, setPageView] = useState({ isLandscape: false, ratio: 1 })
  const [file, setFile] = useState<File | undefined>()
  const [totalPages, setTotalPages] = useState<number>(0)
  const [position, setPosition] = useState<number>(
    asThumbnail ? 1 : frame.content?.defaultPage || getLastVisitedPage(frame.id)
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerRef = useRef<any>()

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

  return (
    <div
      ref={containerRef}
      style={{
        maxWidth:
          !frame.config.landcapeView && containerRef?.current?.height
            ? pageView.ratio * containerRef.current.height
            : '',
      }}
      className={cn('flex justify-start items-start gap-4 h-full', {
        'w-full': pageView.isLandscape,
        'w-[70%]': frame.config.landcapeView,
        'mx-auto max-w-fit': !frame.config.landcapeView,
      })}>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        className={cn(
          'relative h-full ml-0 overflow-y-auto scrollbar-none',

          {
            'w-full': frame.config.landcapeView,
          }
        )}
        loading={
          <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center">
            <Loading />
          </div>
        }>
        <Page
          loading={<ContentLoading />}
          pageNumber={position}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          className="w-full"
          // devicePixelRatio={5}
          devicePixelRatio={
            (pageView.isLandscape || frame.config.landcapeView ? 2.6 : 1) *
            window.devicePixelRatio
          }
          onLoadSuccess={(page) => {
            setPageView({
              isLandscape: page.width > page.height,
              ratio: page.width / page.height,
            })
          }}
        />
      </Document>
      <PageControls
        currentPage={position}
        totalPages={totalPages}
        handleCurrentPageChange={(page) => {
          handlePositionChange(page <= totalPages ? page : totalPages)
          updateLastVisitedPage(frame.id, page)
        }}
      />
    </div>
  )
}
