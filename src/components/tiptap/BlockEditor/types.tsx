import { ReactNode } from 'react'

import { TiptapCollabProvider } from '@hocuspocus/provider'
import { Content, Editor } from '@tiptap/core'
import { Language } from '@tiptap-pro/extension-ai'

import type { Doc as YDoc } from 'yjs'

export interface TiptapProps {
  aiToken: string
  hasCollab: boolean
  ydoc: YDoc
  provider?: TiptapCollabProvider | null | undefined
  editorInfo: { name: string; avatar: string }
  editable?: boolean
  setAiToken: (token: string) => void
  setCollabToken: (token: string) => void
  showHeader?: boolean
  onEmptyContent?: (editor: Editor) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  classNames?: any
  startContent?: ReactNode
  hideSideBar?: boolean
  initialContent?: Content
}

export type EditorUser = {
  clientId: string
  name: string
  color: string
  initials?: string
  avatar?: string
}

export type LanguageOption = {
  name: string
  label: string
  value: Language
}

export type AiTone =
  | 'academic'
  | 'business'
  | 'casual'
  | 'childfriendly'
  | 'conversational'
  | 'emotional'
  | 'humorous'
  | 'informative'
  | 'inspirational'
  | string

export type AiPromptType = 'SHORTEN' | 'EXTEND' | 'SIMPLIFY' | 'TONE'

export type AiToneOption = {
  name: string
  label: string
  value: AiTone
}

export type AiImageStyle = {
  name: string
  label: string
  value: string
}
