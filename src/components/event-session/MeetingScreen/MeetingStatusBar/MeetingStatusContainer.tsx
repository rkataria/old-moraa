import { motion } from 'framer-motion'

import { RenderIf } from '@/components/common/RenderIf/RenderIf'
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
        'w-fit max-w-[50vw] py-2.5 px-6 mt-1 mx-auto flex justify-start items-center gap-8',
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
      <RenderIf isTrue={Array.isArray(actions) && actions.length > 0}>
        <div className="flex justify-end items-center gap-2 flex-1">
          {actions}
        </div>
      </RenderIf>
    </motion.div>
  )
}
