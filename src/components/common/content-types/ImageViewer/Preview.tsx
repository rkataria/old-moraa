import { Embed } from './Embed'

import { IFrame } from '@/types/frame.type'

type PreviewProps = {
  frame: IFrame
}

export function Preview({ frame }: PreviewProps) {
  return <Embed path={frame.config.path} />
}
