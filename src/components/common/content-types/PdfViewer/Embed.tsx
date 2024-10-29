import { useEffect, useState } from 'react'

import { Skeleton } from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import { pdfjs, Document, Page } from 'react-pdf'

import { LoadError } from './LoadError'
import { PageControls } from '../../PageControls'

import { ContentLoading } from '@/components/common/ContentLoading'
import { Loading } from '@/components/common/Loading'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { downloadPDFFile } from '@/services/pdf.service'
import { PdfFrame } from '@/types/frame-picker.type'
import { getLastVisitedPage, updateLastVisitedPage } from '@/utils/pdf.utils'
import { cn, getFileObjectFromBlob } from '@/utils/utils'

type EmbedProps = {
  frame: PdfFrame
  hideControls?: boolean
}

pdfjs.GlobalWorkerOptions.workerSrc = '/scripts/pdf.worker.min.mjs'

export function Embed({ frame, hideControls }: EmbedProps) {
  const [pageView, setPageView] = useState({ isPortrait: false, maxWidth: 100 })
  const [totalPages, setTotalPages] = useState<null | number>(null)
  const [selectedPage, setSelectedPage] = useState<number>(
    frame.content?.defaultPage || getLastVisitedPage(frame.id)
  )

  const [file, setFile] = useState<File | undefined>()
  const { permissions } = useEventPermissions()

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
    if (frame.content?.defaultPage) {
      setSelectedPage(frame.content?.defaultPage)
    }
  }, [frame.content?.defaultPage])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDocumentLoadSuccess: any = ({ numPages: nextNumPages }: any) => {
    setTotalPages(nextNumPages)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onLoadSuccess = (page: any) => {
    const isPortraitPage = page.width < page.height
    setPageView({
      isPortrait: isPortraitPage,
      maxWidth: page.width,
    })
  }
  if (downloadPDFMutation.isError) {
    return <LoadError invalidUrl canUpdateFrame={permissions.canUpdateFrame} />
  }

  if (!downloadPDFMutation.isSuccess) {
    return <Skeleton className="w-full h-full rounded-md" />
  }

  return (
    <div
      className={cn('relative flex justify-start items-start gap-4 h-full', {
        'w-[60%]': pageView.isPortrait && frame.config.landcapeView,
        'mx-auto': pageView.isPortrait && !frame.config.landcapeView,
        'w-full': !pageView.isPortrait,
      })}
      style={{
        maxWidth:
          pageView.isPortrait && !frame.config.landcapeView
            ? pageView.maxWidth
            : '',
      }}>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        className={cn('relative h-full ml-0 overflow-y-auto scrollbar-thin', {
          'w-full': frame.config.landcapeView,
          'aspect-video': !pageView.isPortrait,
        })}
        loading={
          <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center">
            <Loading />
          </div>
        }>
        <Page
          loading={<ContentLoading />}
          pageNumber={selectedPage}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          className="w-full"
          devicePixelRatio={
            (!pageView.isPortrait || frame.config.landcapeView ? 2.6 : 1) *
            window.devicePixelRatio
          }
          onLoadSuccess={onLoadSuccess}
        />
      </Document>
      {!hideControls && (
        <PageControls
          currentPage={selectedPage}
          totalPages={totalPages}
          handleCurrentPageChange={(page: number) => {
            setSelectedPage(page <= (totalPages || 1) ? page : totalPages || 1)
            updateLastVisitedPage(frame.id, page)
          }}
        />
      )}
    </div>
  )
}
