import { useEffect, useState } from 'react'

import hark from 'hark'

export function useDetectSpeaking({ detect }: { detect: boolean }) {
  const [speaking, setSpeaking] = useState<boolean>(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    let speechEvents: hark.Harker | null = null

    const startDetection = async () => {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })
        setStream(audioStream)

        speechEvents = hark(audioStream, {
          interval: 200,
          threshold: -50,
          play: false,
        })

        speechEvents.on('speaking', () => {
          if (detect) {
            setSpeaking(true)
          }
        })

        speechEvents.on('stopped_speaking', () => {
          setSpeaking(false)
        })
      } catch (error) {
        console.error('Microphone access error:', error)
      }
    }

    if (detect) {
      startDetection()
    }

    return () => {
      speechEvents?.stop()
      stream?.getTracks().forEach((track) => track.stop())
      setStream(null)
      setSpeaking(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detect])

  return { isSpeaking: speaking }
}
