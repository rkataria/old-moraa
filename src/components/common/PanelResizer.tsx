import { PanelResizeHandle } from 'react-resizable-panels'

import { cn } from '@/utils/utils'

export function PanelResizer({ className }: { className?: string }) {
  return (
    <PanelResizeHandle
      className={cn(
        'w-1.5 h-full bg-transparent relative cursor-col-resize group/panel-resizer mx-2',
        className
      )}>
      <div
        className="absolute left-1/2 -translate-x-1/2 w-2 rounded-full bg-transparent group-hover/panel-resizer:bg-black/50"
        style={{ top: '45%', height: '10%', width: '100%' }}
      />
    </PanelResizeHandle>
  )
}
