/* eslint-disable consistent-return */
import { useEffect, useRef, useState } from 'react'

import { DyteParticipant, DyteSelf } from '@dytesdk/web-core'
import { ButtonGroup } from '@nextui-org/button'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

import { ParticipantTile } from '@/components/event-session/ParticipantTile'
import { Button } from '@/components/ui/Button'
import { useEventSession } from '@/contexts/EventSessionContext'
import { cn } from '@/utils/utils'

function calculateMaxBoxes(
  containerWidth: number,
  containerHeight: number,
  boxWidth: number,
  boxSpacingX: number = 0,
  boxSpacingY: number = 0
) {
  // Ensure the box maintains a 16:9 aspect ratio
  const boxHeight = Math.round((boxWidth / 16) * 9)

  // Adjust dimensions to include spacing
  const effectiveBoxWidth = boxWidth + boxSpacingX
  const effectiveBoxHeight = boxHeight + boxSpacingY

  // Ensure the box dimensions fit within the container
  if (
    effectiveBoxWidth > containerWidth ||
    effectiveBoxHeight > containerHeight
  ) {
    return calculateMaxBoxes(
      containerWidth,
      containerHeight,
      boxWidth - 50,
      boxSpacingX,
      boxSpacingY
    )
  }

  const boxesPerRow = Math.floor(containerWidth / effectiveBoxWidth)
  const boxesPerColumn = Math.floor(containerHeight / effectiveBoxHeight)
  const totalBoxes = boxesPerRow * boxesPerColumn

  return { totalBoxes, rows: boxesPerColumn, columns: boxesPerRow, boxWidth }
}

type ParticipantsGridProps = {
  participants: (DyteParticipant | Readonly<DyteSelf>)[]
}

export function ParticipantsGrid({ participants }: ParticipantsGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(0)
  const [rows, setRows] = useState(0)
  const [columns, setColumns] = useState(0)
  const [boxWidth, setBoxWidth] = useState(300)
  const gridRef = useRef<HTMLDivElement>(null)
  const { activeSession } = useEventSession()

  const handRaised = activeSession?.handsRaised || []

  const participantCount = participants.length

  useEffect(() => {
    if (!gridRef.current) return
    if (!gridRef.current?.clientWidth || !gridRef.current?.clientHeight) return

    const observer = new ResizeObserver(updateGrid)

    function updateGrid() {
      const {
        totalBoxes: maxBoxes,
        rows: itemsInRow,
        columns: itemsInColumn,
        boxWidth: itemBoxWidth,
      } = calculateMaxBoxes(
        gridRef.current?.clientWidth as number,
        gridRef.current?.clientHeight as number,
        300
      )

      setItemsPerPage(maxBoxes || 0)
      setRows(itemsInRow)
      setColumns(itemsInColumn)
      setBoxWidth(itemBoxWidth)
    }

    observer.observe(gridRef.current)
    updateGrid()

    return () => {
      observer.disconnect()
    }
  }, [gridRef, participantCount])

  const totalPages = Math.ceil(participantCount / itemsPerPage)
  const participantsInCurrentPage = participants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getGridTemplate = () => {
    if (participantCount > itemsPerPage) {
      return {
        columnTemplate: `repeat(${columns}, ${boxWidth}px)`,
        rowTemplate: 'auto',
      }
    }

    if (columns === 1) {
      return {
        columnTemplate:
          participantsInCurrentPage.length === 1
            ? `repeat(1, minmax(${boxWidth}px, 600px))`
            : `repeat(1, ${boxWidth}px)`,
        rowTemplate: 'auto',
      }
    }

    if (columns === 2 && participantsInCurrentPage.length === 1) {
      return {
        columnTemplate: `repeat(1, minmax(${boxWidth}px, 600px))`,
        rowTemplate: 'auto',
      }
    }

    if (columns === 2 && participantsInCurrentPage.length < 3) {
      return {
        columnTemplate: `repeat(2, minmax(${boxWidth}px, 600px))`,
        rowTemplate: 'auto',
      }
    }

    if (
      participantsInCurrentPage.length > 2 &&
      participantsInCurrentPage.length < 5
    ) {
      return {
        columnTemplate: `repeat(2, minmax(${boxWidth}px, 500px))`,
        rowTemplate: 'auto',
      }
    }

    if (
      participantsInCurrentPage.length > 4 &&
      participantsInCurrentPage.length < 10
    ) {
      return {
        columnTemplate:
          columns === 2
            ? `repeat(2, ${boxWidth}px)`
            : `repeat(3, minmax(${boxWidth}px, 400px))`,
        rowTemplate: 'auto',
      }
    }

    if (columns > participantsInCurrentPage.length) {
      return {
        columnTemplate: `repeat(${participantsInCurrentPage.length}, minmax(${boxWidth}px, 1000px))`,
        rowTemplate: 'auto',
      }
    }

    return {
      columnTemplate: `repeat(${columns}, ${boxWidth}px)`,
      rowTemplate: `repeat(${rows}, 1fr)`,
    }
  }

  return (
    <div className="relative w-full max-w-full h-full max-h-full overflow-hidden">
      <div
        ref={gridRef}
        className="w-full h-full grid place-content-center place-items-center justify-center items-center gap-0"
        style={{
          gridTemplateColumns: getGridTemplate().columnTemplate,
          gridTemplateRows: getGridTemplate().rowTemplate,
        }}>
        {participantsInCurrentPage.map((participant) => (
          <div
            key={participant.id}
            className={cn(
              'w-full h-auto aspect-video p-2 border-2 border-transparent'
            )}>
            <ParticipantTile
              participant={participant}
              handRaised={handRaised.includes(participant.id)}
            />
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <ButtonGroup className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1]">
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
              setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
            }
            radius="full"
            variant="flat"
            size="sm"
            className="bg-black text-white hover:bg-gray-900 hover:opacity-100">
            <LuChevronRight />
          </Button>
        </ButtonGroup>
      )}
    </div>
  )
}
