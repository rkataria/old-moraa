import { useRef } from 'react'

import {
  DyteAudioVisualizer,
  DyteAvatar,
  DyteNameTag,
  DyteParticipantTile,
} from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { DyteParticipant, DyteSelf } from '@dytesdk/web-core'
import { motion } from 'framer-motion'
import ResizeObserver from 'rc-resize-observer'
import { IoHandRight } from 'react-icons/io5'
import uniqolor from 'uniqolor'

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

  return (
    <div
      ref={tileRef}
      className={cn(
        'participant-grid w-full h-full m-auto flex items-center justify-center overflow-hidden'
      )}>
      <ResizeObserver
        onResize={({ width, height }, element) => {
          const aspectRatio = width / height

          // Maintain aspect ratio so that the height is always 2.25 times the width and it doesn't look like it's squished
          if (aspectRatio > 2.25) {
            element.style.width = `${height * 2.25}px`
          }
        }}>
        <DyteParticipantTile
          meeting={meeting}
          participant={participant}
          nameTagPosition="bottom-right"
          className="w-full h-full aspect-video bg-[var(--dyte-participant-tile-bg-color)]">
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
          <DyteNameTag
            meeting={meeting}
            participant={participant}
            size="sm"
            className="left-3 w-fit text-white"
            style={{
              backgroundColor: isSelfTile ? selfPresenceColor : presenceColor,
            }}>
            <DyteAudioVisualizer
              size="sm"
              slot="start"
              participant={participant}
            />
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
                <RenderIf isTrue={!!handRaisedOrder && showOrder}>
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
      </ResizeObserver>
    </div>
  )
}
