/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useEffect, useState } from 'react'

import { Skeleton } from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import { AiOutlineExclamationCircle } from 'react-icons/ai'
import { pdfjs, Document, Page, Thumbnail } from 'react-pdf'

import { ContentLoading } from '../ContentLoading'
import { EmptyPlaceholder } from '../EmptyPlaceholder'
import { Loading } from '../Loading'
import { RenderIf } from '../RenderIf/RenderIf'

import { PageControls } from '@/components/common/PageControls'
import { usePDFZoomControls } from '@/hooks/usePDFZoomControls'
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
  const [pageView, setPageView] = useState({ isPortrait: false, maxWidth: 100 })
  const [file, setFile] = useState<File | undefined>()
  const [totalPages, setTotalPages] = useState<number>(0)
  const [position, setPosition] = useState<number>(
    asThumbnail
      ? 1
      : frame.content?.defaultPage || getLastVisitedPage(frame.id).position || 1
  )
  const containerRef = React.useRef(null)
  const canvasRef = React.useRef(null)

  const {
    handleZoomIn,
    handleZoomOut,
    pageScale,
    isLandscape,
    pdfPageWidth,
    fitPageToContainer,
  } = usePDFZoomControls(containerRef, getLastVisitedPage(frame.id).pageScale)
  const [pageWidth, setPageWidth] = React.useState(null)
  const [pageHeight, setPageHeight] = React.useState(null)

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

  const handleScaleChange = (zoomType: string) => {
    let newScale
    if (zoomType === 'zoomIn') {
      newScale = handleZoomIn()
    } else {
      newScale = handleZoomOut()
    }

    updateLastVisitedPage(frame.id, {
      pageScale: newScale,
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDocumentLoadSuccess: any = ({ numPages: nextNumPages }: any) => {
    setTotalPages(nextNumPages)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const onLoadSuccess = (page: any) => {
  //   const isPortraitPage = page.width < page.height

  //   setPageView({
  //     isPortrait: isPortraitPage,
  //     maxWidth: page.width,
  //   })

  //   const aspectRatio = page.view[2] / page.view[3] // width / height
  //   setPageWidth(containerRef.current.clientWidth)
  //   setPageHeight(containerRef.current.clientWidth / aspectRatio)
  // }

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
      id="container"
      className={cn(
        'flex justify-start items-start gap-4 h-full mx-auto w-full',
        {
          'w-auto aspect-video h-auto max-h-full': isLandscape,
          'justify-center': !isLandscape,
        }
      )}>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        className={cn('relative h-full ml-0 overflow-y-auto scrollbar-none', {
          'w-fit h-[inherit]': isLandscape,
        })}
        loading={
          <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center">
            <Loading />
          </div>
        }>
        <RenderIf isTrue={asThumbnail}>
          <Thumbnail pageNumber={1} />
        </RenderIf>
        <RenderIf isTrue={!asThumbnail}>
          <Page
            renderAnnotationLayer={false}
            renderTextLayer={false}
            pageNumber={position}
            width={pdfPageWidth * pageScale * devicePixelRatio} // Apply zoom scaling and DPR
            onLoadSuccess={fitPageToContainer} // Fit page initially when loaded
            loading={<ContentLoading />}
          />
        </RenderIf>
      </Document>
      <PageControls
        scale={pageScale}
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
  )
}
