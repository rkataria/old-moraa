import { ReactNode } from 'react'

import 'iframe-resizer/js/iframeResizer.contentWindow'
import { Content, Editor as TiptapEditor } from '@tiptap/core'

import { Loading } from '../../Loading'
import { getAvatar, getProfileName, IUserProfile } from '../../UserAvatar'

import { BlockEditor } from '@/components/tiptap/BlockEditor'
import { useProfile } from '@/hooks/useProfile'
import { useStoreSelector } from '@/hooks/useRedux'
import { useRichText } from '@/hooks/useRichText'
import { cn, getUniqueColor } from '@/utils/utils'

export interface AiState {
  isAiLoading: boolean
  aiError?: string | null
}

type EditorProps = {
  editorId: string
  editable?: boolean
  showHeader?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  classNames?: any
  startContent?: ReactNode
  hideSideBar?: boolean
  initalContent?: Content
  enableCollaboration?: boolean
  onEmptyContent?: (editor: TiptapEditor) => void
}

export function Editor({
  editorId,
  editable = true,
  showHeader = true,
  classNames,
  startContent,
  hideSideBar,
  initalContent,
  enableCollaboration = false,
  onEmptyContent,
}: EditorProps) {
  const room = editorId

  const userId = useStoreSelector((state) => state.user.currentUser.user?.id)

  const { provider, aiToken, collabToken, ydoc, setCollabToken, setAiToken } =
    useRichText(room)

  const { data: profile, isLoading: isLoadingProfile } = useProfile()

  const name = getProfileName(profile as IUserProfile)
  const avatar = getAvatar(profile as IUserProfile)

  if (!collabToken || !provider || !aiToken) return null

  if (isLoadingProfile) {
    return <Loading />
  }

  return (
    <div className={cn('flex h-full', classNames?.wrapper)}>
      <BlockEditor
        aiToken={aiToken}
        ydoc={ydoc}
        hasCollab={enableCollaboration}
        provider={provider}
        editorInfo={{
          name,
          avatar,
          color: getUniqueColor(userId as string),
        }}
        editable={editable}
        setAiToken={setAiToken}
        setCollabToken={setCollabToken}
        showHeader={showHeader}
        classNames={classNames}
        onEmptyContent={onEmptyContent}
        startContent={startContent}
        hideSideBar={hideSideBar}
        initialContent={initalContent}
        editorId={editorId}
      />
    </div>
  )
}
