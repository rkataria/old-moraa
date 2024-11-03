import { RefObject, useState } from 'react'

import { IPdfZoom } from '@/types/frame.type'
import { PdfView } from '@/utils/pdf.utils'

export function usePdfControls(
  containerRef: RefObject<HTMLElement>,
  initalZoom: IPdfZoom
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fitDimensions, setFitDimensions] = useState<any>()

  const [isLandscape, setIsLandscape] = useState(false)

  const [zoomType, setZoomType] = useState(
    initalZoom || { type: PdfView.FIT_TO_PAGE, scale: undefined }
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleScaleChange = (zoom: { type: string; scale: any }) => {
    let updatedZoom = { ...zoomType }

    if (!containerRef.current) return

    if (zoom.type === PdfView.FIT_TO_PAGE) {
      setFitDimensions({
        width: undefined,
        height: containerRef.current.clientHeight,
      })
      updatedZoom = zoom
    }

    if (zoom.type === PdfView.FULL_PAGE) {
      setFitDimensions({
        width: containerRef.current.clientWidth,
        height: undefined,
      })

      updatedZoom = zoom
    }

    if (zoom.type === 'zoom-in') {
      const updatedScale = zoom.scale ? Math.min(zoom.scale + 0.15, 1) : 0.6
      updatedZoom = {
        ...zoom,
        scale: updatedScale,
      }

      setFitDimensions({
        width: containerRef.current.clientWidth * updatedScale,
        height: undefined,
      })
    }

    if (zoom.type === 'zoom-out') {
      const updatedScale = zoom.scale ? Math.max(zoom.scale - 0.15, 0.3) : 0.4
      updatedZoom = {
        ...zoom,
        scale: updatedScale,
      }

      setFitDimensions({
        width: containerRef.current.clientWidth * updatedScale,
        height: undefined,
      })
    }

    setZoomType(updatedZoom)

    // eslint-disable-next-line consistent-return
    return updatedZoom
  }

  const loadInitalZoom = (landscape: boolean) => {
    if (fitDimensions) return
    if (!containerRef.current) return

    const makePageFitToWidth =
      landscape || initalZoom?.type === PdfView.FULL_PAGE
    const makePageFitToHeight =
      !initalZoom || initalZoom?.type === PdfView.FIT_TO_PAGE

    if (makePageFitToWidth) {
      setFitDimensions({
        width: containerRef.current.clientWidth,
        height: undefined,
      })

      return
    }

    if (makePageFitToHeight) {
      setFitDimensions({
        width: undefined,
        height: containerRef.current.clientHeight,
      })

      return
    }

    if (initalZoom.scale) {
      setFitDimensions({
        width: containerRef.current.clientWidth * initalZoom.scale,
        height: undefined,
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

    loadInitalZoom(landscape)
  }

  return {
    zoomType,
    isLandscape,
    fitDimensions,
    setZoomType,
    fitPageToContainer,
    handleScaleChange,
  }
}
