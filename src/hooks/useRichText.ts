/* eslint-disable consistent-return */
import { useEffect, useMemo, useState } from 'react'

import { TiptapCollabProvider } from '@hocuspocus/provider'
import { v4 as uuidv4 } from 'uuid'
import { Doc as YDoc } from 'yjs'

import { fetchTokens } from '@/services/tiptap.service'

export interface Page {
  id: string
  name: string
}

export const useRichText = (room: string) => {
  const [provider, setProvider] = useState<TiptapCollabProvider | null>(null)
  const [collabToken, setCollabToken] = useState<string | null>(null)
  const [pages, setPages] = useState<{ id: string; name: string }[]>([])
  const [activePage, changeActivePage] = useState(room)
  const [aiToken, setAiToken] = useState<string | null>(null)
  const [showPages, setShowPages] = useState(false)
  const ydoc = useMemo(() => new YDoc({ guid: room }), [room])

  useEffect(() => {
    changeActivePage(room)
  }, [room])

  const getTokens = async () => {
    const tokenResponse = await fetchTokens()
    setAiToken(tokenResponse.aiToken)
    setCollabToken(tokenResponse.collabToken)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pagesMap: any = useMemo(() => {
    const map = ydoc.getMap('pages')
    if (!map.has(room)) {
      map.set(room, { id: room, name: 'Doc 1' })
    }

    return map
  }, [ydoc, room])

  const addPage = () => {
    const id = uuidv4()
    pagesMap.set(id, { id, name: `Doc ${pages.length + 1}` })
    changeActivePage(id)
  }

  const renamePage = ({ id, name }: Page) => {
    const existingPage = pagesMap.get(id)
    if (existingPage) {
      pagesMap.set(id, { ...existingPage, name })
    }
  }

  const deletePage = (id: string) => {
    if (pagesMap.has(id)) {
      pagesMap.delete(id)
      if (activePage === id && pages.length > 0) {
        changeActivePage(pages[0].id)
      }
    }
  }

  const toggleShowPages = () => {
    setShowPages(!showPages)
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
    if (!collabToken) return

    const newProvider = new TiptapCollabProvider({
      name: `${import.meta.env.VITE_COLLAB_DOC_PREFIX}${room}`,
      appId: import.meta.env.VITE_TIPTAP_COLLAB_APP_ID ?? '',
      token: collabToken,
      document: ydoc,
    })

    setProvider(newProvider)

    return () => {
      newProvider.destroy()
      setProvider(null)
    }
  }, [collabToken, ydoc, room])

  useEffect(() => {
    const updatePages = () => {
      setPages(Array.from(pagesMap.values()))
    }

    pagesMap.observe(updatePages)

    updatePages()

    return () => pagesMap.unobserve(updatePages)
  }, [pagesMap])

  return {
    provider,
    aiToken,
    collabToken,
    pages,
    activePage,
    showPages,
    ydoc,
    setCollabToken,
    setAiToken,
    addPage,
    renamePage,
    changeActivePage,
    toggleShowPages,
    deletePage,
  }
}
