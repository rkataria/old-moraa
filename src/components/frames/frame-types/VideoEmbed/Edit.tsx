/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react'

import { motion } from 'framer-motion'
import { FaYoutube } from 'react-icons/fa'

import { Embed } from './Embed'
import { EmbedUrlVideoEdit } from './EmbedUrlVideoEdit'
import { LocalVideoEdit } from './LocalVideoEdit'
import { VideoProvider } from './utils/types'
import { YoutubeVideoEdit } from './YoutubeVideoEdit'

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

export function Edit({ frame }: EditProps) {
  const [editable, setEditable] = useState(false)
  const [provider, setProvider] = useState<VideoProvider | null>(null)

  const videoProvider = frame.content?.provider as VideoProvider | null

  useEffect(() => {
    if (videoProvider) {
      setProvider(videoProvider)
    }
  }, [videoProvider])

  if (frame.content.videoUrl && !editable) {
    return (
      <div className="relative rounded-md overflow-hidden group">
        <Embed showControls url={frame.content.videoUrl} />
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: -50, x: '-50%' }}
          transition={{
            duration: 0.3,
          }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          className={cn(
            'absolute left-1/2 bottom-0',
            'bg-black text-white py-2 px-6 rounded-full shadow-sm cursor-pointer transition-all duration-300',
            'flex justify-start gap-2'
          )}
          onClick={() => setEditable(true)}>
          <p>Do you want to replace this video?</p>
          <span className="underline">Click here</span>
        </motion.div>
      </div>
    )
  }

  if (provider === VideoProvider.LOCAL) {
    return (
      <LocalVideoEdit
        frame={frame as any}
        onUpdate={() => setEditable(false)}
        onProviderChange={() => setProvider(null)}
      />
    )
  }

  if (provider === VideoProvider.YOUTUBE) {
    return (
      <YoutubeVideoEdit
        frame={frame as any}
        onUpdate={() => setEditable(false)}
        onProviderChange={() => setProvider(null)}
      />
    )
  }

  if (provider === VideoProvider.EMBED_URL) {
    return (
      <EmbedUrlVideoEdit
        frame={frame as any}
        onUpdate={() => setEditable(false)}
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
            How would you like to source your video
          </h2>
          <p className="text-center text-foreground">
            Choose an option to a embeding video
          </p>
        </div>
        <div className="flex justify-center items-center gap-8">
          <div
            className={cn(
              'font-medium h-20 flex-1 text-center bg-gray-100 rounded-md flex justify-center items-center cursor-pointer border-2 border-transparent hover:border-primary'
            )}
            onClick={() => setProvider(VideoProvider.LOCAL)}>
            Upload from computer
          </div>
          <div
            className={cn(
              'font-medium h-20 flex-1 text-center bg-gray-100 rounded-md flex justify-center items-center cursor-pointer border-2 border-transparent hover:border-primary'
            )}
            onClick={() => setProvider(VideoProvider.YOUTUBE)}>
            Search YouTube
          </div>
          <div
            className={cn(
              'font-medium h-20 flex-1 text-center bg-gray-100 rounded-md flex justify-center items-center cursor-pointer border-2 border-transparent hover:border-primary'
            )}
            onClick={() => setProvider(VideoProvider.EMBED_URL)}>
            Embed URL
          </div>
        </div>
        <p className="text-sm font-[300] text-gray-400 text-center pt-4">
          If you want to use local video, please choose "Local Video" option to
          upload your video. If you want to embed from Youtube or from any other
          url, please choose respective option.
        </p>
      </div>
    </div>
  )
}
