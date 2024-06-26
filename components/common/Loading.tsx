import { IconLoader } from '@tabler/icons-react'

import { cn } from '@/utils/utils'

export function Loading({
  message = '',
  isFullSize,
}: {
  message?: React.ReactNode
  isFullSize?: boolean
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 justify-center items-center w-full h-full',
        {
          'w-full h-full': isFullSize,
        }
      )}>
      <div>
        <IconLoader className="animate-spin" />
      </div>
      {message ? <div>{message}</div> : null}
    </div>
  )
}
