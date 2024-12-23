import { useEffect, useState } from 'react'

// eslint-disable-next-line import/no-extraneous-dependencies
import hark from 'hark'

export function useDetectSpeaking({ detect }: { detect: boolean }) {
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    if (!detect) {
      setSpeaking(false)
    }

    const detectSpeaking = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })

      const speechEvents = hark(stream, {
        interval: 500,
        // threshold: -65,
        // play: false,
      })

      speechEvents.on('speaking', () => {
        setSpeaking(true)
      })

      speechEvents.on('stopped_speaking', () => {
        setSpeaking(false)
      })
    }

    detectSpeaking()
  }, [detect])

  return {
    isSpeaking: speaking,
  }
}
