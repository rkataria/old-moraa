import { useContext, useEffect, useMemo, useState } from 'react'

import { TiptapCollabProvider, WebSocketStatus } from '@hocuspocus/provider'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { Editor, useEditor } from '@tiptap/react'
import Ai from '@tiptap-pro/extension-ai'
import uniqBy from 'lodash.uniqby'

import { useSidebar } from './useSidebar'
import { EditorContext } from '../context/EditorContext'

import type { Doc as YDoc } from 'yjs'

import { EditorUser } from '@/components/tiptap/BlockEditor/types'
import { ExtensionKit } from '@/components/tiptap/extensions/extension-kit'
import { fetchTokens } from '@/services/tiptap.service'

const TIPTAP_AI_APP_ID = import.meta.env.VITE_TIPTAP_AI_APP_ID
const TIPTAP_AI_BASE_URL =
  import.meta.env.VITE_TIPTAP_AI_BASE_URL || 'https://api.tiptap.dev/v1/ai'

declare global {
  interface Window {
    editor: Editor | null
  }
}

export const useBlockEditor = ({
  aiToken,
  ydoc,
  provider,
  editorInfo,
  editable,
  setAiToken,
  setCollabToken,
}: {
  aiToken: string
  ydoc: YDoc
  provider?: TiptapCollabProvider | null | undefined
  editorInfo: { name: string; avatar: string }
  editable?: boolean
  setAiToken: (t: string) => void
  setCollabToken: (t: string) => void
}) => {
  const leftSidebar = useSidebar()
  const [collabState, setCollabState] = useState<WebSocketStatus>(
    WebSocketStatus.Connecting
  )
  const { setIsAiLoading, setAiError } = useContext(EditorContext)

  const resetTokens = async () => {
    const res = await fetchTokens()
    setAiToken(res.aiToken)
    setCollabToken(res.collabToken)
  }

  const collaborativeExtensions = [
    Collaboration.configure({
      document: ydoc,
    }),
    CollaborationCursor.configure({
      provider,
      user: { ...editorInfo, active: true },
    }),
  ]

  const collaboration = () => {
    if (!editable) {
      return [
        Collaboration.configure({
          document: ydoc,
        }),
      ]
    }

    return collaborativeExtensions
  }

  const editor = useEditor(
    {
      autofocus: true,
      // eslint-disable-next-line @typescript-eslint/no-shadow
      onCreate: ({ editor }) => {
        provider?.on('synced', () => {
          if (editor.isEmpty) {
            // editor.commands.setContent(initialContent)
          }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        provider?.on('authenticationFailed', (event: any) => {
          console.log('event', event)
          resetTokens()
        })
      },
      extensions: [
        ...ExtensionKit({
          provider,
        }),

        ...collaboration(),

        Ai.configure({
          appId: TIPTAP_AI_APP_ID,
          token: aiToken,
          baseUrl: TIPTAP_AI_BASE_URL,
          autocompletion: true,

          onLoading: () => {
            setIsAiLoading(true)
            setAiError(null)
          },

          onSuccess: () => {
            setIsAiLoading(false)
            setAiError(null)
          },

          onError: (error) => {
            setIsAiLoading(false)
            setAiError(error.message)
          },
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any,
      editable,
      editorProps: {
        attributes: {
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          class: 'min-h-full',
        },
      },
    },
    // removed provider dependency here, because it was causing error so found solution here https://github.com/ueberdosis/tiptap/issues/1451#issuecomment-1361417196
    [ydoc]
  )

  const users = useMemo(() => {
    if (!editor?.storage.collaborationCursor?.users) {
      return []
    }

    // TODO: same user is in the collaboration 3 times
    const uniqueUsers = uniqBy(
      editor.storage.collaborationCursor?.users,
      (user: EditorUser) => user.name
    ).filter((user) => !!user?.name)

    return uniqueUsers.map((user: EditorUser) => {
      const names = user.name?.split(' ')
      const firstName = names?.[0]
      const lastName = names?.[names.length - 1]
      const initials = `${firstName?.[0] || '?'}${lastName?.[0] || '?'}`

      return { ...user, initials: initials.length ? initials : '?' }
    })
  }, [editor?.storage.collaborationCursor?.users])

  const characterCount = editor?.storage.characterCount || {
    characters: () => 0,
    words: () => 0,
  }

  useEffect(() => {
    provider?.on('status', (event: { status: WebSocketStatus }) => {
      setCollabState(event.status)
    })
  }, [provider])

  window.editor = editor

  return { editor, users, characterCount, collabState, leftSidebar }
}
