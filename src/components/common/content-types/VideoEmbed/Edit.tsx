/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react'

import { FaYoutube } from 'react-icons/fa'

import { Embed } from './Embed'
import { LocalVideoEdit } from './LocalVideoEdit'
import { VimeoVideoEdit } from './VimeoVideoEdit'
import { YoutubeVideoEdit } from './YoutubeVideoEdit'

import { useStoreSelector } from '@/hooks/useRedux'
import { IFrame } from '@/types/frame.type'
import { cn } from '@/utils/utils'

type EditProps = {
  frame: IFrame & {
    content: {
      videoUrl: string
      provider: VideoProvider
    }
  }
}

type VideoProvider = 'local' | 'youtube' | 'vimeo'

export function Edit({ frame }: EditProps) {
  const [provider, setProvider] = useState<VideoProvider | null>(null)
  const showForm = useStoreSelector(
    (store) => store.layout.studio.frameSettings.view === 'form'
  )
  const videoUrl = frame.content?.videoUrl
  const videoProvider = frame.content?.provider as VideoProvider | null

  useEffect(() => {
    if (videoProvider) {
      setProvider(videoProvider)
    }
  }, [videoProvider])

  if (showForm || !videoUrl) {
    if (provider === 'local') {
      return (
        <LocalVideoEdit
          frame={frame as any}
          onProviderChange={() => setProvider(null)}
        />
      )
    }

    if (provider === 'youtube') {
      return (
        <YoutubeVideoEdit
          frame={frame as any}
          onProviderChange={() => setProvider(null)}
        />
      )
    }

    if (provider === 'vimeo') {
      return (
        <VimeoVideoEdit
          frame={frame as any}
          onProviderChange={() => setProvider(null)}
        />
      )
    }

    return (
      <div className="relative flex justify-center items-center gap-10 w-full h-full pt-10 rounded-md">
        <div className="flex flex-col gap-4 w-full max-w-2xl">
          <div className="flex flex-col justify-center items-center gap-4 pb-8 w-full m-auto">
            <FaYoutube size={72} className="text-primary" />
            <h2 className="subheading-1 text-primary">
              How would you like to embed video
            </h2>
            <p className="text-center text-foreground">
              Choose an option to start embeding video
            </p>
          </div>
          <div className="flex justify-center items-center gap-8">
            <div
              className={cn(
                'font-semibold aspect-video bg-gray-100 rounded-md p-8 flex justify-center items-center cursor-pointer border-2 border-transparent hover:border-primary'
              )}
              onClick={() => setProvider('local')}>
              Local
            </div>
            <div
              className={cn(
                'font-semibold aspect-video bg-gray-100 rounded-md p-8 flex justify-center items-center cursor-pointer border-2 border-transparent hover:border-primary'
              )}
              onClick={() => setProvider('youtube')}>
              Youtube
            </div>
            <div
              className={cn(
                'font-semibold aspect-video bg-gray-100 rounded-md p-8 flex justify-center items-center cursor-pointer border-2 border-transparent hover:border-primary'
              )}
              onClick={() => setProvider('vimeo')}>
              Vimeo
            </div>
          </div>
          <p className="text-sm font-[300] text-gray-400 text-center pt-4">
            If you want to use local video, please choose "Local Video" option
            to upload your video. If you want to embed from Youtube or Vimeo,
            please choose respective option.
          </p>
        </div>
      </div>
    )
  }

  return <Embed url={videoUrl} />
}
