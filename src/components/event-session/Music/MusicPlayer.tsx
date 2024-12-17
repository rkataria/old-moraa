import ReactHowler from 'react-howler'

import { tracks } from './MusicControls'

import { useStoreSelector } from '@/hooks/useRedux'

export function MusicPlayer() {
  const session = useStoreSelector(
    (store) => store.event.currentEvent.liveSessionState.activeSession.data!
  )

  const music = session?.data?.music

  return (
    <ReactHowler
      src={music?.track || tracks[0].path}
      playing={!!music?.play}
      volume={music?.volume}
      mute={music?.mute}
    />
  )
}
