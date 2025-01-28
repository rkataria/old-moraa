import { FrameNoContentPlaceholder } from '../../FrameNoContentPlaceholder'
import { FrameTitleDescriptionPreview } from '../../FrameTitleDescriptionPreview'
import { RenderIf } from '../../RenderIf/RenderIf'
import { Editor } from '../RichText/Editor'

import { IFrame } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'

export function Thumbnail({ frame }: { frame: IFrame }) {
  const showPlaceholder = !frame.content?.title && !frame.content?.description

  return (
    <div className="w-full h-full">
      <RenderIf isTrue={showPlaceholder}>
        <FrameNoContentPlaceholder frameTyp={FrameType.MORAA_PAD} />
      </RenderIf>
      <RenderIf isTrue={!showPlaceholder}>
        <FrameTitleDescriptionPreview frame={frame} key={frame.id} />
        <Editor
          hideSideBar
          editorId={frame.id}
          editable={false}
          enableCollaboration
          classNames={{
            wrapper: 'overflow-hidden',
            container: 'flex flex-col overflow-hidden',
          }}
        />
      </RenderIf>
    </div>
  )
}
