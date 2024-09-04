import { parseDate } from '@internationalized/date'
import {
  Button,
  DatePicker,
  DateValue,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'
import { DateTime } from 'luxon'
import { Control, Controller } from 'react-hook-form'

import { Times } from '@/constants/time.constant'
import { parseInto12Hour } from '@/utils/date'

interface IDateWithTime {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  dateName: string
  timeName: string
}

export function DateWithTime({ control, dateName, timeName }: IDateWithTime) {
  const getValue = (value: DateValue) => {
    const date = DateTime.fromObject({
      year: value.year,
      month: value.month,
      day: value.day,
    })

    const formattedDate = date.toFormat('yyyy-MM-dd')

    return formattedDate
  }

  return (
    <div className="flex gap-1">
      <Controller
        control={control}
        name={dateName}
        render={({ field, fieldState }) => (
          <div className="relative">
            <DatePicker
              selectorIcon={null}
              className="max-w-[284px] w-[9rem]"
              variant="bordered"
              isInvalid={!!fieldState.error?.message}
              startContent={
                <p className="absolute bg-white text-sm w-[70%] text-black">
                  {DateTime.fromISO(field.value).toFormat('ccc, dd LLL')}
                </p>
              }
              onChange={(value) =>
                field.onChange({
                  target: {
                    value: getValue(value),
                  },
                })
              }
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              value={parseDate(field.value) as any}
            />
            <p className="absolute -bottom-5 text-red-500 text-[0.625rem] min-w-max">
              {fieldState.error?.message}
            </p>
          </div>
        )}
      />
      <Controller
        control={control}
        name={timeName}
        render={({ field, fieldState }) => (
          <>
            <Dropdown
              showArrow
              classNames={{
                base: 'h-[23rem] w-[6rem] overflow-scroll shadow-md rounded-lg scrollbar-none',
              }}>
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  className="w-[98px]"
                  color={fieldState.error?.message ? 'danger' : 'default'}>
                  {parseInto12Hour(field.value)}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                items={Times}
                onAction={(value) => field.onChange({ target: { value } })}>
                {(item) => (
                  <DropdownItem key={item.label}>
                    {parseInto12Hour(item.label)}
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
            {fieldState.error?.message && (
              <p className="text-[0.625rem] absolute -bottom-8 text-red-500">
                {fieldState.error?.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  )
}
