import { useState } from 'react'

import { Input, Pagination } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { IoSearchOutline } from 'react-icons/io5'
import { TbLibraryPhoto } from 'react-icons/tb'

import { ContentLoading } from '../ContentLoading'
import { MediaCard } from '../Library/MediaCard'
import { MediaTypeNames } from '../Library/MediaLibrary'

import { useProfile } from '@/hooks/useProfile'
import { LibraryService } from '@/services/library.service'
import { getSignedUrls } from '@/services/storage.service'

export function LibraryContent({
  mediaType,
  onSelect,
}: {
  mediaType: MediaTypeNames
  onSelect: (imageElement: HTMLImageElement) => void
}) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const profile = useProfile()

  const libraryQuery = useQuery({
    queryKey: ['media-library', search, page, mediaType, search],
    queryFn: async () => {
      const response = await LibraryService.getMediaFromLibrary({
        profileId: profile!.data!.id,
        page,
        mediaTypes: [mediaType],
        search,
        pageSize: 10,
      })

      const signedURLs = await getSignedUrls(
        'assets-uploads',
        response.data.map((item) => item.path!)
      )

      return {
        ...response,
        data: response.data.map((data, index) => ({
          ...data,
          signedURL: signedURLs.data?.[index].signedUrl,
        })),
      }
    },
    enabled: !!profile?.data?.id,
  })

  return (
    <div className="flex flex-col gap-8 h-full">
      <Input
        placeholder="Search library"
        labelPlacement="outside"
        fullWidth
        radius="sm"
        className="shadow-none"
        variant="bordered"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        startContent={
          <IoSearchOutline className="text-2xl text-primary-200 pointer-events-none flex-shrink-0" />
        }
      />

      {libraryQuery.isLoading && (
        <div className="min-h-48 flex flex-col justify-center items-center">
          <ContentLoading />
        </div>
      )}

      {libraryQuery.data?.count === 0 && (
        <div className="flex-auto flex flex-col justify-center items-center gap-2">
          <TbLibraryPhoto size={128} className="text-primary-200" />
          <p className="text-center w-2/3">
            <span className="text-sm text-gray-400 text-center">
              Upload your media files to use them in your projects and designs
            </span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 py-4">
        {libraryQuery.data?.data.map((file) => (
          <MediaCard
            fileUrl={file.signedURL!}
            fileName={file.path?.split('/')[1] || 'Untitled'}
            type={file.file_type}
            onClick={({ fileUrl, fileType }) => {
              if (fileType !== MediaTypeNames.Image) return
              const imageEle = document.createElement('img')
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              imageEle.src = fileUrl
              onSelect(imageEle)
            }}
          />
        ))}
      </div>
      <div className="my-4 flex justify-center">
        <Pagination
          key={libraryQuery.dataUpdatedAt}
          total={Math.ceil((libraryQuery.data?.count || 8) / 10)}
          page={page}
          onChange={setPage}
        />
      </div>
    </div>
  )
}
