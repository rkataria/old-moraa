/* eslint-disable jsx-a11y/no-static-element-interactions */

import { cn } from '@/utils/utils'

/* eslint-disable jsx-a11y/click-events-have-key-events */
export function AppsDropdownMenuItem({
  icon,
  title,
  description,
  onClick,
}: {
  icon: JSX.Element
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <div
      className={cn(
        'flex-none w-full p-1 flex justify-start items-center gap-2 rounded-[10px] border-1.5 border-transparent hover:border-primary-100 cursor-pointer'
      )}
      onClick={onClick}>
      <div className="w-8 h-8 aspect-square rounded-md bg-live flex justify-center items-center">
        {icon}
      </div>
      <div className="flex-auto">
        <h4 className="text-xs font-semibold">{title}</h4>
        <p className="text-xs font-light text-gray-400">{description}</p>
      </div>
    </div>
  )
}
