import { ReactNode } from 'react'

type ContentProps = {
  children: ReactNode
}

export function Content({ children }: ContentProps) {
  return <div className="flex-auto h-full">{children}</div>
}
