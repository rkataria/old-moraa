/* eslint-disable jsx-a11y/no-static-element-interactions */

import { cn } from '@/utils/utils'

/* eslint-disable jsx-a11y/click-events-have-key-events */
export function AppsDropdownMenuItem({
  icon,
  title,
  description,
  disabled,
  onClick,
}: {
  icon: JSX.Element
  title: string
  description: string
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <div
      className={cn(
        'flex-none w-full p-1 flex justify-start items-center gap-2 rounded-[10px] border-1.5 border-transparent ',
        {
          'cursor-pointer hover:border-primary-100': !disabled,
          'cursor-not-allowed': disabled,
        }
      )}
      onClick={onClick}>
      <div
        className={cn(
          'w-8 h-8 aspect-square rounded-md  flex justify-center items-center',
          {
            'bg-live text-gray-700': !disabled,
            'bg-gray-100 text-gray-300': disabled,
          }
        )}>
        {icon}
      </div>
      <div className="flex-auto">
        <h4
          className={cn('text-xs font-semibold', {
            'text-gray-700': !disabled,
            'text-gray-300': disabled,
          })}>
          {title}
        </h4>
        <p
          className={cn('text-xs font-light', {
            'text-gray-400': !disabled,
            'text-gray-300': disabled,
          })}>
          {description}
        </p>
      </div>
    </div>
  )
}
