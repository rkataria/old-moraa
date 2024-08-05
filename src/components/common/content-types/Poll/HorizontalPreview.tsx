import { motion } from 'framer-motion'

import { VotedUsers } from '@/components/event-session/content-types/Poll/VotedUsers'
import { PollPreviewOption } from '@/types/frame.type'
import { cn, isColorDark } from '@/utils/utils'

export function HorizontalPreview({
  options,
  disableAnimation,
  className,
}: {
  options: PollPreviewOption[]
  disableAnimation?: boolean
  className?: string
}) {
  const animatedProps = (width: number) =>
    disableAnimation
      ? {
          initial: { width: `${width}%` },
          animate: { width: `${width}%` },
        }
      : {
          initial: { width: 0 },
          animate: { width: `${width}%` },
        }

  return (
    <div className={cn('rounded-md relative', className)}>
      <div className="grid gap-4">
        {options.map((option) => (
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-400  w-[42px] font-medium">
              {option.percentage}%
            </p>
            <div className="relative w-full min min-h-[60px]  border border-[#ebebeb] z-0 flex justify-between items-center gap-2 p-4 rounded-xl overflow-hidden">
              <p
                className={cn('font-bold z-[1]', {
                  'text-white':
                    isColorDark(option.color) && option.percentage !== 0,
                })}>
                {option.name}
              </p>
              <motion.div
                className={cn('absolute left-0 h-full rounded-xl')}
                style={{
                  backgroundColor: option.color,
                }}
                key={option.name}
                {...animatedProps(option.percentage)}
                transition={{
                  duration: 1,
                  type: 'spring',
                }}
              />
              <div className="absolute right-4">
                <VotedUsers users={option.votedUsers} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
