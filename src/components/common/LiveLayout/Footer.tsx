import { ReactNode } from '@tanstack/react-router'

type FooterProps = {
  children: ReactNode
}

export function Footer({ children }: FooterProps) {
  return <div className="h-16 w-full flex-none">{children}</div>
}
