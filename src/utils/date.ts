import { DateTime, Interval, DurationUnit } from 'luxon'

export const getIsoDateString = (date: string) => new Date(date).toISOString()

export const getFormattedDate = (
  date: string,
  { includeTime = false }: { includeTime?: boolean } = {}
) =>
  DateTime.fromJSDate(new Date(date)).toFormat(
    includeTime ? 'LLL dd, yyyy HH:MM' : 'LLL DD, YYYY'
  )

export const convertTimeZoneOffsetToHHMM = (timeZoneOffset: number) => {
  // Determine the sign
  const sign = timeZoneOffset < 0 ? '-' : '+'

  // Calculate absolute hours and minutes
  const absHours = Math.floor(Math.abs(timeZoneOffset))
  const absMinutes = Math.round((Math.abs(timeZoneOffset) - absHours) * 60)

  // Ensure minutes are displayed with leading zero if necessary
  const formattedMinutes = absMinutes < 10 ? `0${absMinutes}` : absMinutes

  return `${sign + (absHours < 10 ? `0${absHours}` : absHours)}:${formattedMinutes}`
}

export const createCustomTimeZoneDate = (
  year: number,
  month: number,
  day: number,
  hours: number,
  minutes: number,
  timezoneOffsetHours: number
) => {
  // Create a new Date object with the provided year, month, day, hours, and minutes
  let customTimeZoneDate = new Date(year, month - 1, day, hours, minutes, 0, 0)

  // Calculate the local time by adding the offset
  const localTime =
    customTimeZoneDate.getTime() +
    customTimeZoneDate.getTimezoneOffset() * 60000 +
    timezoneOffsetHours * 3600000

  // Create a new Date object with the adjusted local time
  customTimeZoneDate = new Date(localTime)

  return customTimeZoneDate
}

/**
 * The `getBrowserTimeZone` can be used to retrieve the timezone object of browser.
 * The list of timezones is defined in constants/timezone file.
 * @returns {TimeZones}
 */
// export function getBrowserTimeZone(): (typeof TimeZones)[number] {
//   const formatter = new Intl.DateTimeFormat('en-US')
//   const resolvedTimezone = formatter.resolvedOptions().timeZone
//   const timeZone = TimeZones.find(({ utc }) =>
//     (utc || []).some((_tz) => _tz === resolvedTimezone)
//   )

//   return timeZone || TimeZones[0]
// }

export function getCurrentTimeInLocalZoneFromTimeZone({
  dateTimeString,
  utcTimeZone,
  format,
}: {
  dateTimeString: string
  utcTimeZone: string
  format?: string
}) {
  // const timeZone = TimeZones.filter((tz) => tz.text === utcTimeZone)

  if (utcTimeZone.length === 0) return ''
  const luxonTimeZone = utcTimeZone

  const dateTime = DateTime.fromISO(dateTimeString, {
    zone: luxonTimeZone,
  })

  const localDateTime = dateTime.setZone(DateTime.local().zoneName)

  if (!localDateTime.isValid) {
    return ''
  }

  if (format) {
    return localDateTime.toFormat(format)
  }

  const localDateTimeFormatted = localDateTime.toLocaleString({
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  return localDateTimeFormatted
}

export const parseInto12Hour = (time24: string) => {
  const dt = DateTime.fromFormat(time24, 'HH:mm')

  return dt.toFormat('hh:mm a')
}

export const getOffset = (timezone: string) => {
  const localTime = DateTime.now().setZone(timezone)

  const offsetMinutes = localTime.offset // offset is in minutes

  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60)
  const offsetMins = Math.abs(offsetMinutes) % 60

  const sign = offsetMinutes >= 0 ? '+' : '-'

  const formattedOffset = `${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMins).padStart(2, '0')}`

  return formattedOffset
}

export const nextRoundedHour = (addMinutes?: number) => {
  const now = DateTime.now()

  let timeGap

  if (now.minute >= 30) {
    timeGap = { minutes: 60 }
  } else {
    timeGap = { minutes: 30 }
  }

  if (addMinutes) {
    timeGap = { minutes: timeGap.minutes + addMinutes }
  }

  const nextHour = now
    .set({ minute: 0, second: 0, millisecond: 0 })
    .plus(timeGap)
  const formattedNextHour = nextHour.toFormat('HH:mm')

  return formattedNextHour
}

export const getDateDifferenceHumanize = ({
  startDate,
  endDate,
  durationUnit = ['hours', 'minutes'],
}: {
  startDate: string
  endDate: string
  durationUnit?: DurationUnit[]
}) => {
  const start = DateTime.fromISO(startDate)
  const finish = DateTime.fromISO(endDate)

  return Interval.fromDateTimes(start, finish).toDuration(durationUnit)
}
