import { pdfjs, Document, Page } from 'react-pdf'

import { PdfDocumentLoadEvent } from '@/hooks/usePdfControls'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { cn } from '@/utils/utils'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
}

type PDFFile = File

export function PdfPage({
  file,
  pageNumber = 1,
  fitDimensions = { width: 800 },
  autoScroll = false,
  totalPages = 1,
  onDocumentLoadSuccess,
  onPageLoadSuccess,
}: {
  file: PDFFile
  pageNumber: number
  fitDimensions:
    | { width?: number; height?: number; rotate?: number }
    | undefined
  autoScroll?: boolean
  totalPages?: number | null
  onDocumentLoadSuccess: (data: PdfDocumentLoadEvent) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPageLoadSuccess: (page: any) => void
}) {
  const pagesToRender = autoScroll ? totalPages : 1

  return (
    <Document
      file={file}
      onLoadSuccess={onDocumentLoadSuccess}
      options={options}
      rotate={fitDimensions.rotate}
      className="text-center">
      {Array(pagesToRender)
        .fill(0)
        .map((_, index) => (
          <Page
            pageNumber={autoScroll ? index + 1 : pageNumber}
            onLoadSuccess={onPageLoadSuccess}
            width={fitDimensions.width}
            height={fitDimensions.height}
            className={cn('w-fit mx-auto', `page-${index + 1}`, {
              'mb-2': autoScroll,
            })}
          />
        ))}
    </Document>
  )
}
