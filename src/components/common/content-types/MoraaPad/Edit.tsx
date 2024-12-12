import { Button } from '@nextui-org/button'
import { cn } from '@nextui-org/react'
import {
  TbLayoutSidebarRightCollapse,
  TbLayoutSidebarRightExpand,
} from 'react-icons/tb'

import { RenderIf } from '../../RenderIf/RenderIf'
import { Editor } from '../RichText/Editor'

import { FrameTitleDescriptionPanel } from '@/components/event-content/FrameTitleDescriptionPanel'
import { Documents } from '@/components/tiptap/Sidebar/Documents'
import { useRichText } from '@/hooks/useRichText'
import { IFrame } from '@/types/frame.type'

type EditProps = {
  frame: IFrame
}

export function Edit({ frame }: EditProps) {
  const {
    showPages,
    pages,
    activePage,
    toggleShowPages,
    changeActivePage,
    addPage,
    renamePage,
    deletePage,
  } = useRichText(frame.id)

  return (
    <>
      <FrameTitleDescriptionPanel key={frame.id} />
      <div
        className={cn(
          'grid grid-cols-[265px_auto] items-start gap-2 h-full overflow-hidden duration-300',
          {
            'grid-cols-[1fr]': !showPages,
          }
        )}>
        <RenderIf isTrue={showPages}>
          <Documents
            pages={pages}
            activePage={activePage}
            deletePage={deletePage}
            addPage={addPage}
            handlePageChange={changeActivePage}
            renamePage={renamePage}
          />
        </RenderIf>

        <div className="relative w-full h-full duration-300 overflow-auto scrollbar-none">
          <Button
            className="absolute left-4 top-4 z-[51] rounded-lg text-gray-600"
            isIconOnly
            size="sm"
            variant="light"
            onClick={toggleShowPages}>
            {showPages ? (
              <TbLayoutSidebarRightCollapse size={18} />
            ) : (
              <TbLayoutSidebarRightExpand size={18} />
            )}
          </Button>
          <Editor
            editorId={activePage}
            editable
            hideSideBar
            enableCollaboration
            classNames={{
              wrapper: 'overflow-hidden w-full',
              container: 'flex flex-col overflow-hidden',
            }}
          />
        </div>
      </div>
    </>
  )
}
