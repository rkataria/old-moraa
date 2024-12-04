import { cn } from '@/utils/utils'

export function EmptyPlaceholder({
  isDraggingOver,
}: {
  isDraggingOver: boolean
}) {
  return (
    <div
      className={cn(
        'w-full h-24 rounded-md flex items-center justify-center text-gray-500',
        {
          'border-2 border-dashed border-gray-200': !isDraggingOver,
          'bg-gray-50': isDraggingOver,
        }
      )}>
      {isDraggingOver ? 'Drop here' : 'No participants'}
    </div>
  )
}
