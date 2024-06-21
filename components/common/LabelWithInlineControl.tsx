import { cn } from '@/utils/utils'

type LabelWithInlineControlProps = {
  label: string
  control: React.ReactNode
  className?: string
}

export function LabelWithInlineControl({
  label,
  control,
  className = '',
}: LabelWithInlineControlProps) {
  return (
    <div className={cn('flex justify-between items-start gap-2', className)}>
      <p className="flex items-center space-x-2">{label}</p>
      {control}
    </div>
  )
}
