/* eslint-disable no-case-declarations */
import { RefObject, useEffect, useState } from 'react'

import { useMutation } from '@tanstack/react-query'

import { downloadPDFFile } from '@/services/pdf.service'
import { getFileObjectFromBlob } from '@/utils/utils'

export type IPdfViewChangeEvent = {
  action: string
  value?: string | number
}

export type PdfDocumentLoadEvent = {
  numPages: number
}

export interface IPdfView {
  fitType?: string
  scale?: number | undefined
  rotate?: number | undefined
}

export enum PdfView {
  FIT_TO_PAGE = 'fit-to-page',
  FULL_PAGE = 'full-page',
}

interface IDisplay {
  fitType?: string
  scale?: number | undefined
  rotate?: number | undefined
  width?: number | undefined
  height?: number | undefined
}

const getNextRotate = (rotate: number | undefined) => {
  switch (rotate) {
    case undefined:
      return -90
    case -90:
      return -180
    case -180:
      return 90
    case 90:
      return 0
    case 0:
      return -90
    default:
      return -90
  }
}

const getFitToPage = (
  landscape: boolean,
  display: IDisplay,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  container: any
) => {
  if (!landscape) {
    return {
      ...display,
      width: undefined,
      scale: undefined,
      height: container.clientHeight,
      fitType: PdfView.FIT_TO_PAGE,
    }
  }
  const requiredWidth = (container.clientHeight * 16) / 9
  const canFit = container.clientWidth >= requiredWidth

  if (canFit) {
    return {
      ...display,
      width: undefined,
      height: container.clientHeight,
      scale: undefined,
      fitType: PdfView.FIT_TO_PAGE,
    }
  }

  return {
    ...display,
    width: container.clientWidth,
    height: undefined,
    scale: undefined,
    fitType: PdfView.FIT_TO_PAGE,
  }
}

export function usePdfControls(
  pdfPath: string,
  containerRef: RefObject<HTMLElement>,
  initialDisplay: IPdfView,
  initialPage?: number,
  autoScroll?: boolean
) {
  const [totalPages, setTotalPages] = useState<null | number>(null)
  const [pdf, setPdfFile] = useState<File | null>()
  const [selectedPage, setSelectedPage] = useState<number>(initialPage || 1)
  const [isLandscape, setIsLandscape] = useState(false)

  const [display, setDisplay] = useState<IDisplay>(
    initialDisplay ? { ...initialDisplay } : { fitType: PdfView.FIT_TO_PAGE }
  )

  const downloadPDFMutation = useMutation({
    mutationFn: () =>
      downloadPDFFile(pdfPath).then((data) =>
        getFileObjectFromBlob(pdfPath, data.data, 'application/pdf')
      ),
    onSuccess: (_file) => setPdfFile(_file),
  })

  useEffect(() => {
    downloadPDFMutation.mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfPath])

  const handlePageChange = (pageNumber: number) => {
    setSelectedPage(
      pageNumber <= (totalPages || 1) ? pageNumber : totalPages || 1
    )

    if (!autoScroll) return

    scrollToElementByClass(pageNumber)
  }

  const onDocumentLoadSuccess = ({ numPages }: PdfDocumentLoadEvent) => {
    setTotalPages(numPages)
  }

  const downloadPDF = () => {
    if (pdf) {
      const url = URL.createObjectURL(pdf)
      const link = document.createElement('a')
      link.href = url
      link.download = 'sample.pdf'
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  const scrollToElementByClass = (pageNumber: number) => {
    if (!autoScroll) return

    if (containerRef.current) {
      // Assuming each page has a unique class based on the page number
      const targetClass = `page-${pageNumber}` // Update this if you have a different class naming convention

      // Find the target element by class within the container
      const targetElement = containerRef.current.querySelector(
        `.${targetClass}`
      )

      if (targetElement) {
        // Scroll the container to make the target element visible
        targetElement.scrollIntoView({
          behavior: 'instant',
          block: 'start',
        })
      }
    }
  }

  const handleDisplayChange = (newDisplay: IPdfViewChangeEvent) => {
    if (!containerRef.current) return

    let updatedDisplay = { ...display }

    switch (newDisplay.action) {
      case 'zoom-out':
        const previousScale = display.fitType === PdfView.FULL_PAGE ? 1 : 0.5

        const zoomedOutScale = display.scale
          ? Math.max(display.scale - 0.15, 0.3)
          : Math.max(previousScale - 0.15, 0.3)

        updatedDisplay = {
          ...newDisplay,
          fitType: undefined,
          scale: zoomedOutScale,
          width: containerRef.current.clientWidth * zoomedOutScale,
          height: undefined,
        }

        break

      case 'zoom-in':
        if (display.fitType === PdfView.FULL_PAGE) break

        const zoomedInScale = display.scale
          ? Math.min(display.scale + 0.15, 1)
          : 0.7

        updatedDisplay = {
          ...newDisplay,
          scale: zoomedInScale,
          width: containerRef.current.clientWidth * zoomedInScale,
          height: undefined,
          fitType: undefined,
        }
        break

      case PdfView.FIT_TO_PAGE:
        updatedDisplay = getFitToPage(
          isLandscape,
          display,
          containerRef.current
        )
        break

      case PdfView.FULL_PAGE:
        updatedDisplay = {
          ...display,
          width: containerRef.current.clientWidth,
          height: undefined,
          scale: undefined,
          fitType: PdfView.FULL_PAGE,
        }

        break
      case 'rotate':
        updatedDisplay = {
          ...display,
          rotate: getNextRotate(display.rotate),
        }

        break

      default:
        console.log('action-not-found')
    }

    setDisplay(updatedDisplay)

    // eslint-disable-next-line consistent-return
    return {
      fitType: updatedDisplay.fitType,
      scale: updatedDisplay.scale,
      rotate: updatedDisplay.rotate,
    }
  }
  const loadInitialDisplay = (landscape: boolean) => {
    if (display.width || display.height) return

    if (!containerRef.current) return

    const makePageFitToWidth = initialDisplay?.fitType === PdfView.FULL_PAGE

    const makePageFitToHeight =
      !initialDisplay ||
      initialDisplay?.fitType === PdfView.FIT_TO_PAGE ||
      Object.keys(initialDisplay).length === 0

    if (makePageFitToWidth) {
      setDisplay({
        ...display,
        width: containerRef.current.clientWidth,
        height: undefined,
        rotate: initialDisplay?.rotate,
      })

      return
    }

    if (makePageFitToHeight) {
      setDisplay(getFitToPage(landscape, display, containerRef.current))

      return
    }

    if (initialDisplay.scale) {
      setDisplay({
        ...display,
        width: containerRef.current.clientWidth * initialDisplay.scale,
        height: undefined,
        rotate: initialDisplay?.rotate,
      })
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fitPageToContainer = (page: any) => {
    const viewport = page.getViewport({ scale: 1 })

    const landscape = viewport.width > viewport.height

    if (landscape) {
      setIsLandscape(true)
    }

    loadInitialDisplay(landscape)

    scrollToElementByClass(initialPage || 1)
  }

  return {
    pdf,
    isPending: downloadPDFMutation.isPending,
    isError: downloadPDFMutation.isError,
    display,
    selectedPage,
    isLandscape,
    totalPages,
    fitPageToContainer,
    handleDisplayChange,
    handlePageChange,
    onDocumentLoadSuccess,
    downloadPDF,
    setSelectedPage,
    scrollToElementByClass,
  }
}
