import { motion } from 'framer-motion'

import { VotedUsers } from '@/components/event-session/content-types/Poll/VotedUsers'
import { PollPreviewOption } from '@/types/frame.type'
import { cn, isColorDark } from '@/utils/utils'

export function VerticalPreview({
  options,
  disableAnimation,
  className,
}: {
  options: PollPreviewOption[]
  disableAnimation?: boolean
  className?: string
}) {
  const animatedProps = (height: number) =>
    disableAnimation
      ? {
          initial: { height: `${height}%` },
          animate: { height: `${height}%` },
        }
      : {
          initial: { height: 0 },
          animate: { height: `${height}%` },
        }

  return (
    <div className={cn('flex items-center gap-6 h-full', className)}>
      {options.map((option: PollPreviewOption) => (
        <div className="relative w-full max-w-[6.25rem] h-full flex flex-col">
          <div className="absolute -top-10 left-1">
            <VotedUsers users={option.votedUsers} />
          </div>
          <div className="relative min-w-[60px] h-full flex items-end bg-black/5 border  rounded-lg">
            <motion.div
              className=" left-0 bottom-0 h-full rounded-lg !w-full"
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
            <p
              className={cn(
                'absolute bottom-0 font-medium w-full text-center py-2',
                {
                  'text-white':
                    isColorDark(option.color) && option.percentage !== 0,
                }
              )}>
              {option.percentage}%
            </p>
          </div>

          <p className="h-[3.625rem] pt-1 text-center font-bold z-[1] text-[10px] leading-3 line-clamp-4">
            {option.name}
          </p>
        </div>
      ))}
    </div>
  )
}
