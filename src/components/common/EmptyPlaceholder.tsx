import { ReactNode } from 'react'

type EmptyPlaceholder = {
  icon: ReactNode
  title: string
  description: string
  actionButton?: ReactNode
}

export function EmptyPlaceholder({
  icon,
  title,
  description,
  actionButton,
}: EmptyPlaceholder) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-2">
      <div className="relative">{icon}</div>
      <p className="text-2xl font-semibold">{title}</p>
      <p className="text-gray-600">{description}</p>
      <div className="pt-4">{actionButton}</div>
    </div>
  )
}
