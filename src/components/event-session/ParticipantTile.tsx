import { useRef } from 'react'

import { DyteAvatar, DyteParticipantTile } from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { DyteParticipant, DyteSelf } from '@dytesdk/web-core'
import { motion } from 'framer-motion'
import { IoHandRight } from 'react-icons/io5'
import uniqolor from 'uniqolor'

import { ParticipantAudioStatus } from './ParticipantAudioStatus'
import { ParticipantTagName } from './ParticipantTagName'
import { VideoBackgroundSettingsButtonWithModal } from './VideoBackgroundSettingsButtonWithModal'
import { RenderIf } from '../common/RenderIf/RenderIf'

import { cn } from '@/utils/utils'

export function ParticipantTile({
  participant,
  handRaised = false,
  handRaisedOrder,
  showOrder = false,
}: {
  participant: DyteParticipant | Readonly<DyteSelf>
  handRaised?: boolean
  handRaisedOrder?: number | null
  showOrder?: boolean
}) {
  const tileRef = useRef<HTMLDivElement>(null)
  const { meeting } = useDyteMeeting()
  const selfParticipant = useDyteSelector((m) => m.self)
  const presenceColor = uniqolor(
    participant.customParticipantId as string
  )?.color
  const selfPresenceColor = uniqolor(
    selfParticipant?.customParticipantId as string
  )?.color

  const isSelfTile = participant.id === selfParticipant.id

  const avatarHeight = tileRef.current?.clientHeight
    ? `${tileRef.current.clientHeight * 0.4}px`
    : '40%'

  const isTileSmall = (tileRef.current?.clientWidth || 0) < 250

  return (
    <DyteParticipantTile
      meeting={meeting}
      participant={participant}
      nameTagPosition="bottom-right"
      className="w-full h-full aspect-video bg-[var(--dyte-participant-tile-bg-color)] group/tile">
      <DyteAvatar
        size="md"
        participant={participant}
        className="min-w-10 min-h-10 max-w-28 max-h-28 w-full h-full text-lg aspect-square"
        style={{
          backgroundColor: isSelfTile ? selfPresenceColor : presenceColor,
          width: 'auto',
          height: avatarHeight,
        }}
      />
      <ParticipantAudioStatus
        participant={participant}
        isTileSmall={isTileSmall}
      />
      <ParticipantTagName participant={participant} />
      <RenderIf isTrue={handRaised}>
        <div>
          <motion.span
            animate={{ scale: [0, 1.1, 1] }}
            className={cn(
              'absolute right-2 top-2 flex justify-center items-center gap-2 bg-black/50 text-white rounded-full',
              {
                'w-8 h-8 p-2': !isTileSmall,
                'w-6 h-6 p-1': isTileSmall,
              }
            )}>
            <RenderIf isTrue={!!handRaisedOrder && showOrder}>
              <span>{handRaisedOrder}</span>
            </RenderIf>
            <IoHandRight size={20} className="text-yellow-500" />
          </motion.span>
        </div>
      </RenderIf>
      <RenderIf isTrue={participant.id === selfParticipant.id}>
        <VideoBackgroundSettingsButtonWithModal
          buttonProps={{
            className: cn(
              'absolute bottom-2 right-2 flex-none !w-8 !h-8 !min-w-8 p-2 bg-black/50 text-white rounded-full',
              {
                '!w-6 !h-6 !min-w-6 p-1 opacity-0 group-hover/tile:opacity-100 transition-all duration-300':
                  isTileSmall,
              }
            ),
          }}
        />
      </RenderIf>
    </DyteParticipantTile>
  )
}
