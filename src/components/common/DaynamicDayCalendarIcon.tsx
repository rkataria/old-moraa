export function DaynamicDayCalendarIcon({
  month,
  day,
}: {
  month: string
  day: string
}) {
  return (
    <div className="relative w-12 flex flex-col items-center">
      <div className="flex justify-center items-center w-full h-6 text-[10px] bg-foreground text-white border-2 border-b-0 border-foreground rounded-t-md">
        {month}
      </div>
      <div className="flex justify-center items-center w-full h-6 font-semibold bg-white text-foreground border-2 border-t-0 border-foreground rounded-b-md">
        {day}
      </div>

      {/* Hangers */}
      <div className="absolute -top-1 left-1/3 w-1 h-2 bg-gray-600 rounded-full" />
      <div className="absolute -top-1 right-1/3 w-1 h-2 bg-gray-600 rounded-full" />
    </div>
  )
}
