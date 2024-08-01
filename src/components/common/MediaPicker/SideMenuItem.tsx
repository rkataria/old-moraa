/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import { cn } from '@/utils/utils'

/* eslint-disable jsx-a11y/click-events-have-key-events */
export function SideMenuItem({
  icon,
  label,
  active,
  disabled,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <li
      className={cn(
        'flex justify-start items-center gap-2 p-1.5 rounded-md cursor-pointer hover:bg-primary-50',
        {
          'bg-primary-50': active,
          'text-gray-400 hover:bg-transparent cursor-default': disabled,
        }
      )}
      onClick={() => {
        if (!disabled) {
          onClick()
        }
      }}>
      {icon}
      <span>{label}</span>
    </li>
  )
}
