import { ReactNode } from '@tanstack/react-router'

import { useStoreSelector } from '@/hooks/useRedux'
import { ContentTilesLayout } from '@/stores/slices/layout/live.slice'
import { cn } from '@/utils/utils'

type FooterProps = {
  children: ReactNode
}

export function Footer({ children }: FooterProps) {
  const layout = useStoreSelector(
    (state) => state.layout.live.contentTilesLayoutConfig.layout
  )

  return (
    <div
      className={cn('h-16 w-full flex-none', {
        'fixed -bottom-14 left-0 w-full hover:bottom-0 transition-all duration-300':
          layout === ContentTilesLayout.Spotlight,
      })}>
      {children}
    </div>
  )
}
