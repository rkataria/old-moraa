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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PdfPage({
  file,
  pageNumber = 1,
  fitDimensions = { width: 800 },
  onDocumentLoadSuccess,
  onPageLoadSucccess,
}: {
  file: PDFFile
  pageNumber: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fitDimensions: any
  onDocumentLoadSuccess: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPageLoadSucccess: (page: any) => void
}) {
  return (
    <Document
      file={file}
      onLoadSuccess={onDocumentLoadSuccess}
      options={options}>
      <Page
        pageNumber={pageNumber}
        onLoadSuccess={onPageLoadSucccess}
        width={!fitDimensions.height ? fitDimensions.width : undefined}
        height={fitDimensions.height}
      />
    </Document>
  )
}
