import { PanelResizeHandle } from 'react-resizable-panels'

import { cn } from '@/utils/utils'

export function PanelResizer({
  direction = 'horizontal',
}: {
  direction?: 'vertical' | 'horizontal'
}) {
  return (
    <PanelResizeHandle
      className={cn(
        'bg-transparent relative cursor-col-resize group/panel-resizer',
        {
          'w-1.5 h-full mx-2': direction === 'horizontal',
          'h-1.5 w-full my-2': direction === 'vertical',
        }
      )}>
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full bg-transparent group-hover/panel-resizer:bg-black/50"
        style={
          direction === 'horizontal'
            ? { top: '45%', height: '10%', width: '100%' }
            : { left: '45%', width: '10%', height: '100%' }
        }
      />
    </PanelResizeHandle>
  )
}
