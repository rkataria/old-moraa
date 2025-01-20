import { Loading } from './Loading'
import { RenderIf } from './RenderIf/RenderIf'

import { cn } from '@/utils/utils'

type ContentLoadingProps = {
  message?: string
  fullPage?: boolean
  overlay?: boolean
  transparent?: boolean
}

export function ContentLoading({
  message,
  fullPage = false,
  overlay = false,
  transparent,
}: ContentLoadingProps) {
  return (
    <div
      className={cn(
        'flex justify-center items-center w-full h-full bg-white rounded-md',
        {
          'fixed left-0 top-0 w-screen h-screen z-[51]': fullPage,
          'bg-black/30': overlay,
          'bg-transparent': transparent,
        }
      )}>
      <RenderIf isTrue={!transparent}>
        <div className="bg-white p-4 rounded-lg">
          <Loading />

          {message && <p className="!text-sm">{message}</p>}
        </div>
      </RenderIf>
    </div>
  )
}
