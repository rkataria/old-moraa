import {
  DyteAudioVisualizer,
  DyteAvatar,
  DyteParticipantTile,
} from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'

export function SelfParticipantTile() {
  const { meeting } = useDyteMeeting()
  const selfParticipant = useDyteSelector((m) => m.self)

  return (
    <DyteParticipantTile
      meeting={meeting}
      participant={selfParticipant}
      className="relative w-full h-auto aspect-video">
      <DyteAvatar size="md" participant={selfParticipant} />
      <div className="absolute top-2 left-2">
        <DyteAudioVisualizer
          size="sm"
          slot="start"
          className="text-white"
          participant={selfParticipant}
        />
      </div>
    </DyteParticipantTile>
  )
}
