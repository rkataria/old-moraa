import { TextBlock } from '@/types/frame.type'
import { cn } from '@/utils/utils'

export function TextBlockView({ block }: { block: TextBlock }) {
  if (!block) return null

  return (
    <div
      style={{ wordBreak: 'break-word' }}
      key={`block-editor-${block.id}`}
      className={cn('w-full text-base', {
        'block-content-header': block.type === 'header',
        'block-content-paragraph': block.type === 'paragraph',
      })}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: block.data.html,
      }}
    />
  )
}
