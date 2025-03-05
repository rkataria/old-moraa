import { cn } from '@/utils/utils'

type ToolButtonProps = {
  icon: React.ReactNode
  isActive?: boolean
  onClick: () => void
  label: string
}

export function ToolButton({
  icon,
  isActive,
  onClick,
  label,
}: ToolButtonProps) {
  return (
    // eslint-disable-next-line react/button-has-type
    <button
      className={cn('p-2 rounded-md hover:bg-gray-100 transition-colors', {
        'bg-blue-100 text-blue-600': isActive,
        'text-gray-700': !isActive,
      })}
      onClick={onClick}
      title={label}>
      {icon}
    </button>
  )
}
