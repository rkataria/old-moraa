import { ISlide } from '@/types/slide.type'

interface MiroEmbedProps {
  slide: ISlide & {
    content: {
      boardId: string
    }
  }
}

export function MiroEmbed({ slide }: MiroEmbedProps) {
  return (
    <iframe
      title="miro-embed"
      width="100%"
      height="100%"
      src={`https://miro.com/app/live-embed/${slide.content.boardId}`}
      allowFullScreen
    />
  )
}
