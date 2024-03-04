'use client'

import { useState, useEffect } from 'react'

export const useHotkeys = (keys: string, callback: () => void) => {
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === keys) {
        setPressed(true)
        callback()
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === keys) {
        setPressed(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [keys, callback])

  return pressed
}
