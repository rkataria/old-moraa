import { pdfjs, Document, Page } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
}

type PDFFile = string | File | null

export function PdfPage({
  file,
  pageNumber = 1,
  fitDimensions = { width: 800 },
  onDocumentLoadSuccess,
  onPageLoadSuccess,
}: {
  file: PDFFile
  pageNumber: number
  fitDimensions: { width?: number; height?: number }
  onDocumentLoadSuccess: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPageLoadSuccess: (page: any) => void
}) {
  return (
    <Document
      file={file}
      onLoadSuccess={onDocumentLoadSuccess}
      options={options}>
      <Page
        pageNumber={pageNumber}
        onLoadSuccess={onPageLoadSuccess}
        width={fitDimensions.width}
        height={fitDimensions.height}
      />
    </Document>
  )
}
