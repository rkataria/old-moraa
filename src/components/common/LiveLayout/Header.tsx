import { ReactNode } from '@tanstack/react-router'

import { useAppContext } from '@/hooks/useApp'
import { cn } from '@/utils/utils'

type HeaderProps = {
  children: ReactNode
}

export function Header({ children }: HeaderProps) {
  const { isZenMode } = useAppContext()

  return (
    <div
      className={cn('h-16 w-full flex-none z-[1]', {
        'fixed -top-14 left-0 w-full transition-all duration-300 hover:top-0 bg-white hover:shadow-sm':
          isZenMode,
      })}>
      {children}
    </div>
  )
}
