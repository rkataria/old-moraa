/* eslint-disable react/no-array-index-key */
import { useCallback, useEffect, useRef, useState } from 'react'

import { DyteParticipant, DyteSelf } from '@dytesdk/web-core'
import { ButtonGroup } from '@nextui-org/button'
import { motion } from 'framer-motion'
import ResizeObserver from 'rc-resize-observer'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

import { RenderIf } from '../RenderIf/RenderIf'

import { ParticipantTile } from '@/components/event-session/ParticipantTile'
import { Button } from '@/components/ui/Button'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useDyteParticipants } from '@/hooks/useDyteParticipants'
import { useStoreSelector } from '@/hooks/useRedux'
import { ContentTilesLayout } from '@/stores/slices/layout/live.slice'
import { PresentationStatuses } from '@/types/event-session.type'
import { cn } from '@/utils/utils'

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

function calculateGrid({
  tilesCount,
  containerWidth,
  containerHeight,
  maxRows,
}: {
  tilesCount: number
  containerWidth: number
  containerHeight: number
  maxRows?: number
}): { rows: number; columns: number } {
  let bestRows = 1
  let bestColumns = tilesCount
  let bestTileSize = 0

  const maxRowsLimit = maxRows ? Math.min(maxRows, tilesCount) : tilesCount

  // eslint-disable-next-line no-plusplus
  for (let rows = 1; rows <= maxRowsLimit; rows++) {
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
function getTilesPositions({
  tilesCount,
  containerWidth,
  containerHeight,
  maxRows,
}: {
  tilesCount: number
  containerWidth: number
  containerHeight: number
  maxRows?: number
}) {
  const grid = calculateGrid({
    tilesCount,
    containerWidth,
    containerHeight,
    maxRows,
  })

  const tileSize = calculateTileSize(
    containerWidth / grid.columns,
    maxRows === 1 ? containerHeight : containerHeight / grid.rows
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
      tilesCount === 1
        ? (containerWidth - updatedTileSize.width) / 2
        : isLastRow && isLastRowIncomplete
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

export function ParticipantsGrid({
  participants,
}: {
  participants: (DyteParticipant | Readonly<DyteSelf>)[]
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  const [currentPage, setCurrentPage] = useState<number>(1)
  const { maxTilesPerPage, layout } = useStoreSelector(
    (store) => store.layout.live.contentTilesLayoutConfig
  )
  const [tilesPerPage, setTilesPerPage] = useState<number>(maxTilesPerPage)
  const [tiles, setTiles] = useState(participants)
  const totalParticipants = tiles.length

  const { presentationStatus } = useEventSession()

  const isLayoutTopbar =
    layout === ContentTilesLayout.Topbar &&
    presentationStatus !== PresentationStatuses.STOPPED

  useEffect(() => {
    setTiles(participants)
  }, [participants])

  const tilesPosition = useCallback(
    () =>
      getTilesPositions({
        tilesCount:
          totalParticipants > tilesPerPage ? tilesPerPage : totalParticipants,
        containerWidth: containerRef.current?.clientWidth || 0,
        containerHeight: containerRef.current?.clientHeight || 0,
        maxRows: isLayoutTopbar ? 1 : undefined,
      }),
    [totalParticipants, tilesPerPage, isLayoutTopbar]
  )
  const [positions, setPositions] =
    useState<ReturnType<typeof getTilesPositions>>(tilesPosition)
  const { handRaisedActiveParticipants } = useDyteParticipants()

  useEffect(() => {
    setPositions(tilesPosition())
  }, [tiles, tilesPosition, currentPage])

  useEffect(() => {
    setTilesPerPage(maxTilesPerPage)
  }, [maxTilesPerPage])

  const totalPages = Math.ceil(totalParticipants / tilesPerPage)
  const participantsInCurrentPage = tiles.slice(
    (currentPage - 1) * tilesPerPage,
    currentPage * tilesPerPage
  )

  return (
    <div className="h-full w-full group">
      <ResizeObserver
        onResize={() => {
          if (!containerRef.current) return

          setPositions(tilesPosition)
        }}>
        <div
          ref={containerRef}
          className={cn(
            'relative h-full flex justify-center items-center w-full'
          )}>
          {participantsInCurrentPage.map((participant, index) => (
            <motion.div
              key={index}
              animate={{ ...positions[index] }}
              className="absolute flex-none flex justify-center items-center p-1"
              style={positions[index]}>
              <ParticipantTile
                participant={participant}
                // handRaised={handRaised.includes(participant.id)}
                showOrder={handRaisedActiveParticipants.length > 1}
                handRaisedOrder={
                  handRaisedActiveParticipants.findIndex(
                    (p) => p.id === participant.id
                  ) + 1
                }
              />
            </motion.div>
          ))}
          <RenderIf isTrue={totalParticipants > tilesPerPage}>
            <ButtonGroup
              className={cn(
                'absolute bottom-2 left-1/2 -translate-x-1/2 z-[1]',
                {
                  'bottom-1 opacity-0 transition-all duration-300 group-hover:opacity-100':
                    isLayoutTopbar,
                }
              )}>
              <Button
                isIconOnly
                onClick={() => {
                  setCurrentPage((prev) => Math.max(1, prev - 1))
                }}
                radius="full"
                variant="flat"
                size="sm"
                className="bg-black text-white hover:bg-gray-900 hover:opacity-100">
                <LuChevronLeft />
              </Button>
              <Button
                disabled
                disableRipple
                variant="flat"
                size="sm"
                className="bg-black text-white hover:bg-black hover:opacity-100">
                {currentPage}/{totalPages}
              </Button>
              <Button
                isIconOnly
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < totalPages ? prev + 1 : prev
                  )
                }
                radius="full"
                variant="flat"
                size="sm"
                className="bg-black text-white hover:bg-gray-900 hover:opacity-100">
                <LuChevronRight />
              </Button>
            </ButtonGroup>
          </RenderIf>
          <RenderIf isTrue={process.env.NODE_ENV === 'development'}>
            <div className="fixed bottom-2 right-2 p-2">
              <Button
                onClick={() =>
                  setTiles((prev) => prev.slice(0, prev.length - 1))
                }>
                Remove Tile
              </Button>
              <Button
                onClick={() => setTiles((prev) => [...prev, participants[0]])}>
                Add Tile
              </Button>
            </div>
          </RenderIf>
        </div>
      </ResizeObserver>
    </div>
  )
}
