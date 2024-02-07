"use client"

import { IconDotsVertical } from "@tabler/icons-react"
import { useRouter } from "next/navigation"

import Loading from "../common/Loading"
import { useEvents } from "@/hooks/useEvents"
import { getFormattedDate } from "@/utils/date"

function EventList() {
  const router = useRouter()
  const { events, isLoading } = useEvents()

  const handleRowClick = (id: string) => {
    router.push(`/events/${id}`)
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="h-96 flex justify-center items-center">
          <Loading />
        </div>
      )
    }

    return (
      <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-800">
        <thead>
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-300 sm:pl-0"
            >
              Name
            </th>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-300 sm:pl-0"
            >
              Created on
            </th>

            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-300 sm:pl-0"
            >
              Created by
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-300"
            >
              Status
            </th>
            <th
              scope="col"
              className="relative py-3.5 pl-3 pr-4 sm:pr-0 text-right"
            >
              <span className="sr-only">Action</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {events?.map((event: any) => (
            <tr
              key={event.name}
              onClick={() => handleRowClick(event.id)}
              className="hover:bg-purple-700/5 cursor-pointer"
            >
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-300 sm:pl-0">
                {event.name}
              </td>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-300 sm:pl-0">
                {getFormattedDate(event.created_at, { includeTime: true })}
              </td>

              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-300 sm:pl-0">
                {event.owner_id}
              </td>

              <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700  ring-1 ring-inset ring-gray-600/20">
                  {event.status}
                </span>
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 flex justify-end items-center gap-4">
                <button className="py-1 text-sm text-indigo-300 hover:text-indigo-900">
                  <IconDotsVertical size={20} />
                  <span className="sr-only">, {event.name}</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default EventList
