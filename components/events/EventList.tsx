'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

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
} from '@nextui-org/react'

import { EventActionsWithModal } from './EventActionsWithModal'
import { Loading } from '../common/Loading'

import { useAuth } from '@/hooks/useAuth'
import { useEvents } from '@/hooks/useEvents'
import { getCurrentTimeInLocalZoneFromTimeZone } from '@/utils/date'

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
    label: 'Name',
    sortable: true,
  },
  {
    key: 'full_name',
    label: 'Created by',
    sortable: true,
  },
  {
    key: 'start_date',
    label: 'Event start',
    sortable: true,
  },
  {
    key: 'end_date',
    label: 'Event end',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
  },
  { key: 'actions' },
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
        case 'full_name':
          return `${event.profile.first_name} ${event.profile.last_name}`

        case 'start_date':
          return (
            getCurrentTimeInLocalZoneFromTimeZone({
              dateTimeString: event.start_date,
              utcTimeZone: event.timezone,
            }) || '-'
          )

        case 'end_date':
          return (
            getCurrentTimeInLocalZoneFromTimeZone({
              dateTimeString: event.end_date,
              utcTimeZone: event.timezone,
            }) || '-'
          )

        case 'actions':
          return (
            <EventActionsWithModal
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
              radius="md"
              color={getStatusColor(event.status)}>
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

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <Table
            removeWrapper
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
                    <TableCell>
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
  )
}
