import { useCallback, useEffect, useMemo, useState } from 'react'

import { SortDescriptor, Pagination } from '@nextui-org/react'
import { Link } from '@tanstack/react-router'
import { IoCalendarClear } from 'react-icons/io5'
import { MdOutlineAddBox } from 'react-icons/md'

import { GridView } from './GridView'
import { ListView } from './ListView'
import { ListToggleButton } from '../common/AgendaPanel/ListToggleButton'
import { EmptyPlaceholder } from '../common/EmptyPlaceholder'
import { Button } from '../ui/Button'

import { useAuth } from '@/hooks/useAuth'
import { useEvents } from '@/hooks/useEvents'

const rowsPerPage = 10

export function EventList() {
  const { currentUser } = useAuth()
  const [listDisplayMode, toggleListDisplayMode] = useState('list')
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
      <div className="flex justify-center w-full mt-4">
        <Pagination
          variant="bordered"
          showShadow
          boundaries={2}
          color="secondary"
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
        icon={<IoCalendarClear className=" text-[200px] text-gray-200" />}
        title="No upcoming events"
        description="You don't have any upcoming events. Create one now!"
        actionButton={
          <Link to="/events/create">
            <Button
              size="sm"
              color="primary"
              endContent={<MdOutlineAddBox size={18} aria-hidden="true" />}>
              Create new
            </Button>
          </Link>
        }
      />
    )
  }

  const renderHeader = () => {
    if (eventRows?.length === 0 && !isLoading) return null

    return (
      <div className="flex justify-between items-start">
        <div>
          <p className="text-2xl font-semibold">Calendar of Happenings</p>
          <p className="text-sm mt-1 text-gray-500">
            Life is about moments: don&apos;t wait for them, create them.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/events/create">
            <Button
              size="sm"
              color="primary"
              endContent={<MdOutlineAddBox size={18} aria-hidden="true" />}>
              Create new
            </Button>
          </Link>
          <ListToggleButton
            listDisplayMode={listDisplayMode}
            toggleListDisplayMode={() =>
              toggleListDisplayMode(
                listDisplayMode === 'list' ? 'grid' : 'list'
              )
            }
          />
        </div>
      </div>
    )
  }

  const getView = () => {
    if (listDisplayMode === 'list') {
      return (
        <ListView
          isLoading={isLoading}
          eventRows={eventRows}
          sortDescriptor={sortDescriptor}
          currentUserId={currentUser?.id}
          setSortDescriptor={setSortDescriptor}
          refetch={refetch}
        />
      )
    }

    return (
      <GridView
        eventRows={eventRows}
        isLoading={isLoading}
        currentUserId={currentUser?.id}
        refetch={refetch}
      />
    )
  }

  return (
    <div className="w-full">
      {renderHeader()}
      <div className="mt-10">
        {getView()}
        {getPagination()}
      </div>
    </div>
  )
}
