import { getCurrentTimeInLocalZoneFromTimeZone } from '@/utils/date'

export function Date({ date, timezone }: { date: string; timezone: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="rounded-lg border border-slate-300 w-12 h-12 overflow-hidden">
        <p className="text-[10px] py-[1px] text-center bg-slate-600 text-white">
          {getCurrentTimeInLocalZoneFromTimeZone({
            dateTimeString: date,
            utcTimeZone: timezone,
            format: 'MMM',
          })}
        </p>
        <p className="text-sm text-slate-700 text-center">
          {getCurrentTimeInLocalZoneFromTimeZone({
            dateTimeString: date,
            utcTimeZone: timezone,
            format: 'dd',
          })}
        </p>
      </div>
      <div className="flex flex-col justify-between h-full">
        <p className="font-semibold text-sm">
          {getCurrentTimeInLocalZoneFromTimeZone({
            dateTimeString: date,
            utcTimeZone: timezone,
            format: 'ccc',
          })}
        </p>
        <p className="text-sm">
          {getCurrentTimeInLocalZoneFromTimeZone({
            dateTimeString: date,
            utcTimeZone: timezone,
            format: 'hh:mm a',
          })}
        </p>
      </div>
    </div>
  )
}
