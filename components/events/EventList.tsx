'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'
import { IoCalendarClear } from 'react-icons/io5'
import { MdOutlineAddBox } from 'react-icons/md'

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  SortDescriptor,
  Pagination,
  User,
} from '@nextui-org/react'

import { EventActions } from './EventActions'
import { CreateEventButtonWithModal } from '../common/CreateEventButtonWithModal'
import { EmptyPlaceholder } from '../common/EmptyPlaceholder'
import { Loading } from '../common/Loading'

import { useAuth } from '@/hooks/useAuth'
import { useEvents } from '@/hooks/useEvents'
import { getCurrentTimeInLocalZoneFromTimeZone } from '@/utils/date'
import { cn } from '@/utils/utils'

const rowsPerPage = 10

const getStatusColor = (status: string) => {
  switch (status) {
    case 'SCHEDULED':
      return 'success'
    default:
      return 'default'
  }
}

const eventColumns = [
  {
    key: 'name',
    label: 'NAME',
    sortable: true,
  },
  {
    key: 'full_name',
    label: 'CREATOR',
    sortable: true,
  },
  {
    key: 'start_date',
    label: 'STARTS ON',
    sortable: true,
  },
  {
    key: 'end_date',
    label: 'ENDS AT',
    sortable: true,
  },
  {
    key: 'status',
    label: 'STATUS',
    sortable: true,
  },
  { key: 'actions', label: 'ACTIONS' },
]

export function EventList() {
  const router = useRouter()
  const { currentUser } = useAuth()
  const [currentPage, setCurrentPage] = useState(1)
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>()
  const { events, count, isLoading, refetch } = useEvents({
    from: (currentPage - 1) * rowsPerPage,
    to: currentPage * rowsPerPage - 1,
  })
  const [totalEventsCount, setTotalEventsCount] = useState(0)

  const pages = Math.ceil(totalEventsCount / rowsPerPage)

  useEffect(() => {
    if (count) {
      setTotalEventsCount(count)
    }
  }, [count])

  const renderCell = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any, columnKey: string) => {
      const cellValue = event[columnKey]
      switch (columnKey) {
        case 'name':
          return (
            <User
              name={cellValue}
              description={event.description}
              avatarProps={{
                src: event?.image_url,
                classNames: {
                  base: cn('rounded-xl min-w-fit', {
                    'bg-transparent': event?.image_url,
                  }),
                  img: 'w-10 h-10',
                },
              }}
              classNames={{ description: 'text-slate-400 ' }}
            />
          )
        case 'full_name':
          return `${event.profile.first_name} ${event.profile.last_name}`

        case 'start_date':
          return (
            <User
              name={
                getCurrentTimeInLocalZoneFromTimeZone({
                  dateTimeString: event.start_date,
                  utcTimeZone: event.timezone,
                  format: 'dd MMM yyyy',
                }) || ''
              }
              description={
                getCurrentTimeInLocalZoneFromTimeZone({
                  dateTimeString: event.start_date,
                  utcTimeZone: event.timezone,
                  format: 'hh:mm a',
                }) || ''
              }
              avatarProps={{
                classNames: { base: 'rounded-xl min-w-fit hidden' },
              }}
              classNames={{ description: 'text-slate-400' }}
            />
          )

        case 'end_date':
          return (
            <User
              name={
                getCurrentTimeInLocalZoneFromTimeZone({
                  dateTimeString: event.end_date,
                  utcTimeZone: event.timezone,
                  format: 'dd MMM yyyy',
                }) || ''
              }
              description={
                getCurrentTimeInLocalZoneFromTimeZone({
                  dateTimeString: event.end_date,
                  utcTimeZone: event.timezone,
                  format: 'hh:mm a',
                }) || ''
              }
              avatarProps={{
                classNames: { base: 'rounded-xl min-w-fit hidden' },
              }}
              classNames={{ description: 'text-slate-400 text-[0.6875rem]' }}
            />
          )

        case 'actions':
          return (
            <EventActions
              event={event}
              isOwner={event.owner_id === currentUser?.id}
              onDone={refetch}
            />
          )

        case 'status':
          return (
            <Chip
              variant="flat"
              size="sm"
              radius="full"
              color={getStatusColor(event.status)}
              classNames={{ base: 'text-center' }}>
              {event.status}
            </Chip>
          )
        default:
          return cellValue
      }
    },
    [currentUser?.id, refetch]
  )

  const getCellValue = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => {
      if (!sortDescriptor?.column) return ''
      switch (sortDescriptor.column) {
        case 'full_name':
          return `${event.profile.first_name} ${event.profile.last_name}`

        default:
          return event[sortDescriptor.column]
      }
    },
    [sortDescriptor]
  )

  const eventRows = useMemo(() => {
    if (!events) return []
    if (!sortDescriptor) return events

    return [...events].sort((a, b) => {
      const first = getCellValue(a)?.toLowerCase()
      const second = getCellValue(b)?.toLowerCase()

      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [events, sortDescriptor, getCellValue])

  const getPagination = () => {
    if (!pages || pages < 2) return null

    return (
      <div className="flex w-full justify-center">
        <Pagination
          variant="bordered"
          showShadow
          boundaries={2}
          color="primary"
          showControls
          page={currentPage}
          total={pages}
          initialPage={1}
          onChange={(page) => {
            setCurrentPage(page)
          }}
        />
      </div>
    )
  }

  if (eventRows.length === 0 && !isLoading) {
    return (
      <EmptyPlaceholder
        label="No Upcoming events"
        description="You have no upcoming events. Why not create one?"
        icon={<IoCalendarClear className=" text-[200px] text-gray-200" />}
        endContent={
          <CreateEventButtonWithModal
            buttonLabel={
              <p className="flex items-center gap-2">
                Create new <MdOutlineAddBox className="text-[18px]" />
              </p>
            }
            buttonProps={{
              className: 'bg-black text-white mt-12',
            }}
          />
        }
      />
    )
  }

  const renderHeader = () => {
    if (!eventRows?.length) return null

    return (
      <div className="flex items-center justify-between mt-10">
        <div>
          <p className="font-semibold text-3xl">Calendar of Happenings</p>
          <p className="text-sm mt-2">
            Life is about moments: don&apos;t wait for them, create them.
          </p>
        </div>

        <CreateEventButtonWithModal
          buttonLabel={
            <p className="flex items-center gap-2">
              Create new <MdOutlineAddBox className="text-[18px]" />
            </p>
          }
          buttonProps={{
            className: 'bg-black text-white',
          }}
        />
      </div>
    )
  }

  return (
    <>
      {renderHeader()}

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <Table
              aria-label="Example table with dynamic content"
              sortDescriptor={sortDescriptor}
              onSortChange={setSortDescriptor}
              selectionMode="single"
              classNames={{
                table: isLoading && 'min-h-[25rem]',
              }}
              onRowAction={(key) => router.push(`/events/${key}`)}
              bottomContent={getPagination()}>
              <TableHeader columns={eventColumns}>
                {(column) => (
                  <TableColumn key={column.key} allowsSorting={column.sortable}>
                    {column.label}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody
                items={eventRows}
                isLoading={isLoading}
                loadingContent={<Loading />}
                emptyContent={!isLoading && 'No events to display.'}>
                {(item) => (
                  <TableRow key={item.id} className="cursor-pointer">
                    {(columnKey) => (
                      <TableCell
                        className={
                          (columnKey === 'status' && 'text-center') || ''
                        }>
                        {renderCell(item, columnKey as string)}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  )
}
