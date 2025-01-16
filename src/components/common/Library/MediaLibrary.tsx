/* eslint-disable no-empty-pattern */
import { useState } from 'react'

import {
  Chip,
  Input,
  Button,
  Pagination,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableCell,
  TableRow,
} from '@nextui-org/react'
import { IconTrash } from '@tabler/icons-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { IoDownloadOutline, IoFileTray, IoSearch } from 'react-icons/io5'

import { MediaCard } from './MediaCard'
import { FilePickerModal } from './MediaUploaderModal'
import { ContentLoading } from '../ContentLoading'
import { SelectableItem } from '../SelectableWrapper/SelectableItem'
import { UseSelectableReturn } from '../SelectableWrapper/useSelectable'
import { withSelectable } from '../SelectableWrapper/withSelectable'
import { ViewSwitcher } from '../ViewSwitcher'

import { useProfile } from '@/hooks/useProfile'
import { LibraryService } from '@/services/library.service'
import { getSignedUrls } from '@/services/storage.service'
import { cn } from '@/utils/utils'

// eslint-disable-next-line @typescript-eslint/ban-types
type MediaLibraryProps = {
  selection: UseSelectableReturn<string>
}

export enum MediaTypeNames {
  Image = 'Image',
  Video = 'Video',
  Audio = 'Audio',
  PDF = 'PDF',
}

const MediaTypes = [
  { name: MediaTypeNames.Image, mimePrefix: 'image/' },
  { name: MediaTypeNames.Video, mimePrefix: 'video/' },
  { name: MediaTypeNames.Audio, mimePrefix: 'audio/' },
  { name: MediaTypeNames.PDF, mimePrefix: 'application/pdf' },
] as const

const getMediaType = (mimeType: string): MediaTypeNames => {
  const type = MediaTypes.find((media) => mimeType.startsWith(media.mimePrefix))

  return type?.name || MediaTypeNames.Image
}

export const MediaLibrary = withSelectable<string>(
  ({ selection }: MediaLibraryProps) => {
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [selectedType, setSelectedType] = useState<MediaTypeNames | null>(
      null
    )
    const [listDisplayMode, toggleListDisplayMode] = useState<string>('grid')
    const [isFilePickerModalOpen, setIsFilePickerModalOpen] = useState(false)
    const profile = useProfile()

    const pageSize = page === 1 ? 9 : 10

    const libraryQuery = useQuery({
      queryKey: ['media-library', search, page, selectedType, search],
      queryFn: async () => {
        const response = await LibraryService.getMediaFromLibrary({
          profileId: profile!.data!.id,
          page,
          mediaTypes: selectedType ? [selectedType] : [],
          search,
          pageSize,
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

    const deleteMediaMutation = useMutation({
      mutationFn: async (id: string[]) => {
        await LibraryService.deleteMediaFromLibrary(id)
        await libraryQuery.refetch()
      },
      onSuccess: () => {
        selection.deselectAllItem()
      },
    })

    const linkFileMutation = useMutation<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      { path: string; mediaType: MediaTypeNames }
    >({
      mutationFn: ({ path, mediaType }) =>
        LibraryService.saveMediaInLibrary({
          path,
          mediaType,
          profileId: profile.data!.id,
        }),

      onSuccess: () => libraryQuery.refetch(),
    })

    const onAddMediaClick = () => setIsFilePickerModalOpen(true)

    return (
      <div>
        <div className="mt-4 flex justify-between align-center">
          <Input
            value={search}
            className="w-96"
            variant="bordered"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Media Library"
            startContent={<IoSearch size={20} color="#ccc" />}
          />
          <div>
            <ViewSwitcher
              onViewChange={toggleListDisplayMode}
              currentView={listDisplayMode}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-between align-center h-10">
          <div>
            {MediaTypes.map((type) => (
              <Chip
                key={type.name}
                className="mr-2 rounded-md cursor-pointer border text-md"
                size="sm"
                onClick={() =>
                  setSelectedType(type.name === selectedType ? null : type.name)
                }
                variant={selectedType === type.name ? 'solid' : 'bordered'}
                color={selectedType === type.name ? 'primary' : 'default'}>
                {type.name}
              </Chip>
            ))}
          </div>
          <div>
            <Button
              size="sm"
              variant="bordered"
              color="danger"
              isLoading={deleteMediaMutation.isPending}
              onClick={() =>
                deleteMediaMutation.mutate(selection.selectedItems)
              }
              className={cn({
                hidden:
                  !selection.selectedItems.length || listDisplayMode !== 'grid',
              })}>
              Delete selected ({selection.selectedItems.length})
            </Button>
          </div>
        </div>

        {!libraryQuery.isLoading && (
          <div>
            <div>
              {listDisplayMode === 'list' ? (
                <div className="p-1 mt-4">
                  <Table style={{ height: 'auto', minWidth: '100%' }}>
                    <TableHeader className="p-0">
                      <TableColumn>Name</TableColumn>
                      <TableColumn>Type</TableColumn>
                      <TableColumn>Saved On</TableColumn>
                      <TableColumn>Action</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {(libraryQuery.data?.data || []).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="capitalize-first-letter">
                            {item.path?.split('/')[1]}
                          </TableCell>
                          <TableCell>
                            <Chip
                              variant="bordered"
                              className="rounded-md border">
                              {item.file_type}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <p className="text-slate-600">
                              {DateTime.fromISO(item.created_at).toFormat(
                                'dd MMM yyyy'
                              )}
                            </p>
                            <p className="text-slate-400">
                              {DateTime.fromISO(item.created_at).toFormat(
                                'hh:mm a'
                              )}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              isIconOnly
                              variant="light"
                              className="mr-2"
                              onClick={() => {
                                window.open(item.signedURL)
                              }}>
                              <IoDownloadOutline size={22} />
                            </Button>
                            <Button
                              size="sm"
                              isIconOnly
                              variant="light"
                              isLoading={
                                deleteMediaMutation.isPending &&
                                deleteMediaMutation.variables[0] === item.id
                              }
                              onClick={() =>
                                deleteMediaMutation.mutate([item.id])
                              }>
                              <IconTrash className="text-red-400" size={22} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-4 py-4">
                  {page === 1 && (
                    <Button
                      variant="light"
                      onClick={onAddMediaClick}
                      className="border border-dashed rounded-md border-2 border-primary h-full w-full flex items-center justify-center flex-col aspect-square text-primary">
                      <IoFileTray size={32} />
                      <span className="font-medium my-4">Add Media</span>
                    </Button>
                  )}
                  {libraryQuery.data?.data.map((file) => (
                    <SelectableItem
                      key={file.id}
                      item={file.id}
                      selection={selection}
                      className="rounded-md">
                      <MediaCard
                        fileUrl={file.signedURL!}
                        fileName={file.path?.split('/')[1] || 'Untitled'}
                        type={file.file_type}
                      />
                    </SelectableItem>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {libraryQuery.isLoading && (
          <div className="min-h-48 flex flex-col justify-center items-center">
            <ContentLoading />
          </div>
        )}

        <FilePickerModal
          isOpen={isFilePickerModalOpen}
          onClose={() => setIsFilePickerModalOpen(false)}
          onFileUploaded={(file) =>
            linkFileMutation.mutate({
              mediaType: getMediaType(file.file.type),
              path: file.path,
            })
          }
        />

        <div className="my-4 flex justify-center">
          <Pagination
            key={libraryQuery.dataUpdatedAt}
            total={Math.ceil((libraryQuery.data?.count || pageSize) / pageSize)}
            page={page}
            onChange={setPage}
          />
        </div>
      </div>
    )
  }
)
