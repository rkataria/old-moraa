import { ReactNode } from 'react'

interface IEmptyPlaceholder {
  label: string
  description: string
  icon: ReactNode
  endContent?: ReactNode
}

export function EmptyPlaceholder({
  label,
  description,
  endContent,
  icon,
}: IEmptyPlaceholder) {
  return (
    <div className="grid place-items-center w-full h-full">
      <div className="flex flex-col items-center">
        <div className="relative">{icon}</div>

        <p className="text-slate-600 font-medium text-3xl tracking-tight my-4">
          {label}
        </p>
        <p className="text-slate-400 tracking-tight">{description}</p>
        {endContent}
      </div>
    </div>
  )
}
