import { TextBlock } from '@/types/slide.type'
import { cn } from '@/utils/utils'

export function TextBlockView({ textBlocks }: { textBlocks: TextBlock[] }) {
  return (
    <div className="h-full w-full flex flex-col justify-center items-start">
      {textBlocks.map((block) => (
        <div
          key={`block-editor-${block.id}`}
          className={cn('w-full', {
            'block-content-header': block.type === 'header',
            'block-content-paragraph': block.type === 'paragraph',
          })}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: block.data.html,
          }}
        />
      ))}
    </div>
  )
}
