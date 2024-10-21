import { RefObject, useState } from 'react'

export function usePDFZoomControls(
  containerRef: RefObject<HTMLElement>,
  defaultScale: number
) {
  const [pageScale, setPageScale] = useState(defaultScale || 0.5) // Manage the zoom scale
  const [pdfPageWidth, setPdfPageWidth] = useState(0) // Actual page width
  const [isLandscape, setIsLandscape] = useState(false) // Actual page width

  const handleZoomIn = () => {
    const updatedScale = Math.min(pageScale + 0.15, 1)
    setPageScale(updatedScale) // Max zoom scale: 3x (300%)

    return updatedScale
  }

  const handleZoomOut = () => {
    const updatedScale = Math.max(pageScale - 0.15, 0.3)
    setPageScale(updatedScale) // Min zoom scale: 0.25x (25%)

    return updatedScale
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fitPageToContainer = (page: any) => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth

      const viewport = page.getViewport({ scale: 1 })
      const scale = containerWidth / viewport.width // Scale based on container width
      // const scaleH = containerHeght / viewport.height // Scale based on container width
      // const pageHeight = viewport.height * scaleH

      // console.log(page.width / page.height)
      // console.log((containerWidth / containerHeght) * viewport.height)
      // console.log(
      //   'viewport.width * scale',
      //   containerWidth,
      //   '//',
      //   viewport.width * scale
      // )
      // console.log('containerHeight', containerHeght)
      // console.log('pageHeight', pageHeight)

      setPdfPageWidth((viewport.width * scale) / devicePixelRatio) // Set width to container width

      if (viewport.width > viewport.height) {
        setPageScale(1)
        setIsLandscape(true)
      }
    }
  }

  return {
    pageScale,
    pdfPageWidth,
    isLandscape,
    handleZoomIn,
    handleZoomOut,
    setPdfPageWidth,
    setPageScale,
    fitPageToContainer,
  }
}
