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
        threshold: -40,
        play: false,
      })

      speechEvents.on('speaking', handleSpeaking)

      speechEvents.on('stopped_speaking', handleStoppedSpeaking)
    }

    detectSpeaking()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detect])

  const handleSpeaking = () => {
    if (!detect) {
      setSpeaking(false)

      return
    }
    setSpeaking(true)
  }

  const handleStoppedSpeaking = () => {
    setSpeaking(false)
  }

  return {
    isSpeaking: speaking,
  }
}
