import { DyteParticipant, DyteSelf } from '@dytesdk/web-core'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

import { ParticipantsGrid } from '../common/ParticipantsGrid/ParticipantsGrid'

export function ParticipantsSpotlightView({
  spotlightParticipants,
  participants,
}: {
  spotlightParticipants: (DyteParticipant | Readonly<DyteSelf>)[]
  participants: (DyteParticipant | Readonly<DyteSelf>)[]
}) {
  const spotlightEnabled = spotlightParticipants.length > 0

  if (!spotlightEnabled) {
    return <ParticipantsGrid participants={participants} />
  }

  return (
    <PanelGroup direction="horizontal">
      <Panel minSize={50} defaultSize={60} maxSize={80}>
        <ParticipantsGrid participants={spotlightParticipants} />
      </Panel>
      <PanelResizeHandle className="opacity-50 bg-gray-800 w-2 h-12 rounded-full relative z-10 -right-1 top-1/2 -translate-y-1/2 cursor-col-resize group-hover:opacity-100 transition-opacity duration-500" />
      <Panel minSize={20} defaultSize={40} maxSize={50}>
        <ParticipantsGrid participants={participants} />
      </Panel>
    </PanelGroup>
  )
}
