import { useContext } from 'react'

import { useDyteSelector } from '@dytesdk/react-web-core'
import { MdOutlineEmojiEmotions } from 'react-icons/md'

import { EmojiPicker } from '../common/EmojiPicker'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { cn } from '@/utils/utils'

export function FlyingEmojis() {
  const selfParticipant = useDyteSelector((m) => m.self)

  const { flyEmoji } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  return (
    <EmojiPicker
      triggerIcon={
        <button
          type="button"
          className={cn(
            'flex flex-col items-center gap-[5px] p-1 w-[84px] rounded-sm hover:bg-[#1E1E1E] text-white'
          )}>
          <MdOutlineEmojiEmotions className="text-2xl" />

          <p className="text-xs">Emoji</p>
        </button>
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onEmojiSelect={(selectedEmoji: any) =>
        flyEmoji({ emoji: selectedEmoji.id, name: selfParticipant.name })
      }
    />
  )
}
