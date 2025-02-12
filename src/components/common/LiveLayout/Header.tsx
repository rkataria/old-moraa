import { ReactNode } from '@tanstack/react-router'

import { useStoreSelector } from '@/hooks/useRedux'
import { ContentTilesLayout } from '@/stores/slices/layout/live.slice'
import { cn } from '@/utils/utils'

type HeaderProps = {
  children: ReactNode
}

export function Header({ children }: HeaderProps) {
  const layout = useStoreSelector(
    (state) => state.layout.live.contentTilesLayoutConfig.layout
  )
  const currentFrameStates = useStoreSelector(
    (store) => store.layout.studio.currentFrameStates
  )

  return (
    <div
      className={cn('h-16 w-full flex-none z-[1]', {
        'fixed -top-14 left-0 w-full transition-all duration-300 hover:top-0 bg-white hover:shadow-sm':
          layout === ContentTilesLayout.Spotlight ||
          currentFrameStates?.isFullscreen,
      })}>
      {children}
    </div>
  )
}
