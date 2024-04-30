import { useContext, useState } from 'react'

import { useDyteSelector } from '@dytesdk/react-web-core'
import { MdOutlineEmojiEmotions } from 'react-icons/md'

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react'

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

export function FlyingEmojis({ showLabel = false }: { showLabel?: boolean }) {
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
          style={{
            backgroundColor:
              'var(--dyte-controlbar-button-background-color, rgb(var(--dyte-colors-background-1000, 8 8 8)))',
          }}
          className={cn(
            'flex flex-col justify-center items-center gap-[5px] w-14 h-10 rounded-sm hover:bg-[#1E1E1E] text-white'
          )}>
          <MdOutlineEmojiEmotions className="text-2xl" />

          {showLabel && <p className="text-xs">Emoji</p>}
        </button>
      </PopoverTrigger>
      <PopoverContent className="rounded-full overflow-hidden">
        <div className="bg-[#2C2C2C] flex items-center gap-2 py-[0.0625rem]">
          {EMOJIS.map((emoji) => (
            <Button
              key={emoji}
              isIconOnly
              className="!opacity-100 rounded-full grid place-items-center bg-transparent hover:bg-[#4D4949] duration-300">
              <em-emoji
                set="apple"
                id={emoji}
                size={25}
                onClick={() =>
                  flyEmoji({
                    emoji,
                    name: selfParticipant.name,
                  })
                }
              />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
