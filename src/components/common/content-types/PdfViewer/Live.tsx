import { useEffect, useRef } from 'react'

import { Skeleton } from '@nextui-org/react'
import { AiOutlineExclamationCircle } from 'react-icons/ai'

import { PdfPage } from './PageViewer'
import { PdfControls } from './PdfControls'

import { EmptyPlaceholder } from '@/components/common/EmptyPlaceholder'
import { useEventSession } from '@/contexts/EventSessionContext'
import { IPdfViewChangeEvent, usePdfControls } from '@/hooks/usePdfControls'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { updateMeetingSessionDataAction } from '@/stores/slices/event/current-event/live-session.slice'
import { PdfFrame } from '@/types/frame-picker.type'

interface LiveProps {
  frame: PdfFrame
}

export function Live({ frame }: LiveProps) {
  const dispatch = useStoreDispatch()
  const { isHost } = useEventSession()
  const sessionPersistedFramesConfig = useStoreSelector(
    (store) => store.event.currentEvent.liveSessionState.activeSession.data
  )?.data?.framesConfig

  const currentPage = sessionPersistedFramesConfig?.[frame.id]?.position || 1

  const containerRef = useRef<HTMLDivElement>(null)

  const initialDisplayConfig = isHost
    ? sessionPersistedFramesConfig?.[frame.id]?.config
    : undefined

  const {
    pdf,
    isPending,
    isError,
    display,
    totalPages,
    fitPageToContainer,
    handleDisplayChange,
    onDocumentLoadSuccess,
    downloadPDF,
    scrollToElementByClass,
  } = usePdfControls(
    frame.content?.pdfPath,
    containerRef,
    initialDisplayConfig,
    currentPage,
    frame.config.allowedAutoScroll
  )

  useEffect(() => {
    if (!frame.config.allowedAutoScroll) return
    scrollToElementByClass(currentPage)
  }, [currentPage, frame.config.allowedAutoScroll, scrollToElementByClass])

  const updateSessionOnPageChange = (newPosition: number) => {
    dispatch(
      updateMeetingSessionDataAction({
        framesConfig: {
          ...sessionPersistedFramesConfig,
          [frame.id]: {
            ...sessionPersistedFramesConfig?.[frame.id],
            position: newPosition,
          },
        },
      })
    )
  }

  const updateSessionOnDisplayChange = (newDisplay: IPdfViewChangeEvent) => {
    const updatedConfig = handleDisplayChange(newDisplay)
    dispatch(
      updateMeetingSessionDataAction({
        framesConfig: {
          ...sessionPersistedFramesConfig,
          [frame.id]: {
            ...sessionPersistedFramesConfig?.[frame.id],
            config: updatedConfig,
          },
        },
      })
    )
  }

  if (isError) {
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

  if (isPending || !pdf) {
    return <Skeleton className="w-full h-full rounded-md" />
  }

  return (
    <div className="relative h-full overflow-hidden pt-12">
      <div className="overflow-y-auto h-full scrollbar-none" ref={containerRef}>
        <PdfPage
          file={pdf}
          pageNumber={currentPage}
          onDocumentLoadSuccess={onDocumentLoadSuccess}
          onPageLoadSuccess={fitPageToContainer}
          fitDimensions={display}
          autoScroll={frame.config.allowedAutoScroll}
          totalPages={totalPages}
        />
      </div>

      <PdfControls
        config={display}
        onDisplayChange={updateSessionOnDisplayChange}
        downloadPdf={downloadPDF}
        currentPage={currentPage}
        totalPages={totalPages}
        handleCurrentPageChange={updateSessionOnPageChange}
        hideControls={!isHost}
      />
    </div>
  )
}
