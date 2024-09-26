import { ReactNode } from '@tanstack/react-router'

type RightSidebarProps = {
  children: ReactNode
}

export function RightSidebar({ children }: RightSidebarProps) {
  return <div className="flex-none h-full">{children}</div>
}
