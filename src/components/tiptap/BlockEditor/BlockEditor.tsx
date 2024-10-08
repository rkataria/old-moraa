// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useMemo, useRef } from 'react'

import { EditorContent, PureEditorContent } from '@tiptap/react'
import { createPortal } from 'react-dom'

import { EditorHeader } from './components/EditorHeader'
import { TiptapProps } from './types'
import { ContentItemMenu } from '../menus/ContentItemMenu'
import { TextMenu } from '../menus/TextMenu'
import { Icon } from '../ui/Icon'
import { Toolbar } from '../ui/Toolbar'

import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { EditorContext } from '@/components/tiptap/context/EditorContext'
import ImageBlockMenu from '@/components/tiptap/extensions/ImageBlock/components/ImageBlockMenu'
import { ColumnsMenu } from '@/components/tiptap/extensions/MultiColumn/menus'
import {
  TableColumnMenu,
  TableRowMenu,
} from '@/components/tiptap/extensions/Table/menus'
import { useAIState } from '@/components/tiptap/hooks/useAIState'
import { useBlockEditor } from '@/components/tiptap/hooks/useBlockEditor'
import { LinkMenu } from '@/components/tiptap/menus'
import { Sidebar } from '@/components/tiptap/Sidebar'
import { Loader } from '@/components/tiptap/ui/Loader'
import '@/styles/tiptap/animations.css'
import '@/styles/tiptap/blocks.css'
import '@/styles/tiptap/code.css'
import '@/styles/tiptap/collab.css'
import '@/styles/tiptap/index.css'
import '@/styles/tiptap/list.css'
import '@/styles/tiptap/placeholder.css'
import '@/styles/tiptap/table.css'
import '@/styles/tiptap/typography.css'
import { cn } from '@/utils/utils'

export function BlockEditor({
  aiToken,
  ydoc,
  provider,
  editorInfo,
  editable,
  setAiToken,
  setCollabToken,
  showHeader = true,
  classNames,
  onEmptyContent,
  startContent,
  hideSideBar,
  initialContent,
}: TiptapProps) {
  const aiState = useAIState()
  const menuContainerRef = useRef(null)
  const editorRef = useRef<PureEditorContent | null>(null)

  const { editor, users, characterCount, collabState, leftSidebar } =
    useBlockEditor({
      aiToken,
      ydoc,
      provider,
      editorInfo,
      editable,
      setCollabToken,
      setAiToken,
      onEmptyContent,
      initialContent,
    })

  const displayedUsers = users.slice(0, 3)

  const providerValue = useMemo(
    () => ({
      isAiLoading: aiState.isAiLoading,
      aiError: aiState.aiError,
      setIsAiLoading: aiState.setIsAiLoading,
      setAiError: aiState.setAiError,
    }),
    [aiState]
  )

  if (providerValue.isAiLoading) {
    return <Loader />
  }

  if (!editor) {
    return null
  }

  const aiLoaderPortal = createPortal(
    <Loader label="AI is now doing its job." />,
    document.body
  )

  if (!editable) {
    return (
      <>
        <div
          className={cn('flex flex-col', {
            'border-r': leftSidebar.isOpen,
          })}>
          <RenderIf isTrue={!hideSideBar}>
            <div className="flex items-center gap-1">
              <Toolbar.Button
                tooltip={leftSidebar.isOpen ? 'Close sidebar' : 'Open sidebar'}
                onClick={() => {
                  leftSidebar.toggle()
                }}
                active={leftSidebar.isOpen}>
                <div>
                  <Icon
                    name={leftSidebar.isOpen ? 'PanelLeftClose' : 'PanelLeft'}
                  />
                </div>
              </Toolbar.Button>
              <RenderIf isTrue={leftSidebar.isOpen}>
                <p className="font-medium">Table of contents</p>
              </RenderIf>
            </div>

            <Sidebar
              isOpen={leftSidebar.isOpen}
              onClose={leftSidebar.close}
              editor={editor}
              editorRef={editorRef}
            />
          </RenderIf>
        </div>
        <div
          className={cn('flex flex-col w-full', {
            'ml-4': leftSidebar.isOpen,
          })}>
          <EditorContent
            id="editor-preview"
            editor={editor}
            ref={editorRef}
            className={cn(
              'flex-1 overflow-y-auto scrollbar-thin',
              classNames?.editorInPreview,
              {
                'px-[15%]': !leftSidebar.isOpen && !hideSideBar,
              }
            )}>
            {startContent}
          </EditorContent>
        </div>
      </>
    )
  }

  return (
    <EditorContext.Provider value={providerValue}>
      <div className="flex w-full h-full gap-2" ref={menuContainerRef}>
        <RenderIf isTrue={showHeader}>
          <Sidebar
            isOpen={leftSidebar.isOpen}
            onClose={leftSidebar.close}
            editor={editor}
            editorRef={editorRef}
          />
        </RenderIf>

        <div
          className={cn(
            'relative w-full h-full border bg-[#FEFEFE] rounded-md p-0 flex flex-col',
            classNames?.container
          )}>
          <RenderIf isTrue={showHeader}>
            <EditorHeader
              characters={characterCount.characters()}
              collabState={collabState}
              users={displayedUsers}
              words={characterCount.words()}
              isSidebarOpen={leftSidebar.isOpen}
              toggleSidebar={leftSidebar.toggle}
              hideSidebar={hideSideBar}
            />
          </RenderIf>

          <EditorContent
            id="ai-page-editor"
            editor={editor}
            ref={editorRef}
            className={cn(
              'overflow-y-auto w-full pl-[3.625rem] scrollbar-thin pt-6 pb-[5rem] h-full',
              classNames?.editor
            )}
          />
          <ContentItemMenu editor={editor} classnames={classNames} />
          <LinkMenu editor={editor} appendTo={menuContainerRef} />
          <TextMenu editor={editor} />
          <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
          <TableRowMenu editor={editor} appendTo={menuContainerRef} />
          <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
          <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
        </div>
      </div>
      {aiState.isAiLoading && aiLoaderPortal}
    </EditorContext.Provider>
  )
}
