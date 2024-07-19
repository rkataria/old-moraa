import { IFrame } from '@/types/frame.type'

interface MiroEmbedProps {
  frame: IFrame & {
    content: {
      boardId: string
    }
  }
}

export function MiroEmbed({ frame }: MiroEmbedProps) {
  return (
    <iframe
      title="miro-embed"
      width="100%"
      height="100%"
      src={`https://miro.com/app/live-embed/${frame.content.boardId}`}
      allowFullScreen
    />
  )
}
