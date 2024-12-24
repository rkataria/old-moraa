import {
  DyteAudioVisualizer,
  DyteAvatar,
  DyteNameTag,
  DyteParticipantTile,
} from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { DyteParticipant, DyteSelf } from '@dytesdk/web-core'
import { motion } from 'framer-motion'
import { IoHandRight } from 'react-icons/io5'
import uniqolor from 'uniqolor'

import { VideoBackgroundSettingsButtonWithModal } from './VideoBackgroundSettingsButtonWithModal'
import { RenderIf } from '../common/RenderIf/RenderIf'

import { cn } from '@/utils/utils'

export function FloatingParticipantTile({
  participant,
  handRaised,
  handRaisedOrder,
  showOrder,
}: {
  participant: DyteParticipant | Readonly<DyteSelf>
  handRaised?: boolean
  handRaisedOrder?: number
  showOrder?: boolean
}) {
  const { meeting } = useDyteMeeting()
  const selfParticipant = useDyteSelector((m) => m.self)
  const presenceColor = uniqolor(
    participant.customParticipantId as string
  )?.color
  const selfPresenceColor = uniqolor(
    selfParticipant?.customParticipantId as string
  )?.color

  const isSelfTile = participant.id === selfParticipant.id

  return (
    <DyteParticipantTile
      meeting={meeting}
      participant={participant}
      nameTagPosition="bottom-right"
      className="basis-32 h-auto aspect-square rounded-xl bg-[var(--dyte-participant-tile-bg-color)]">
      <DyteAvatar
        size="md"
        participant={participant}
        className="min-w-12 min-h-12 max-w-28 max-h-28 w-full h-full text-lg"
        style={{
          backgroundColor: isSelfTile ? selfPresenceColor : presenceColor,
        }}
      />
      <DyteNameTag
        meeting={meeting}
        participant={participant}
        size="md"
        className="left-3 w-full text-white"
        style={{
          backgroundColor: isSelfTile ? selfPresenceColor : presenceColor,
        }}>
        <DyteAudioVisualizer size="md" slot="start" participant={participant} />
      </DyteNameTag>
      {handRaised && (
        <div>
          <motion.span
            animate={{ scale: [0, 1.1, 1] }}
            className={cn(
              'absolute top-2 h-8 flex justify-center items-center gap-2 bg-black/50 text-white rounded-md',
              {
                '!right-12': participant.id === selfParticipant.id,
                'right-3': participant.id !== selfParticipant.id,
                'px-4': showOrder,
                'w-8': !showOrder,
              }
            )}>
            <RenderIf isTrue={!!handRaisedOrder && !!showOrder}>
              <span>{handRaisedOrder}</span>
            </RenderIf>
            <IoHandRight size={20} className="text-yellow-500" />
          </motion.span>
        </div>
      )}
      {participant.id === selfParticipant.id && (
        <VideoBackgroundSettingsButtonWithModal
          buttonProps={{
            className: 'absolute top-2 right-2 w-8 h-8 flex-none',
          }}
        />
      )}
    </DyteParticipantTile>
  )
}
