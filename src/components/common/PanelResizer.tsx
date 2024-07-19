import { PanelResizeHandle } from 'react-resizable-panels'

import { cn } from '@/utils/utils'

export function PanelResizer({ className }: { className?: string }) {
  return (
    <PanelResizeHandle
      className={cn(
        'w-1.5 h-full bg-transparent relative cursor-col-resize hover:bg-opacity-10 hover:bg-black',
        className
      )}>
      <div
        className="absolute left-1/2 transform -translate-x-1/2 w-full rounded-full bg-gray-600"
        style={{ top: '45%', height: '10%', width: '100%' }}
      />
    </PanelResizeHandle>
  )
}
