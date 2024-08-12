import { useCallback, useEffect, useMemo, useState } from 'react'

import { SortDescriptor, Pagination, Button } from '@nextui-org/react'
import { Link } from '@tanstack/react-router'
import { IoCalendarClear } from 'react-icons/io5'
import { MdOutlineAddBox } from 'react-icons/md'

import { GridView } from './GridView'
import { ListView } from './ListView'
import { ListToggleButton } from '../common/AgendaPanel/ListToggleButton'
import { EmptyPlaceholder } from '../common/EmptyPlaceholder'

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
        label="No Upcoming events"
        description="You have no upcoming events. Why not create one?"
        icon={<IoCalendarClear className=" text-[200px] text-gray-200" />}
        endContent={
          <Button
            as={Link}
            to="/events/create"
            className="mt-12 text-white bg-primary"
            startContent={<MdOutlineAddBox className="text-lg" />}>
            Create new
          </Button>
        }
      />
    )
  }

  const renderHeader = () => {
    if (eventRows?.length === 0 && !isLoading) return null

    return (
      <div className="flex items-center justify-between mt-10">
        <div>
          <p className="text-3xl font-semibold">Calendar of Happenings</p>
          <p className="mt-2 text-sm">
            Life is about moments: don&apos;t wait for them, create them.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            color="primary"
            as={Link}
            to="/events/create"
            endContent={
              <span className="flex w-[18px] h-[18px] border text-center justify-center items-center rounded-sm text-lg">
                +
              </span>
            }>
            Create new
          </Button>
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
    <>
      {renderHeader()}

      <div className="flow-root h-full mt-8">
        <div className="h-full -mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block h-full min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {getView()}
            {getPagination()}
          </div>
        </div>
      </div>
    </>
  )
}
