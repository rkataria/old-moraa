/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Key, useRef, useState } from 'react'

import { Button } from '@nextui-org/button'
import {
  Chip,
  Pagination,
  Select,
  SelectItem,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
} from '@nextui-org/react'
import { IconTrash } from '@tabler/icons-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { BsGrid, BsList } from 'react-icons/bs'
import { RxDotsVertical } from 'react-icons/rx'

// eslint-disable-next-line import/no-cycle
import { FrameThumbnailCard } from './AgendaPanel/FrameThumbnailCard'
import { ContentLoading } from './ContentLoading'
import { DropdownActions } from './DropdownActions'

import { RoomProvider } from '@/contexts/RoomProvider'
import { useDimensions } from '@/hooks/useDimensions'
import { useProfile } from '@/hooks/useProfile'
import { LibraryService } from '@/services/library.service'
import { IFrame } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'
import { cn, FrameColorCodes } from '@/utils/utils'

const AllFrameTypes = ['All Frames', ...Object.values(FrameType)]

function ThumbnailContainer({
  libraryItem,
}: {
  libraryItem: { frame: IFrame }
}) {
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)

  const { width: containerWidth } = useDimensions(
    thumbnailContainerRef,
    undefined
  )

  return (
    <div ref={thumbnailContainerRef} className="relative w-full h-full">
      {libraryItem.frame.type === FrameType.MORAA_BOARD ? (
        <RoomProvider frameId={libraryItem.frame.id}>
          <FrameThumbnailCard
            frame={libraryItem.frame}
            containerWidth={containerWidth}
          />
        </RoomProvider>
      ) : (
        <FrameThumbnailCard
          frame={libraryItem.frame}
          containerWidth={containerWidth}
        />
      )}
    </div>
  )
}

