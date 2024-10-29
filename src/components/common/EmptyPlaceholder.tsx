import { ReactNode } from 'react'

import { cn } from '@/utils/utils'

type EmptyPlaceholder = {
  icon: ReactNode
  title: string
  description: string
  actionButton?: ReactNode
  classNames?: Record<string, string>
}

export function EmptyPlaceholder({
  icon,
  title,
  description,
  actionButton,
  classNames = {},
}: EmptyPlaceholder) {
  return (
    <div
      className={cn(
        'w-full h-full flex flex-col justify-center items-center gap-2',
        classNames.wrapper
      )}>
      <div className={cn('relative', classNames.icon)}>{icon}</div>
      <p className={cn('text-2xl font-semibold', classNames.title)}>{title}</p>
      <p className={cn('text-gray-600', classNames.description)}>
        {description}
      </p>
      <div className={cn('pt-4', classNames.actionButton)}>{actionButton}</div>
    </div>
  )
}
