import { ReactNode } from '@tanstack/react-router'

import { useStoreSelector } from '@/hooks/useRedux'
import { cn } from '@/utils/utils'

type HeaderProps = {
  children: ReactNode
}

export function Header({ children }: HeaderProps) {
  const layout = useStoreSelector(
    (state) => state.layout.live.contentTilesLayoutConfig.layout
  )

  return (
    <div
      className={cn('h-16 w-full flex-none z-[1]', {
        'fixed -top-14 left-0 w-full transition-all duration-300 hover:top-0 bg-white hover:shadow-sm':
          layout === 'spotlight',
      })}>
      {children}
    </div>
  )
}