export function FrameLibrary({
  onFrameClick,
  allowFrameDelete,
  frameTypes,
}: {
  onFrameClick?: (frame: IFrame) => void
  allowFrameDelete?: boolean
  frameTypes?: string[]
}) {
  const [page, setPage] = useState(1)
  const profile = useProfile()

  const [frameType, setFrameType] = useState(AllFrameTypes[0])
  const [listDisplayMode, toggleListDisplayMode] = useState('grid' as Key)
  const libraryQuery = useQuery({
    queryKey: [
      'library-frames',
      page,
      frameTypes || frameType !== AllFrameTypes[0] ? [frameType] : [],
    ],
    queryFn: () =>
      LibraryService.getFrameFromLibrary({
        profileId: profile!.data!.id,
        page,
        frameTypes:
          frameTypes || frameType !== AllFrameTypes[0] ? [frameType] : [],
      }),
    enabled: !!profile?.data?.id,
  })

  const deleteFrameMutation = useMutation({
    mutationFn: LibraryService.deleteFrameFromLibrary,
    onSuccess: () => libraryQuery.refetch(),
  })

  const onFrameDeleteClick = (frameId: string) => async () => {
    await deleteFrameMutation.mutate(frameId)
  }

  return (
    <div>
      <div className="flex mt-4 items-center justify-between">
        <div>
          <div className="mr-4 text-foreground-500 font-normal">
            Frame Type:
          </div>
          <Select
            className="flex-none text-xs w-60"
            value={frameType}
            selectedKeys={[frameType]}
            variant="bordered"
            size="sm"
            classNames={{
              trigger: 'border-1 rounded-md shadow-none',
            }}
            aria-label="How participants can join"
            onChange={(e) => {
              setFrameType(e.target.value)
            }}>
            {AllFrameTypes.map((label) => (
              <SelectItem value={label} key={label} title={label}>
                {label}
              </SelectItem>
            ))}
          </Select>
        </div>

        <Tabs
          onSelectionChange={toggleListDisplayMode}
          size="sm"
          classNames={{
            tabList: 'p-0 border gap-0 bg-white',
            cursor: 'w-full bg-primary-100 rounded-none',
            tabContent: 'group-data-[selected=true]:text-primary',
            tab: 'p-2.5',
          }}>
          <Tab key="grid" title={<BsGrid size={16} />} />
          <Tab key="list" title={<BsList size={16} />} />
        </Tabs>
      </div>

      <div className="overflow overflow-y-auto">
        {libraryQuery.isLoading ? (
          <div className="min-h-48 flex flex-col justify-center items-center">
            <ContentLoading />
          </div>
        ) : (
          <div>
            {libraryQuery.data?.data.length === 0 && (
              <div className="flex justify-center text-sm text-gray-400 m-4">
                It&apos;s empty here.
              </div>
            )}
            {listDisplayMode === 'list' ? (
              <div className="p-1 mt-4">
                <Table
                  aria-label="Frame Library List View"
                  style={{ height: 'auto', minWidth: '100%' }}>
                  <TableHeader className="p-0">
                    <TableColumn>Name</TableColumn>
                    <TableColumn>Type</TableColumn>
                    <TableColumn>Category</TableColumn>
                    <TableColumn>Saved On</TableColumn>
                    <TableColumn>Action</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {(libraryQuery.data?.data || []).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <p>{item.frame.name}</p>
                          {/* <p className="text-slate-600">{item.frame.description}</p> */}
                        </TableCell>
                        <TableCell>{item.frame.type}</TableCell>
                        <TableCell>
                          {item.frame.config?.colorCode ? (
                            <Chip
                              color="default"
                              style={{
                                background:
                                  FrameColorCodes[
                                    item.frame.config
                                      ?.colorCode as keyof typeof FrameColorCodes
                                  ]?.color,
                                color: item.frame.config?.textColor,
                              }}>
                              {
                                FrameColorCodes[
                                  item.frame.config
                                    ?.colorCode as keyof typeof FrameColorCodes
                                ]?.label
                              }
                            </Chip>
                          ) : null}
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
                          {allowFrameDelete && (
                            <Button
                              size="sm"
                              isIconOnly
                              variant="light"
                              isLoading={
                                deleteFrameMutation.isPending &&
                                deleteFrameMutation.variables === item.frame.id
                              }
                              onClick={onFrameDeleteClick(item.frame.id)}>
                              <IconTrash className="text-red-500" size={18} />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4 py-4">
                {libraryQuery.data?.data?.map((libraryItem: any) => (
                  <div
                    key={`frame-${libraryItem.id}`}
                    onClick={() => onFrameClick?.(libraryItem?.frame)}
                    className={cn(
                      'cursor-pointer overflow-hidden rounded-lg group/frame-item shadow shadow-sm border border-gray-200 px-2 pb-2'
                    )}>
                    <div className="flex justify-between items-center py-1">
                      <p className="text-gray-600 text-xs font-medium text-ellipsis max-w-32 whitespace-nowrap overflow-hidden">
                        {libraryItem.frame?.name}
                      </p>
                      {allowFrameDelete ? (
                        <DropdownActions
                          triggerIcon={
                            <Button
                              size="sm"
                              isIconOnly
                              variant="light"
                              className="shrink-0">
                              <RxDotsVertical size={18} />
                            </Button>
                          }
                          actions={[
                            {
                              key: 'delete',
                              label: 'Remove',
                              icon: (
                                <IconTrash className="text-red-500" size={18} />
                              ),
                            },
                          ]}
                          onAction={onFrameDeleteClick(libraryItem.frame.id)}
                        />
                      ) : null}
                    </div>
                    <div className="relative">
                      <div
                        className={cn(
                          'w-full rounded-lg border border-gray-300 overflow-hidden aspect-video bg-gray-100'
                        )}>
                        <ThumbnailContainer libraryItem={libraryItem} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="my-4 flex justify-center">
          <Pagination
            key={libraryQuery.dataUpdatedAt}
            total={Math.ceil((libraryQuery.data?.count || 8) / 10)}
            page={page}
            onChange={setPage}
          />
        </div>
      </div>
    </div>
  )
}
