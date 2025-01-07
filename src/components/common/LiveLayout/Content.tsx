import { ReactNode } from 'react'

import { useStoreSelector } from '@/hooks/useRedux'
import { cn } from '@/utils/utils'

type ContentProps = {
  children: ReactNode
}

export function Content({ children }: ContentProps) {
  const { leftSidebarMode, rightSidebarMode } = useStoreSelector(
    (store) => store.layout.live
  )

  return (
    <div
      className={cn('flex-auto h-full', {
        'max-w-[calc(100%_-_224px_-_64px_-_320px)]':
          leftSidebarMode === 'maximized' && !!rightSidebarMode,
        'max-w-[calc(100%_-_224px_-_48px)]':
          leftSidebarMode === 'maximized' && !rightSidebarMode,
        'max-w-[calc(100%_-_48px_-_320px)]':
          leftSidebarMode === 'collapsed' && !!rightSidebarMode,
      })}>
      {children}
    </div>
  )
}
