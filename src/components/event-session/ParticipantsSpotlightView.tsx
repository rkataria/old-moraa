import { DyteParticipant, DyteSelf } from '@dytesdk/web-core'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

import { ParticipantsGridView } from './ParticipantsGridView'

const SPOTLIGHT_GRID_SIZE = 4
const GRID_SIZE = 8

export function ParticipantsSpotlightView({
  spotlightParticipants,
  participants,
}: {
  spotlightParticipants: (DyteParticipant | Readonly<DyteSelf>)[]
  participants: (DyteParticipant | Readonly<DyteSelf>)[]
}) {
  const firstPageParticipantsForSpotlight = spotlightParticipants.slice(
    0,
    SPOTLIGHT_GRID_SIZE
  )
  const firstPageParticipants = participants.slice(0, GRID_SIZE)
  const spotlightEnabled = spotlightParticipants.length > 0

  if (!spotlightEnabled) {
    return (
      <ParticipantsGridView
        gridSize={GRID_SIZE}
        gridStyles={{
          'grid-cols-2': firstPageParticipants.length <= 4,
          'grid-cols-4':
            firstPageParticipants.length > 4 &&
            firstPageParticipants.length <= 8,
          'grid-rows-8': participants.length > 8,
        }}
        participants={participants}
      />
    )
  }

  return (
    <PanelGroup direction="horizontal">
      <Panel minSize={50} defaultSize={60} maxSize={80}>
        <ParticipantsGridView
          gridSize={SPOTLIGHT_GRID_SIZE}
          gridStyles={{
            'grid-cols-1': firstPageParticipantsForSpotlight.length <= 2,
            'grid-cols-4':
              firstPageParticipantsForSpotlight.length > 2 &&
              firstPageParticipantsForSpotlight.length <= 4,
            'grid-rows-4': spotlightParticipants.length > 4, // 2x2 grid
          }}
          participants={spotlightParticipants}
        />
      </Panel>
      <PanelResizeHandle className="opacity-50 bg-gray-800 w-2 h-12 rounded-full relative z-10 -right-1 top-1/2 -translate-y-1/2 cursor-col-resize group-hover:opacity-100 transition-opacity duration-500" />
      <Panel minSize={20} defaultSize={40} maxSize={50}>
        <ParticipantsGridView
          gridSize={GRID_SIZE}
          gridStyles={{
            'grid-cols-1': firstPageParticipants.length <= 4,
            'grid-cols-4':
              firstPageParticipants.length > 4 &&
              firstPageParticipants.length <= 8,
            'grid-rows-4': participants.length > 8, // 2x2 grid
          }}
          participants={participants}
        />
      </Panel>
    </PanelGroup>
  )
}
