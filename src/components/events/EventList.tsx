import { Key, useCallback, useMemo, useState } from 'react'

import { SortDescriptor, Pagination, Tabs, Tab } from '@heroui/react'
import { Link } from '@tanstack/react-router'
import { BsGrid, BsList } from 'react-icons/bs'
import { IoCalendarClear } from 'react-icons/io5'
import { MdOutlineAddBox } from 'react-icons/md'

import { GridView } from './GridView'
import { ListView } from './ListView'
import { EmptyPlaceholder } from '../common/EmptyPlaceholder'
import { getProfileName, IUserProfile } from '../common/UserAvatar'
import { Button } from '../ui/Button'

import { useAuth } from '@/hooks/useAuth'
import { useEvents } from '@/hooks/useEvents'
import { useProfile } from '@/hooks/useProfile'
import { UserType } from '@/types/common'

const rowsPerPage = 12

export function EventList() {
  const {
    data: profile = {
      user_type: null,
    },
  } = useProfile()
  const { currentUser } = useAuth()
  const [listDisplayMode, toggleListDisplayMode] = useState('grid' as Key)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>()
  const {
    events,
    count: totalEventsCount,
    isLoading,
    refetch,
  } = useEvents({
    from: (currentPage - 1) * rowsPerPage,
    to: currentPage * rowsPerPage - 1,
  })
  const isEducator = profile.user_type === UserType.EDUCATOR

  const pages = Math.ceil((totalEventsCount ?? 0) / rowsPerPage)

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
        icon={<IoCalendarClear className="text-[200px] text-gray-200" />}
        title="No upcoming events"
        description={`You don't have any upcoming events. ${isEducator ? 'Create one now!' : ''}`}
        actionButton={
          profile.user_type === UserType.EDUCATOR && (
            <Link to="/events/create">
              <Button
                size="sm"
                color="primary"
                endContent={<MdOutlineAddBox size={18} aria-hidden="true" />}>
                Create new
              </Button>
            </Link>
          )
        }
      />
    )
  }

  const renderHeader = () => {
    if (eventRows?.length === 0 && !isLoading) return null

    return (
      <div className="flex justify-between items-start">
        <div>
          <p className="text-2xl font-medium text-black/80">
            Hi there, {getProfileName(profile as IUserProfile)}!
          </p>
        </div>
        <Tabs
          keyboardActivation="manual"
          onSelectionChange={toggleListDisplayMode}
          size="sm"
          classNames={{
            tabList: 'p-0 border gap-0 bg-white',
            cursor: 'w-full bg-primary-100 rounded-none',
            tabContent: 'group-data-[selected=true]:text-primary',
            tab: 'p-2.5 data-[focus-visible=true]:outline-0',
          }}>
          <Tab key="grid" title={<BsGrid size={16} />} />
          <Tab key="list" title={<BsList size={16} />} />
        </Tabs>
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
    <div className="flex flex-col gap-4 w-full h-full">
      {renderHeader()}
      <div className="flex flex-col h-full">
        {getView()}
        {getPagination()}
      </div>
    </div>
  )
}
