import { DaynamicDayCalendarIcon } from '../common/DaynamicDayCalendarIcon'

import {
  getCurrentTimeInLocalZoneFromTimeZone,
  getDateDifferenceHumanize,
} from '@/utils/date'

export function EventDate({
  startDate,
  endDate,
  timezone,
}: {
  startDate: string
  endDate: string
  timezone: string
}) {
  const month = getCurrentTimeInLocalZoneFromTimeZone({
    dateTimeString: startDate,
    utcTimeZone: timezone,
    format: 'MMM',
  })

  const day = getCurrentTimeInLocalZoneFromTimeZone({
    dateTimeString: startDate,
    utcTimeZone: timezone,
    format: 'dd',
  })

  const duration = getDateDifferenceHumanize({
    startDate: startDate as string,
    endDate: endDate as string,
  }).toHuman({ listStyle: 'narrow' })

  // Remove 0 minutes from the duration string
  const removeZeroDuration = duration.replace(', 0 minutes', '')

  return (
    <div className="flex justify-start items-center gap-2">
      <DaynamicDayCalendarIcon month={month} day={day} />
      <div className="flex flex-col gap-0.5">
        <p className="font-semibold text-sm">
          {getCurrentTimeInLocalZoneFromTimeZone({
            dateTimeString: startDate as string,
            utcTimeZone: timezone as string,
            format: 'hh:mm a (ZZZZ)',
          })}
        </p>
        <p className="text-gray-700 text-xs">{removeZeroDuration}</p>
      </div>
    </div>
  )
}
