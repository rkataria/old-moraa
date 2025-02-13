import { useEffect } from 'react'

export function useConfirmReloadOrClose() {
  useEffect(() => {
    const unloadCallback = (event: BeforeUnloadEvent) => {
      event.preventDefault()

      return ''
    }

    window.addEventListener('beforeunload', unloadCallback)

    return () => window.removeEventListener('beforeunload', unloadCallback)
  }, [])
}
