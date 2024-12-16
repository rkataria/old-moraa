import { useEffect, useState } from 'react'

import ReactHowler from 'react-howler'

export function EchoPlayer() {
  const [sound, setSound] = useState('')
  const [play, setPlay] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlePlaySound = (e: any) => {
      setSound(e.detail.sound)
      setPlay(true)
    }

    window.addEventListener('sound_added', handlePlaySound)

    return () => window.removeEventListener('sound_added', handlePlaySound)
  }, [])

  if (!sound) return null

  return <ReactHowler src={sound} playing={play} onEnd={() => setPlay(false)} />
}
