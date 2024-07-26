import { createContext } from 'react'

interface IEditorContext {
  isAiLoading: boolean
  aiError?: string | null
  setIsAiLoading: (loading: boolean) => void
  setAiError: (err: string | null) => void
  setAiToken: (token: string) => void
  setCollabToken: (token: string) => void
}

export const EditorContext = createContext<IEditorContext>({
  isAiLoading: false,
  aiError: null,
  setIsAiLoading: () => {},
  setAiError: () => {},
  setAiToken: () => {},
  setCollabToken: () => {},
})
