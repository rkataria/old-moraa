import { Dispatch, SetStateAction, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import {
  Chip,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from '@nextui-org/react'

import { EventActions } from './EventActions'
import { Loading } from '../common/Loading'

import { getCurrentTimeInLocalZoneFromTimeZone } from '@/utils/date'
import { eventTableColumns, getStatusColor } from '@/utils/event.util'
import { cn } from '@/utils/utils'

interface IListView {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eventRows: any[]
  isLoading: boolean
  sortDescriptor: SortDescriptor | undefined
  currentUserId: string
  setSortDescriptor: Dispatch<SetStateAction<SortDescriptor | undefined>>
  refetch: () => void
}

export function ListView({
  isLoading,
  eventRows,
  sortDescriptor,
  currentUserId,
  setSortDescriptor,
  refetch,
}: IListView) {
  const router = useRouter()

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
              isOwner={event.owner_id === currentUserId}
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
    [currentUserId, refetch]
  )

  return (
    <Table
      aria-label="Example table with dynamic content"
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
      selectionMode="single"
      classNames={{
        table: isLoading && 'min-h-[25rem]',
      }}
      onRowAction={(key) => router.push(`/events/${key}`)}>
      <TableHeader columns={eventTableColumns}>
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
                className={(columnKey === 'status' && 'text-center') || ''}>
                {renderCell(item, columnKey as string)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
