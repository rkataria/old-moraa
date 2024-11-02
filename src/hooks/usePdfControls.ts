import { RefObject, useState } from 'react'

import { getLastVisitedPage, updateLastVisitedPage } from '@/utils/pdf.utils'

export function usePdfControls(
  containerRef: RefObject<HTMLElement>,
  frameId: string
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fitDimensions, setFitDimensions] = useState<any>()

  const [isLandscape, setIsLandscape] = useState(false)

  const [zoomType, setZoomType] = useState(
    getLastVisitedPage(frameId)?.pageScale || {
      type: 'fit-to-page',
      scale: undefined,
    }
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleScaleChange = (zoom: { type: string; scale: any }) => {
    let updatedZoom = {}
    if (!containerRef.current) return
    if (zoom.type === 'fit-to-page') {
      setFitDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      })
      updatedZoom = zoom
    }
    if (zoom.type === 'full-page') {
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

    updateLastVisitedPage(frameId, {
      pageScale: updatedZoom,
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fitPageToContainer = (page: any) => {
    const viewport = page.getViewport({ scale: 1 })

    if (viewport.width > viewport.height) {
      setIsLandscape(true)
    }
    if (!fitDimensions && containerRef.current) {
      const storedScale = getLastVisitedPage(frameId)?.pageScale
      console.log('storedScale', storedScale)
      if (!storedScale) {
        setFitDimensions({
          width: containerRef?.current?.clientWidth,
          height: containerRef?.current?.clientHeight,
        })

        return
      }
      if (storedScale.type === 'fit-to-page') {
        setFitDimensions({
          width: containerRef?.current?.clientWidth,
          height: containerRef?.current?.clientHeight,
        })

        return
      }
      if (storedScale.type === 'full-page') {
        setFitDimensions({
          width: containerRef?.current?.clientWidth,
          height: undefined,
        })

        return
      }
      setFitDimensions({
        width: containerRef.current.clientWidth * storedScale.scale,
        height: undefined,
      })
    }
    if (
      containerRef?.current?.clientHeight &&
      !fitDimensions?.height &&
      zoomType.type === 'fit-to-page'
    ) {
      setFitDimensions({
        width: containerRef?.current?.clientHeight,
        height: containerRef.current.clientHeight,
      })
    }
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
