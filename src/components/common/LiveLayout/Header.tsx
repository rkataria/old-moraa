import { ReactNode } from '@tanstack/react-router'

type HeaderProps = {
  children: ReactNode
}

export function Header({ children }: HeaderProps) {
  return <div className="h-16 w-full flex-none">{children}</div>
}
