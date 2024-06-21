import { ReactNode } from 'react'

import { HEADER_HEIGHT } from './Header'

import { cn } from '@/utils/utils'

const MAIN_CONTAINER_HEIGHT = `calc(100vh - ${HEADER_HEIGHT}px)`

export function MainContent({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn('flex-auto h-full overflow-hidden p-0', {})}
      style={{
        maxHeight: MAIN_CONTAINER_HEIGHT,
      }}>
      <div className="h-full overflow-y-auto scrollbar-none bg-white rounded-md">
        {children}
      </div>
    </div>
  )
}
