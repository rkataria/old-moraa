import { Avatar, Chip, cn } from '@heroui/react'
import { AnimatePresence, motion } from 'framer-motion'
import groupBy from 'lodash.groupby'

import { Tooltip } from '@/components/common/ShortuctTooltip'
import { FrameReaction } from '@/types/event-session.type'

export function Emojis({
  canReact = true,
  reactions,
  className = '',
  handleEmojiSelect,
  participantEmotedOnReaction,
}: {
  canReact: boolean
  reactions: FrameReaction[]
  className?: string
  handleEmojiSelect?: (reaction: string) => void
  participantEmotedOnReaction?: (reaction: string) => void
}) {
  const groupedReactions = Object.entries(groupBy(reactions, 'reaction'))

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      <AnimatePresence initial={false}>
        {groupedReactions.map(([reaction, users]) => (
          <Tooltip
            key={reaction}
            classNames={{ content: '!p-2' }}
            content={
              <div className="grid place-items-center gap-2 max-w-[150px]">
                {users.map((user) => (
                  <Chip
                    size="md"
                    classNames={{
                      content: 'text-white text-xs',
                      base: 'gap-1.5 bg-transparent',
                    }}
                    avatar={
                      <Avatar
                        className="min-w-6 w-6 h-6"
                        src={user?.details?.avatar_url}
                      />
                    }
                    variant="flat">
                    {user?.details?.name}
                  </Chip>
                ))}
              </div>
            }>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}>
              <Chip
                onClick={() => handleEmojiSelect?.(reaction)}
                className={cn('font-bold duration-300', {
                  'bg-primary/20': participantEmotedOnReaction?.(reaction),
                  'group/item cursor-pointer hover:bg-primary': canReact,
                  'cursor-not-allowed': !canReact,
                })}
                variant="flat"
                avatar={<em-emoji set="apple" id={reaction} size={22} />}>
                <span className="font-bold text-gray-600 group-hover/item:text-white">
                  {users.length}
                </span>
              </Chip>
            </motion.div>
          </Tooltip>
        ))}
      </AnimatePresence>
    </div>
  )
}
