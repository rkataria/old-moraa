import { cn } from '@/utils/utils'

export const HEADER_HEIGHT = 64

export function Header({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'sticky top-0 left-0 w-full bg-white text-black dark:bg-gray-900 dark:text-white z-[1]'
      )}
      style={{ height: HEADER_HEIGHT }}>
      {children}
    </div>
  )
}
