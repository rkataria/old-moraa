/* eslint-disable consistent-return */
import { useEffect, useRef, useState } from 'react'

import { DyteParticipant, DyteSelf } from '@dytesdk/web-core'
import { ButtonGroup } from '@heroui/button'
import { motion } from 'framer-motion'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

import { RenderIf } from '../RenderIf/RenderIf'

import { ParticipantTile } from '@/components/event-session/ParticipantTile'
import { Button } from '@/components/ui/Button'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreSelector } from '@/hooks/useRedux'
import { ContentTilesLayout } from '@/stores/slices/layout/live.slice'
import { PresentationStatuses } from '@/types/event-session.type'
import { calculateTileDimensions } from '@/utils/participant-tile.util'
import { cn } from '@/utils/utils'

type ParticipantsGridProps = {
  participants: (DyteParticipant | Readonly<DyteSelf>)[]
}

const BOX_WIDTH = 1200

export function ParticipantsGrid({
  participants: dyteParticipanrs,
}: ParticipantsGridProps) {
  const maxTilesPerPage = useStoreSelector(
    (store) => store.layout.live.contentTilesLayoutConfig.maxTilesPerPage
  )
  const layout = useStoreSelector(
    (store) => store.layout.live.contentTilesLayoutConfig.layout
  )
  const [tilesPerPage, setTilesPerPage] = useState<number>(maxTilesPerPage)
  const [participants, setParticipants] =
    useState<(DyteParticipant | Readonly<DyteSelf>)[]>(dyteParticipanrs)
  const [currentPage, setCurrentPage] = useState(1)
  const [boxWidth, setBoxWidth] = useState(BOX_WIDTH)
  const gridRef = useRef<HTMLDivElement>(null)
  const { activeSession, presentationStatus } = useEventSession()

  const handRaised = activeSession?.handsRaised || []

  const participantCount = participants.length

  const isLayoutTopbar =
    layout === ContentTilesLayout.Topbar &&
    presentationStatus !== PresentationStatuses.STOPPED

  useEffect(() => {
    if (layout !== ContentTilesLayout.Topbar) {
      setTilesPerPage(maxTilesPerPage)
    }
  }, [maxTilesPerPage, layout])

  useEffect(() => {
    if (!gridRef.current) return
    if (!gridRef.current?.clientWidth || !gridRef.current?.clientHeight) return

    const observer = new ResizeObserver(calculateDimention)

    function calculateDimention() {
      const dimension = calculateTileDimensions({
        containerWidth: gridRef.current?.clientWidth as number,
        containerHeight: gridRef.current?.clientHeight as number,
        aspectRatio: 16 / 9,
        boxCount:
          participantCount > tilesPerPage ? tilesPerPage : participantCount,
        maxRows: isLayoutTopbar ? 1 : 9,
      })

      setBoxWidth(dimension.boxWidth)

      if (dimension.tilesInRowForTopbar && isLayoutTopbar) {
        setTilesPerPage(dimension.tilesInRowForTopbar)
      }
    }

    observer.observe(gridRef.current)
    calculateDimention()

    return () => {
      observer.disconnect()
    }
  }, [gridRef, participantCount, tilesPerPage, isLayoutTopbar])

  const totalPages = Math.ceil(participantCount / tilesPerPage)
  const participantsInCurrentPage = participants.slice(
    (currentPage - 1) * tilesPerPage,
    currentPage * tilesPerPage
  )

  const handRaisedActiveParticipants = participants.filter((participant) =>
    handRaised.includes(participant.id)
  )

  return (
    <div className="relative w-full max-w-full h-full max-h-full overflow-hidden group/participants-grid">
      <RenderIf isTrue={process.env.NODE_ENV === 'development'}>
        <div className="fixed bottom-0 right-0 flex justify-center items-center gap-2 p-4 bg-white shadow-md">
          <Button
            onClick={() => {
              setParticipants((p) => p.slice(1))
            }}>
            Remove Participant
          </Button>
          <Button
            onClick={() => {
              setParticipants((p) => [...p, participants[0]])
            }}>
            Add Participant
          </Button>
        </div>
      </RenderIf>
      <div
        ref={gridRef}
        className={cn(
          'w-full h-full flex justify-center flex-wrap items-center content-center gap-0',
          {
            'flex-nowrap w-full overflow-x-auto scrollbar-none': isLayoutTopbar,
          }
        )}>
        {participantsInCurrentPage.map((participant) => (
          <motion.div
            key={participant.id}
            layout
            className={cn('aspect-video p-1 border-2 border-transparent', {
              'h-full': isLayoutTopbar,
            })}
            style={{
              flexBasis: isLayoutTopbar
                ? undefined
                : `${boxWidth > BOX_WIDTH ? BOX_WIDTH : boxWidth}px`,
            }}>
            <ParticipantTile
              participant={participant}
              handRaised={handRaised.includes(participant.id)}
              showOrder={handRaisedActiveParticipants.length > 1}
              handRaisedOrder={
                handRaisedActiveParticipants.findIndex(
                  (p) => p.id === participant.id
                ) + 1
              }
            />
          </motion.div>
        ))}
      </div>
      {totalPages > 1 && (
        <ButtonGroup
          className={cn('absolute bottom-4 left-1/2 -translate-x-1/2 z-[1]', {
            'bottom-1 opacity-0 transition-all duration-300 group-hover/participants-grid:opacity-100':
              isLayoutTopbar,
          })}>
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
