import { RichTextEditor } from '../RichText/Editor'

import { IFrame } from '@/types/frame.type'

type MoraaPadProps = {
  frame: IFrame
  readonly?: boolean
}

export function MoraaPad({ frame, readonly = false }: MoraaPadProps) {
  return (
    <RichTextEditor
      hideSideBar
      editorId={frame.id}
      editable={!readonly}
      enableCollaboration
      classNames={{
        wrapper: 'overflow-hidden',
        container: 'flex flex-col overflow-hidden',
      }}
    />
  )
}
