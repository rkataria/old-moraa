import { IFrame } from '@/types/frame.type'

interface EmbedProps {
  frame: IFrame & {
    content: {
      boardId: string
    }
  }
}

export function Embed({ frame }: EmbedProps) {
  return (
    <iframe
      title="miro-embed"
      width="100%"
      height="100%"
      className="border border-gray-200 bg-[#FEFEFE] rounded-md"
      src={`https://miro.com/app/live-embed/${frame.content.boardId}`}
      allowFullScreen
    />
  )
}
