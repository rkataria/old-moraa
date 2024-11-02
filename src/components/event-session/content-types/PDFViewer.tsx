import { useContext, useEffect, useRef, useState } from 'react'

import { Skeleton } from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { AiOutlineExclamationCircle } from 'react-icons/ai'
import { pdfjs, Document, Page } from 'react-pdf'

import { ContentLoading } from '@/components/common/ContentLoading'
import { EmptyPlaceholder } from '@/components/common/EmptyPlaceholder'
import { Loading } from '@/components/common/Loading'
import { PageControls } from '@/components/common/PageControls'
import { EventContext } from '@/contexts/EventContext'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { usePDFZoomControls } from '@/hooks/usePdfControls'
import { downloadPDFFile } from '@/services/pdf.service'
import { EventContextType } from '@/types/event-context.type'
import { EventSessionContextType } from '@/types/event-session.type'
import { IFrame } from '@/types/frame.type'
import { cn, getFileObjectFromBlob } from '@/utils/utils'

interface PDFViewerProps {
  frame: IFrame & {
    content: {
      pdfPath: string
      defaultPage: number
    }
  }
}

pdfjs.GlobalWorkerOptions.workerSrc = '/scripts/pdf.worker.min.mjs'

const positionChangeEvent = 'pdf-position-changed'

export function PDFViewer({ frame }: PDFViewerProps) {
  const [file, setFile] = useState<File | undefined>()
  const { preview } = useContext(EventContext) as EventContextType
  const { isHost, realtimeChannel, activeSession, updateActiveSession } =
    useContext(EventSessionContext) as EventSessionContextType
  const [totalPages, setTotalPages] = useState<number>(0)
  const [position, setPosition] = useState<number>(
    frame.content?.defaultPage || 1
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerRef = useRef<any>()

  const {
    pageScale,
    pdfPageWidth,
    isLandscape,
    handleZoomIn,
    handleZoomOut,
    fitPageToContainer,
  } = usePDFZoomControls(
    containerRef,
    isHost ? activeSession?.pdfPages?.[frame.id]?.scale : undefined
  )

  const [updatePdfPayload, setUpdatePdfPayload] = useState(null)

  const debouncedPayload = useDebounce(updatePdfPayload, 200)

  useEffect(() => {
    if (!activeSession?.pdfPages?.[frame.id]) return

    setPosition(activeSession?.pdfPages[frame.id].position)
  }, [activeSession?.pdfPages, frame.id])

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

  useEffect(() => {
    if (!debouncedPayload) return

    updateActiveSession({
      pdfPages: debouncedPayload,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPayload])

  useEffect(() => {
    if (!realtimeChannel) return
    realtimeChannel.on(
      'broadcast',
      { event: positionChangeEvent },
      ({ payload }) => {
        setPosition(payload.position || 1)
        setUpdatePdfPayload(payload.pdfPages)
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realtimeChannel])

  const handlePositionChange = (newPosition: number) => {
    if (preview) return

    if (newPosition < 1 || newPosition > totalPages) return

    realtimeChannel?.send({
      type: 'broadcast',
      event: positionChangeEvent,
      payload: {
        // position: newPosition,
        pdfPages: {
          ...activeSession.pdfPages,
          [frame.id]: {
            position: newPosition,
            scale: pageScale,
          },
        },
      },
    })
  }

  const handleScaleChange = (zoomType: string) => {
    let newScale
    if (zoomType === 'zoomIn') {
      newScale = handleZoomIn()
    } else {
      newScale = handleZoomOut()
    }

    updateActiveSession({
      pdfPages: {
        ...activeSession.pdfPages,
        [frame.id]: {
          position,
          scale: newScale,
        },
      },
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
  //     maxWidth: page.width + 20,
  //   })
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
      className={cn(
        'flex justify-center items-start h-full w-full mx-auto overflow-y-auto scrollbar-none',
        {
          'w-auto aspect-video h-auto max-h-full': isLandscape,
          'justify-center': !isLandscape,
        }
      )}>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        className={cn('relative h-fit ml-0 overflow-y-auto scrollbar-thin', {
          'w-fit h-[inherit]': isLandscape,
        })}
        loading={
          <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center">
            <Loading />
          </div>
        }>
        <Page
          renderAnnotationLayer={false}
          renderTextLayer={false}
          pageNumber={position}
          width={pdfPageWidth * pageScale * devicePixelRatio} // Apply zoom scaling and DPR
          // height={pdfPageHeight * pageScale * devicePixelRatio} // Optional: ensure height is maintained too
          onLoadSuccess={fitPageToContainer} // Fit page initially when loaded
          loading={<ContentLoading />}
        />
        {/* <Page
          loading={<ContentLoading />}
          pageNumber={position}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          className="w-full"
          // devicePixelRatio={5}
          devicePixelRatio={
            (!pageView.isPortrait || frame.config.landcapeView ? 2.6 : 1) *
            window.devicePixelRatio
          }
          onLoadSuccess={onLoadSuccess}
        /> */}
      </Document>
      <PageControls
        currentPage={position}
        totalPages={totalPages}
        handleCurrentPageChange={handlePositionChange}
        scale={pageScale}
        handleScaleChange={handleScaleChange}
        shouldRenderZoomControls={!isLandscape}
      />
    </div>
  )
}
