/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-unescaped-entities */

import { useEffect, useState } from 'react'

import { Pagination } from '@heroui/react'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { FaYoutube } from 'react-icons/fa'

import { VideoProvider } from './utils/types'
import { YoutubeVideoCard } from './YoutubeVideoCard'
import { ContentLoading } from '../../ContentLoading'
import { RenderIf } from '../../RenderIf/RenderIf'
import { SearchInput } from '../../SearchInput'

import { Button } from '@/components/ui/Button'
import { useEventContext } from '@/contexts/EventContext'
import { IFrame } from '@/types/frame.type'
import { isValidYouTubeVideoUrl } from '@/utils/url'

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search'
const PER_ROW_COUNT = 3
const MAX_VIDEOS_PER_PAGE = PER_ROW_COUNT * 4
const TOTAL_PAGES = 5
const MAX_VIDEOS_TO_FETCH = MAX_VIDEOS_PER_PAGE * TOTAL_PAGES

type LocalVideoEditProps = {
  frame: IFrame & {
    content: {
      videoUrl: string
      provider: VideoProvider | null
    }
  }
  onUpdate: () => void
  onProviderChange: () => void
}

export function YoutubeVideoEdit({
  frame,
  onUpdate,
  onProviderChange,
}: LocalVideoEditProps) {
  const [query, setQuery] = useState<string>(frame.content.query || '')
  const [loading, setLoading] = useState<boolean>(false)
  const [videos, setVideos] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const { updateFrame } = useEventContext()

  useEffect(() => {
    if (query.trim()) {
      handleSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)

    try {
      const response = await fetch(
        `${YOUTUBE_SEARCH_URL}?part=snippet&maxResults=${MAX_VIDEOS_TO_FETCH}&q=${encodeURIComponent(
          query
        )}&type=video&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
      )
      const data = await response.json()
      setVideos(data.items || [])
    } catch (error) {
      console.error('Error fetching YouTube videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateVideo = (videoId: string) => {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`

    const validUrl = isValidYouTubeVideoUrl(videoUrl)

    if (!validUrl) {
      toast.error('Youtube video URL is invalid')

      return
    }

    if (frame.content.videoUrl === videoUrl) {
      onUpdate()

      return
    }

    updateFrame({
      framePayload: {
        content: {
          ...frame.content,
          videoUrl,
          query,
          provider: VideoProvider.YOUTUBE,
        },
      },
      frameId: frame.id,
    })
    onUpdate()
  }

  const start = currentPage * MAX_VIDEOS_PER_PAGE
  const end = (currentPage + 1) * MAX_VIDEOS_PER_PAGE

  return (
    <div className="flex flex-col justify-start items-start gap-2">
      <div className="flex justify-start items-center gap-2">
        <Button variant="light" isIconOnly onClick={onProviderChange}>
          <ArrowLeft size={20} />
        </Button>
        <span className="text-lg font-semibold">Search from Youtube</span>
      </div>
      <div className="w-full my-4">
        <SearchInput
          defaultValue={query}
          inputProps={{ fullWidth: true }}
          debounce={500}
          onSearch={setQuery}
        />
      </div>
      <RenderIf isTrue={loading}>
        <ContentLoading
          message={`Searching Youtube for - ${query}`}
          transparent
          classNames={{
            container: 'w-full h-96',
            message: 'text-center mt-2',
          }}
        />
      </RenderIf>
      <RenderIf isTrue={!loading && videos.length > 0}>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-4 w-full">
            {}
            {videos.slice(start, end).map((video) => (
              <YoutubeVideoCard
                key={`video-${video?.id?.videoId}`}
                video={video}
                isSelected={frame.content?.videoUrl?.includes(
                  video?.id?.videoId
                )}
                onUpdateVideo={handleUpdateVideo}
              />
            ))}
          </div>
          <div className="flex justify-end items-center w-full">
            <Pagination
              initialPage={1}
              total={Math.ceil(videos.length / MAX_VIDEOS_PER_PAGE)}
              onChange={(page) => {
                setCurrentPage(page)
              }}
            />
          </div>
        </div>
      </RenderIf>
      <RenderIf isTrue={!loading && videos.length === 0}>
        <div className="flex flex-col justify-center items-center gap-2 w-full h-96">
          <FaYoutube size={72} className="text-primary" />
          <span className="text-xl font-semibold text-foreground">
            Search Youtube Videos
          </span>
          <span className="text-gray-600 max-w-[450px] text-center">
            You can try searching with different keywords to find the video you
            are looking for - e.g. "How to grow your business"
          </span>
        </div>
      </RenderIf>
    </div>
  )
}
