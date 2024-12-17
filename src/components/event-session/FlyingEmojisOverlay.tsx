import { useCallback, useEffect, useRef } from 'react'

export function FlyingEmojisOverlay() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const overlayRef = useRef<any>()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRemoveFlyingEmoji = useCallback((node: any) => {
    if (!overlayRef.current) return
    overlayRef.current.removeChild(node)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSendFlyingEmoji = (e: any) => {
      if (!overlayRef.current) {
        return
      }
      const { emoji, name } = e.detail
      const emojiDiv = document.createElement('div')

      const emojiElement = document.createElement('em-emoji')
      emojiElement.setAttribute('id', emoji)
      emojiElement.setAttribute('size', '40')
      emojiElement.setAttribute('set', 'apple')

      const pElement = document.createElement('p')
      pElement.textContent = name
      pElement.style.cssText =
        'color:white; font-size:12px; padding:8px; background:rgba(0,0,0,0.3); border-radius:8px; min-width:max-content; margin-top:4px;backdrop-filter:blur(4px);'

      emojiDiv.appendChild(emojiElement)
      emojiDiv.appendChild(pElement)

      emojiDiv.className = 'emoji fire-up'
      emojiDiv.style.left = `${Math.floor(Math.random() * (80 - 20 + 1)) + 20}%`
      emojiDiv.style.display = 'grid'
      emojiDiv.style.textAlign = 'center'

      overlayRef.current.appendChild(emojiDiv)

      emojiDiv.addEventListener('animationend', (event) => {
        if (
          event.animationName === 'fadeaway' &&
          overlayRef.current?.contains(event.target)
        ) {
          handleRemoveFlyingEmoji(event.target)
        }
      })
    }

    window.addEventListener('reaction_added', handleSendFlyingEmoji)

    return () =>
      window.removeEventListener('reaction_added', handleSendFlyingEmoji)
  }, [handleRemoveFlyingEmoji])

  return <div className="flying-emojis" ref={overlayRef} />
}
