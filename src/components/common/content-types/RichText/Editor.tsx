import { useEffect, useMemo, useState } from 'react'

import { TiptapCollabProvider } from '@hocuspocus/provider'
import 'iframe-resizer/js/iframeResizer.contentWindow'
import { Doc as YDoc } from 'yjs'

import { Loading } from '../../Loading'
import { getAvatar, getProfileName } from '../../UserAvatar'

import { BlockEditor } from '@/components/tiptap/BlockEditor'
import { useProfile } from '@/hooks/useProfile'
import { fetchTokens } from '@/services/tiptap.service'
import { IFrame } from '@/types/frame.type'

export interface AiState {
  isAiLoading: boolean
  aiError?: string | null
}

export function RichTextEditor({
  frame,
  editable = true,
}: {
  frame: IFrame
  editable?: boolean
}) {
  const [provider, setProvider] = useState<TiptapCollabProvider | null>(null)
  const [collabToken, setCollabToken] = useState<string | null>(null)
  const [aiToken, setAiToken] = useState<string | null>(null)

  const { data: profile, isLoading: isLoadingProfile } = useProfile()

  const name = getProfileName(profile)
  const avatar = getAvatar(profile)

  const room = frame.id

  const ydoc = useMemo(() => new YDoc(), [])

  const getTokens = async () => {
    const tokenResponse = await fetchTokens()
    setAiToken(tokenResponse.aiToken)
    setCollabToken(tokenResponse.collabToken)
  }

  useEffect(() => {
    const storedAiToken = localStorage.getItem('tiptap-ai-token')
    const storedCollabToken = localStorage.getItem('tiptap-collab-token')
    if (!storedAiToken || !storedCollabToken) {
      getTokens()

      return
    }
    setAiToken(storedAiToken)
    setCollabToken(storedCollabToken)
  }, [])

  useEffect(() => {
    if (collabToken) {
      setProvider(
        new TiptapCollabProvider({
          name: `${import.meta.env.VITE_COLLAB_DOC_PREFIX}${room}`,
          appId: import.meta.env.VITE_TIPTAP_COLLAB_APP_ID ?? '',
          token: collabToken,
          document: ydoc,
        })
      )
    }
  }, [setProvider, collabToken, ydoc, room])

  if (!collabToken || !provider || !aiToken) return null

  if (isLoadingProfile) {
    return <Loading />
  }

  return (
    <div className="flex h-full overflow-hidden">
      <BlockEditor
        aiToken={aiToken}
        ydoc={ydoc}
        hasCollab
        provider={provider}
        editorInfo={{ name, avatar }}
        editable={editable}
        setAiToken={setAiToken}
        setCollabToken={setCollabToken}
      />
    </div>
  )
}
