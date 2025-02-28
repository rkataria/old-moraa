import { useRef } from 'react'

import { Skeleton } from '@heroui/react'
import { useHotkeys } from 'react-hotkeys-hook'

import { LoadError } from './LoadError'
import { PdfPage } from './PageViewer'
import { PdfControls } from './PdfControls'
import { RenderIf } from '../../RenderIf/RenderIf'

import { useEventPermissions } from '@/hooks/useEventPermissions'
import { IPdfViewChangeEvent, usePdfControls } from '@/hooks/usePdfControls'
import { useStoreSelector } from '@/hooks/useRedux'
import { useUserPreferences } from '@/hooks/userPreferences'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { PdfFrame } from '@/types/frame-picker.type'
import { cn, copyToClipboard } from '@/utils/utils'

type EmbedProps = {
  frame: PdfFrame
  hideControls?: boolean
}

export function Embed({ frame, hideControls }: EmbedProps) {
  const currentFrame = useCurrentFrame()
  const { permissions } = useEventPermissions()
  const { userPreferences, userPreferencesPdf } = useUserPreferences()
  const resizableRightSidebarVisible = useStoreSelector(
    (state) => state.layout.studio.contentStudioRightResizableSidebar
  )

  const containerRef = useRef<HTMLDivElement>(null)

  const initialDisplayConfig = hideControls
    ? {}
    : userPreferences?.pdf?.[frame.id]?.config || {}

  const initialPage = hideControls
    ? 1
    : userPreferences?.pdf?.[frame.id]?.position || 1

  const {
    pdf,
    isPending,
    isError,
    display,
    selectedPage,
    totalPages,
    fitPageToContainer,
    handleDisplayChange,
    handlePageChange,
    onDocumentLoadSuccess,
    downloadPDF,
  } = usePdfControls(
    frame.content?.pdfPath,
    containerRef,
    initialDisplayConfig,
    initialPage,
    frame.config.allowedAutoScroll
  )

  useHotkeys('c', () => copyToClipboard(containerRef), {
    enabled: !hideControls,
  })

  const updateStoreOnDisplayChange = (newDisplay: IPdfViewChangeEvent) => {
    const updatedConfig = handleDisplayChange(newDisplay)
    userPreferencesPdf({
      frameId: frame.id,
      data: {
        config: updatedConfig,
      },
    })
  }

  const updateStoreOnPageChange = (page: number) => {
    handlePageChange(page)
    userPreferencesPdf({
      frameId: frame.id,
      data: {
        position: page,
      },
    })
  }

  if (isError) {
    return <LoadError invalidUrl canUpdateFrame={permissions.canUpdateFrame} />
  }

  if (isPending || !pdf) {
    return <Skeleton className="w-full h-full rounded-md" />
  }

  return (
    <div
      style={{
        maxWidth: resizableRightSidebarVisible && !hideControls ? '40vw' : '',
      }}
      className={cn('relative h-full overflow-hidden', {
        'pt-12': !hideControls,
      })}>
      <div
        className="overflow-y-auto h-full scrollbar-none border border-gray-200 bg-[#FEFEFE] rounded-md"
        ref={containerRef}>
        <PdfPage
          file={pdf}
          pageNumber={selectedPage}
          onDocumentLoadSuccess={onDocumentLoadSuccess}
          onPageLoadSuccess={fitPageToContainer}
          fitDimensions={display}
          autoScroll={
            frame.config.allowedAutoScroll &&
            !hideControls &&
            currentFrame?.id === frame.id
          }
          totalPages={totalPages}
          maxWidth={containerRef.current?.clientWidth}
        />

        <RenderIf isTrue={!hideControls}>
          <PdfControls
            config={display}
            totalPages={totalPages}
            currentPage={selectedPage}
            onDisplayChange={updateStoreOnDisplayChange}
            downloadPdf={downloadPDF}
            handleCurrentPageChange={updateStoreOnPageChange}
          />
        </RenderIf>
      </div>
    </div>
  )
}
