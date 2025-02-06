import { cn } from '@/utils/utils'

type LabelWithInlineControlProps = {
  label: string
  control: React.ReactNode
  className?: string
  classNames?: {
    label?: string
    control?: string
  }
}

export function LabelWithInlineControl({
  label,
  control,
  className = '',
  classNames = {},
}: LabelWithInlineControlProps) {
  return (
    <div className={cn('flex justify-between items-center gap-2', className)}>
      <p
        className={cn('flex items-center space-x-2 text-xs', classNames.label)}>
        {label}
      </p>
      <div className={cn(classNames.control)}>{control}</div>
    </div>
  )
}
