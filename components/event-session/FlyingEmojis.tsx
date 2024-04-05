import { useContext, useState } from 'react'

import { useDyteSelector } from '@dytesdk/react-web-core'
import { MdOutlineEmojiEmotions } from 'react-icons/md'

import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { cn } from '@/utils/utils'

const EMOJIS = [
  'heart',
  '+1',
  'tada',
  'clap',
  'joy',
  'open_mouth',
  'disappointed_relieved',
  'thinking_face',
  '-1',
]

export function FlyingEmojis() {
  const [isOpen, setIsOpen] = useState(false)

  const selfParticipant = useDyteSelector((m) => m.self)

  const { flyEmoji } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      classNames={{ content: 'p-0' }}>
      <PopoverTrigger>
        <button
          type="button"
          className={cn(
            'flex flex-col items-center gap-[5px] p-1 w-[84px] rounded-sm hover:bg-[#1E1E1E] text-white'
          )}>
          <MdOutlineEmojiEmotions className="text-2xl" />

          <p className="text-xs">Emoji</p>
        </button>
      </PopoverTrigger>
      <PopoverContent className="rounded-full overflow-hidden">
        <div className="bg-[#2C2C2C] px-1 py-[0.3125rem] flex items-center gap-2">
          {EMOJIS.map((emoji) => (
            <div className="w-10 h-10 rounded-full hover:bg-[#333333] grid place-items-center cursor-pointer">
              <em-emoji
                id={emoji}
                size={25}
                onClick={() =>
                  flyEmoji({
                    emoji,
                    name: selfParticipant.name,
                  })
                }
              />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
