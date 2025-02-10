import { Loading } from './Loading'

import { cn } from '@/utils/utils'

type ContentLoadingProps = {
  message?: string
  fullPage?: boolean
  overlay?: boolean
  transparent?: boolean
  classNames?: {
    container?: string
    message?: string
  }
}

export function ContentLoading({
  message,
  fullPage = false,
  overlay = false,
  transparent,
  classNames = {},
}: ContentLoadingProps) {
  return (
    <div
      className={cn(
        'flex justify-center items-center w-full h-full bg-white rounded-md',
        {
          'fixed left-0 top-0 w-screen h-screen z-[51]': fullPage,
          'bg-black/30': overlay,
          'bg-transparent': transparent,
        },
        classNames.container
      )}>
      <div className="p-4 rounded-lg">
        <Loading />
        {message && (
          <p className={cn('text-sm', classNames.message)}>{message}</p>
        )}
      </div>
    </div>
  )
}
