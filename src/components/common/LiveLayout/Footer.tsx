import { ReactNode } from '@tanstack/react-router'

import { useAppContext } from '@/hooks/useApp'
import { cn } from '@/utils/utils'

type FooterProps = {
  children: ReactNode
}

export function Footer({ children }: FooterProps) {
  const { isZenMode } = useAppContext()

  return (
    <div
      className={cn('h-16 w-full flex-none', {
        'fixed -bottom-14 left-0 w-full hover:bottom-0 transition-all duration-300':
          isZenMode,
      })}>
      {children}
    </div>
  )
}
