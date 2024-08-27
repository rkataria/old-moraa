import { Loading } from './Loading'

import { cn } from '@/utils/utils'

type ContentLoadingProps = {
  message?: string
  fullPage?: boolean
}

export function ContentLoading({
  message,
  fullPage = false,
}: ContentLoadingProps) {
  return (
    <div
      className={cn(
        'flex justify-center items-center w-full h-full bg-white rounded-md',
        {
          'fixed left-0 top-0 w-screen h-screen z-[51]': fullPage,
        }
      )}>
      <div>
        <Loading />
        {message && <p>{message}</p>}
      </div>
    </div>
  )
}
