import { useEffect, useState } from 'react'

import { Button } from '@heroui/button'
import { Select, SelectItem, Slider } from '@heroui/react'
import { useDebounce } from '@uidotdev/usehooks'
import isEqual from 'lodash.isequal'
import { FaPlay, FaPause } from 'react-icons/fa'
import { IoVolumeMedium, IoVolumeMute } from 'react-icons/io5'

import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { updateMeetingSessionDataAction } from '@/stores/slices/event/current-event/live-session.slice'

export const tracks = [
  { key: 'study', name: 'Study Track', path: '/audios/study-track.mp3' },
  { key: 'library', name: 'Library Track', path: '/audios/library-track.mp3' },
  {
    key: 'education',
    name: 'Education Track',
    path: '/audios/education-track.mp3',
  },
]

export function MusicControls() {
  const dispatch = useStoreDispatch()

  const session = useStoreSelector(
    (store) => store.event.currentEvent.liveSessionState.activeSession.data!
  )
  const [playerControls, setPlayerControls] = useState(session.data?.music)
  const debouncedControlsChange = useDebounce(playerControls, 500)

  const currentMusic = session.data?.music
  const selectedTrack = currentMusic?.track || tracks[0].path

  useEffect(() => {
    if (isEqual(playerControls, currentMusic)) return

    dispatch(
      updateMeetingSessionDataAction({
        music: debouncedControlsChange,
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedControlsChange])

  return (
    <>
      <div className="flex items-center gap-1 mt-1">
        <Select
          selectedKeys={new Set([selectedTrack])}
          onSelectionChange={(selected) => {
            const track = Array.from(selected)[0] as string
            dispatch(
              updateMeetingSessionDataAction({
                music: {
                  ...currentMusic,
                  track,
                },
              })
            )
          }}
          variant="bordered"
          size="sm"
          classNames={{
            trigger: 'border-1 !border-gray-200 min-h-[auto] h-[1.75rem]',
            value: 'text-xs font-semibold',
          }}>
          {tracks.map(({ name, path }) => (
            <SelectItem key={path}>{name}</SelectItem>
          ))}
        </Select>
        <Button
          size="sm"
          variant="flat"
          className="h-[1.75rem]"
          isIconOnly
          onClick={() =>
            setPlayerControls({
              ...currentMusic,
              play: !currentMusic?.play,
              track: currentMusic?.track || tracks[0].path,
            })
          }>
          {currentMusic?.play ? <FaPause size={14} /> : <FaPlay size={14} />}
        </Button>
      </div>
      <Slider
        aria-label="Volume"
        className="max-w-md mt-2"
        color="primary"
        size="sm"
        value={(playerControls?.volume || 0.5) * 100}
        startContent={
          <Button
            disableAnimation
            isIconOnly
            radius="full"
            variant="light"
            className="w-[25px] h-[25px] min-w-[25px]"
            onPress={() =>
              setPlayerControls({
                ...currentMusic,
                mute: !currentMusic?.mute,
              })
            }>
            {currentMusic?.mute ? (
              <IoVolumeMute className="text-lg" />
            ) : (
              <IoVolumeMedium className="text-lg" />
            )}
          </Button>
        }
        onChange={(value) => {
          const volume = (typeof value !== 'number' ? value[0] : value) / 100
          setPlayerControls({
            ...currentMusic,
            volume,
          })
        }}
      />
    </>
  )
}
