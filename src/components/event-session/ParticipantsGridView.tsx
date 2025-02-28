import { useRef, useState } from 'react'

import { DyteParticipant, DyteSelf } from '@dytesdk/web-core'
import { Button, ButtonGroup } from '@heroui/react'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

import { ParticipantTile } from './ParticipantTile'

import { useEventSession } from '@/contexts/EventSessionContext'
import { cn } from '@/utils/utils'

export function ParticipantsGridView({
  gridSize,
  gridStyles,
  participants,
}: {
  gridSize: number
  gridStyles: {
    [key: string]: boolean
  }
  participants: (DyteParticipant | Readonly<DyteSelf>)[]
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const gridRef = useRef<HTMLDivElement>(null)
  const totalPages = Math.ceil(participants.length / gridSize)
  const { activeSession } = useEventSession()

  const handRaised = activeSession?.handsRaised || []

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const participantsToShow = participants.slice(
    (currentPage - 1) * gridSize,
    currentPage * gridSize
  )

  return (
    <div
      ref={gridRef}
      key={participantsToShow.length}
      className={cn(
        'relative w-full h-full grid gap-4 m-auto justify-center items-center place-content-center',
        gridStyles
      )}>
      {participantsToShow.map((participant) => (
        <ParticipantTile
          key={participant.id}
          participant={participant}
          handRaised={handRaised.includes(participant.id)}
        />
      ))}
      {totalPages > 1 && (
        <ButtonGroup className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1]">
          <Button
            isIconOnly
            onClick={handlePrevPage}
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
            {`${currentPage} / ${totalPages}`}
          </Button>
          <Button
            isIconOnly
            onClick={handleNextPage}
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
