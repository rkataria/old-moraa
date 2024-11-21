import { useRef } from 'react'

import { motion } from 'framer-motion'

import { cn } from '@/utils/utils'

export function MeetingStatusContainer({
  title,
  description,
  actions,
  styles,
}: {
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  actions?: React.ReactNode[]
  styles?: {
    container?: string
    title?: string
    description?: string
  }
}) {
  const actionsContainerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validActions = actions?.filter((action: any) => action)

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -20,
      }}
      transition={{
        duration: 0.3,
      }}
      className={cn(
        'w-fit max-w-[50vw] py-2.5 px-6 mt-1 mx-auto flex justify-start items-center gap-5',
        'bg-white rounded-full',
        styles?.container
      )}>
      <div className="flex flex-col gap-1 flex-auto">
        {title && (
          <span className={cn('text-sm font-semibold', styles?.title)}>
            {title}
          </span>
        )}
        {description && (
          <p className={cn('text-xs', styles?.description)}>{description}</p>
        )}
      </div>
      <div
        ref={actionsContainerRef}
        className={cn('flex justify-end items-center gap-2 flex-1', {
          hidden: actionsContainerRef.current?.children.length === 0,
        })}>
        {validActions}
      </div>
    </motion.div>
  )
}
