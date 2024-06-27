import { IconLoader } from '@tabler/icons-react'

import { cn } from '@/utils/utils'

export function Loading({ message = '' }: { message?: React.ReactNode }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 justify-center items-center w-full h-full'
      )}>
      <div>
        <IconLoader className="animate-spin" />
      </div>
      {message ? <div>{message}</div> : null}
    </div>
  )
}
