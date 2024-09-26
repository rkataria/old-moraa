import { ReactNode } from '@tanstack/react-router'

type HeaderProps = {
  children: ReactNode
}

export function Header({ children }: HeaderProps) {
  return <div className="h-14 w-full flex-none">{children}</div>
}
