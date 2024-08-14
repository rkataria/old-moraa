import { cn } from '@/utils/utils'

export const HEADER_HEIGHT = 56

export function Header({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'sticky top-0 left-0 w-full bg-transparent text-black dark:text-white z-[1]'
      )}
      style={{ height: HEADER_HEIGHT }}>
      {children}
    </div>
  )
}
