import { Dispatch, SetStateAction, useCallback } from 'react'

import {
  Chip,
  Image,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from '@nextui-org/react'
import { useRouter } from '@tanstack/react-router'

import { EventActions } from './EventActions'
import { Loading } from '../common/Loading'

import { IMAGE_PLACEHOLDER } from '@/constants/common'
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
                src: event.image_url,
                fallback: event.image_url && (
                  <Image src={IMAGE_PLACEHOLDER} className="w-full h-full" />
                ),
                classNames: {
                  base: cn('rounded-xl min-w-fit', {
                    'bg-transparent': event?.image_url,
                  }),
                  img: 'w-10 h-10',
                  fallback: 'w-full h-full',
                },
                showFallback: event.image_url?.length > 0,
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
              classNames={{ name: 'min-w-max', description: 'text-slate-400' }}
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
              classNames={{
                name: 'min-w-max',
                description: 'text-slate-400 text-[0.6875rem]',
              }}
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
      onRowAction={(key) =>
        router.navigate({ to: `/events/${key}?action=view` })
      }>
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
