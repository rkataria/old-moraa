/* eslint-disable react/no-array-index-key */
import { useEffect, useRef, useState } from 'react'

import { Avatar } from '@heroui/react'
import { createFileRoute } from '@tanstack/react-router'
import ResizeObserver from 'rc-resize-observer'

import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/utils'

export const Route = createFileRoute('/(test)/gallery-grid')({
  component: GalleryGrid,
})

const calculateTileSize = (w: number, h: number) => {
  if (w > h) {
    return {
      width: Math.min(w, (h * 16) / 9),
      height: h,
    }
  }

  return {
    width: w,
    height: Math.max(w, (w * 9) / 16),
  }
}

function calculateGrid(
  tilesCount: number,
  containerWidth: number,
  containerHeight: number
): { rows: number; columns: number } {
  let bestRows = 1
  let bestColumns = tilesCount
  let bestTileSize = 0

  // eslint-disable-next-line no-plusplus
  for (let rows = 1; rows <= tilesCount; rows++) {
    const columns = Math.ceil(tilesCount / rows)

    const tileWidth = containerWidth / columns
    const tileHeight = containerHeight / rows
    const tileSize = Math.min(tileWidth, tileHeight)

    if (tileSize > bestTileSize) {
      bestTileSize = tileSize
      bestRows = rows
      bestColumns = columns
    }
  }

  return { rows: bestRows, columns: bestColumns }
}

function getTilesPositions(
  tilesCount: number,
  containerWidth: number,
  containerHeight: number
) {
  const grid = calculateGrid(tilesCount, containerWidth, containerHeight)
  const tileSize = calculateTileSize(
    containerWidth / grid.columns,
    containerHeight / grid.rows
  )

  const topOffset = (containerHeight - grid.rows * tileSize.height) / 2
  const lastRowLeftOffset =
    ((grid.columns * grid.rows - tilesCount) * tileSize.width) / 2
  const tilesInLastRow = tilesCount % grid.columns
  const isLastRowIncomplete = tilesInLastRow !== 0

  return Array.from({ length: tilesCount }).map((_, index) => {
    const currentRow = Math.floor(index / grid.columns) + 1 // 1-based index
    const isLastRow = currentRow === grid.rows
    const dynamicTileWidth =
      isLastRow && isLastRowIncomplete
        ? tileSize.width + (lastRowLeftOffset * 2) / tilesInLastRow
        : tileSize.width
    const updatedTileSize = calculateTileSize(dynamicTileWidth, tileSize.height)
    const updatedLeftOffset =
      isLastRow && isLastRowIncomplete
        ? (containerWidth - tilesInLastRow * updatedTileSize.width) / 2
        : 0

    const currentRowTileWidth = isLastRow
      ? updatedTileSize.width
      : tileSize.width

    return {
      left: (index % grid.columns) * currentRowTileWidth + updatedLeftOffset,
      top: (currentRow - 1) * tileSize.height + topOffset,
      ...updatedTileSize,
    }
  })
}

export function GalleryGrid() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [tiles, setTiles] = useState(0)
  const [positions, setPositions] = useState<
    ReturnType<typeof getTilesPositions>
  >(
    getTilesPositions(
      tiles,
      containerRef.current?.clientWidth || 0,
      containerRef.current?.clientHeight || 0
    )
  )

  useEffect(() => {
    setPositions(
      getTilesPositions(
        tiles,
        containerRef.current?.clientWidth || 0,
        containerRef.current?.clientHeight || 0
      )
    )
  }, [tiles])

  return (
    <div className="h-full w-full p-2 transition-all">
      <ResizeObserver
        onResize={() => {
          if (!containerRef.current) return

          setPositions(
            getTilesPositions(
              tiles,
              containerRef.current.clientWidth,
              containerRef.current.clientHeight
            )
          )
        }}>
        <div
          ref={containerRef}
          className={cn(
            'relative h-full flex justify-center items-center w-full'
          )}>
          {Array.from({ length: tiles }).map((_, index) => (
            <div
              key={index}
              // animate={{ ...positions[index] }}
              className="absolute flex-none flex justify-center items-center p-1"
              style={positions[index]}>
              <div className="bg-gray-200 border-2 border-gray-300 w-full h-full flex justify-center items-center rounded-md">
                <Avatar size="lg" src="https://i.pravatar.cc/300" />
                <span className="ml-2">Tiles {index + 1}</span>
              </div>
            </div>
          ))}

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 p-2">
            <Button onClick={() => setTiles((prev) => Math.max(1, prev - 1))}>
              Remove Tile
            </Button>
            <Button onClick={() => setTiles((prev) => prev + 1)}>
              Add Tile
            </Button>
          </div>
        </div>
      </ResizeObserver>
    </div>
  )
}
