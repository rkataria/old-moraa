import { IconLayoutGrid, IconList } from '@tabler/icons-react'

import { Tooltip } from '@nextui-org/react'

import { cn } from '@/utils/utils'

export type AgendaSlideDisplayType = 'thumbnail' | 'list'

export function DisplayTypeSwitcher({
  displayType,
  onDisplayTypeChange,
}: {
  displayType: AgendaSlideDisplayType
  onDisplayTypeChange: (view: AgendaSlideDisplayType) => void
}) {
  return (
    <div className="flex items-center gap-4 justify-end w-full pb-4">
      <Tooltip content="Thumbnail View">
        <IconLayoutGrid
          className={cn('h-6 w-6 cursor-pointer hover:text-slate-500', {
            'text-slate-500': displayType === 'thumbnail',
            'text-slate-300': displayType !== 'thumbnail',
          })}
          onClick={() => onDisplayTypeChange('thumbnail')}
        />
      </Tooltip>
      <Tooltip content="List View">
        <IconList
          className={cn('h-6 w-6 cursor-pointer hover:text-slate-500', {
            'text-slate-500': displayType === 'list',
            'text-slate-300': displayType !== 'list',
          })}
          onClick={() => onDisplayTypeChange('list')}
        />
      </Tooltip>
    </div>
  )
}
