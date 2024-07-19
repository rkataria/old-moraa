import { Tooltip } from '@nextui-org/react'
import { IconLayoutGrid, IconList } from '@tabler/icons-react'

import { cn } from '@/utils/utils'

export type AgendaFrameDisplayType = 'thumbnail' | 'list'

export function DisplayTypeSwitcher({
  displayType,
  onDisplayTypeChange,
}: {
  displayType: AgendaFrameDisplayType
  onDisplayTypeChange: (view: AgendaFrameDisplayType) => void
}) {
  return (
    <div className="flex justify-center items-center gap-2">
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
