import { useContext, useEffect, useState } from 'react'

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
  const [pageView, setPageView] = useState({ isLandscape: false, ratio: 1 })

  const [file, setFile] = useState<File | undefined>()
  const { preview } = useContext(EventContext) as EventContextType
  const { isHost, realtimeChannel, activeSession, updateActiveSession } =
    useContext(EventSessionContext) as EventSessionContextType
  const [totalPages, setTotalPages] = useState<number>(0)
  const [position, setPosition] = useState<number>(
    frame.content?.defaultPage || 1
  )

  const [updatePdfPayload, setUpdatePdfPayload] = useState(null)

  const debouncedPayload = useDebounce(updatePdfPayload, 200)

  useEffect(() => {
    if (!activeSession?.pdfPages?.[frame.id]) return

    setPosition(activeSession?.pdfPages[frame.id])
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
          [frame.id]: newPosition || 1,
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
    <div
      style={{ maxWidth: pageView.ratio * window.innerHeight - 57 }}
      className={cn('flex justify-start items-start gap-4 h-full mx-auto', {
        'w-full': pageView.isLandscape,
      })}>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        className={cn('relative h-full ml-0 overflow-y-auto scrollbar-thin')}
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
            (pageView.isLandscape ? 2.5 : 1) * window.devicePixelRatio
          }
          onLoadSuccess={(page) => {
            setPageView({
              isLandscape: page.width > page.height,
              ratio: page.width / page.height,
            })
          }}
        />
      </Document>
      {isHost && (
        <PageControls
          currentPage={position}
          totalPages={totalPages}
          handleCurrentPageChange={handlePositionChange}
        />
      )}
    </div>
  )
}
