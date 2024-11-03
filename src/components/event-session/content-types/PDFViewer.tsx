import { useContext, useEffect, useRef, useState } from 'react'

import { Skeleton } from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { AiOutlineExclamationCircle } from 'react-icons/ai'
import { pdfjs } from 'react-pdf'

import { PdfPage } from '@/components/common/content-types/PageRenderer'
import { EmptyPlaceholder } from '@/components/common/EmptyPlaceholder'
import { PageControls } from '@/components/common/PageControls'
import { EventContext } from '@/contexts/EventContext'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { usePdfControls } from '@/hooks/usePdfControls'
import { downloadPDFFile } from '@/services/pdf.service'
import { EventContextType } from '@/types/event-context.type'
import { EventSessionContextType } from '@/types/event-session.type'
import { IFrame, IPdfZoom } from '@/types/frame.type'
import { getFileObjectFromBlob } from '@/utils/utils'

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
  const [file, setFile] = useState<string | File | null>(null)
  const { preview } = useContext(EventContext) as EventContextType
  const { isHost, realtimeChannel, activeSession, updateActiveSession } =
    useContext(EventSessionContext) as EventSessionContextType
  const [totalPages, setTotalPages] = useState<number>(0)
  const [position, setPosition] = useState<number>(
    frame.content?.defaultPage || 1
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerRef = useRef<any>()

  const initialZoom = isHost
    ? activeSession?.pdfPages?.[frame.id]?.zoom
    : undefined

  const {
    zoomType,
    fitDimensions,
    isLandscape,
    fitPageToContainer,
    handleScaleChange,
  } = usePdfControls(containerRef, initialZoom)

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
        if (payload.position) {
          setPosition(payload.position)
        }
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
        pdfPages: {
          ...activeSession.pdfPages,
          [frame.id]: {
            position: newPosition,
            zoom: zoomType,
          },
        },
      },
    })
  }

  const onChangeScale = (zoom: IPdfZoom) => {
    const updatedZoom = handleScaleChange(zoom)
    updateActiveSession({
      pdfPages: {
        ...activeSession.pdfPages,
        [frame.id]: {
          position,
          zoom: updatedZoom,
        },
      },
    })
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
    <div className="relative h-full overflow-hidden" ref={containerRef}>
      {position}
      <div className="overflow-y-auto h-full scrollbar-none">
        <PdfPage
          file={file}
          pageNumber={position}
          onDocumentLoadSuccess={onDocumentLoadSuccess}
          onPageLoadSuccess={fitPageToContainer}
          fitDimensions={fitDimensions}
        />
        <PageControls
          zoom={zoomType}
          currentPage={position}
          totalPages={totalPages}
          shouldRenderZoomControls={!isLandscape}
          handleCurrentPageChange={(page) => {
            handlePositionChange(page <= totalPages ? page : totalPages)
          }}
          handleScaleChange={onChangeScale}
        />
      </div>
    </div>
  )
}
