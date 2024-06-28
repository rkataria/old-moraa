/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { ReactElement, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { DateTime } from 'luxon'
import { Control, Controller, SubmitHandler, useForm } from 'react-hook-form'
import { CiEdit } from 'react-icons/ci'
import { GoDot, GoDotFill } from 'react-icons/go'
import { RiTimeZoneLine } from 'react-icons/ri'
import * as yup from 'yup'

import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Image,
  Textarea,
} from '@nextui-org/react'

import { DateWithTime } from './Schedule/DateWithTime'
import {
  FileUploader,
  FileWithoutSignedUrl,
} from '../event-content/FileUploader'

import { IMAGE_PLACEHOLDER } from '@/constants/common'
import { TimeZones } from '@/constants/timezone'
import { getOffset } from '@/utils/date'

const scheduleEventValidationSchema = yup.object({
  timezone: yup.string().required().label('Timezone'),
  startDate: yup.string().required().label('Start date'),
  endDate: yup
    .string()
    .required()
    .label('End date')
    .test(
      'is-greater-equal',
      'End date must be greater than or equal to start date',
      (value, { parent }) => {
        const { startDate } = parent
        if (!startDate || !value) return true // If either is not provided, let other validations handle it

        return DateTime.fromISO(value) >= DateTime.fromISO(startDate)
      }
    ),
  startTime: yup.string().required().label('Start time'),

  endTime: yup
    .string()
    .required()
    .label('End time')
    .test(
      'is-valid-end-time',
      'End time must be greater than start time for same day',
      (value, { parent }) => {
        const { startDate, endDate, startTime } = parent

        if (!startDate || !endDate || !value || !startTime) return true // Let other validations handle incomplete data

        const isStartDateEqualEndDate =
          DateTime.fromISO(startDate).toISODate() ===
          DateTime.fromISO(endDate).toISODate()

        if (isStartDateEqualEndDate) {
          const startDateTime = DateTime.fromISO(`${startDate}T${startTime}`)
          const endDateTime = DateTime.fromISO(`${endDate}T${value}`)

          return endDateTime > startDateTime
        }

        return true
      }
    ),
  imageUrl: yup.string(),
  name: yup.string(),
  description: yup.string(),
})

export type ScheduleEventFormData = yup.InferType<
  typeof scheduleEventValidationSchema
>
export type ScheduleEventFormProps<
  FormData extends ScheduleEventFormData = ScheduleEventFormData,
> = {
  defaultValue?: FormData
} & (
  | {
      formControl?: Control<FormData>
      onSubmit?: void
      renderAction?: void
    }
  | {
      formControl?: never
      onSubmit?: (formData: FormData) => void
      /**
       * The action is responsible for triggering the `onSubmit` handler
       * so a least one of the button rendered using the `renderAction` should have `type="submit"`
       * @returns {ReactElement}
       */
      renderAction?: () => ReactElement
    }
)

export function ScheduleEventForm<
  FormData extends ScheduleEventFormData = ScheduleEventFormData,
>({
  formControl,
  defaultValue,
  onSubmit,
  renderAction,
}: ScheduleEventFormProps<FormData>) {
  const [searchValue, setSearchValue] = useState('')

  const participantsForm = useForm<ScheduleEventFormData>({
    resolver: yupResolver(scheduleEventValidationSchema),
    defaultValues: defaultValue || {
      startDate: '',
      startTime: '12:00',
      endDate: '',
      endTime: '13:00',
      timezone: DateTime.local().zoneName,
      imageUrl: '',
    },
  })

  const control = (formControl ||
    participantsForm.control) as Control<ScheduleEventFormData>

  const handleFileUpload = (files: FileWithoutSignedUrl[]) => {
    const file = files?.[0]
    participantsForm.setValue('imageUrl', file.url)
  }

  const getTimeZoneValue = () => {
    const timeZone = TimeZones.find((tz) => tz.id === defaultValue?.timezone)
    if (timeZone) {
      return timeZone.name
    }

    return defaultValue?.timezone
  }

  const focusOnClick = () => {
    setTimeout(() => {
      document.getElementsByName('timezone')?.[0]?.focus()
    }, 16.25)
  }

  const FormContentJSX = (
    <div id="schedule-event-form">
      <div className="flex items-start gap-[1.875rem]">
        <div className="relative flex-1 aspect-square">
          <Controller
            control={control}
            name="imageUrl"
            render={({ field }) => (
              <Avatar
                src={field.value}
                fallback={
                  <Image src={IMAGE_PLACEHOLDER} className="w-full h-full" />
                }
                classNames={{
                  base: 'w-full h-full rounded-lg overflow-hidden',
                  img: 'h-full object-cover',
                  fallback: 'w-full h-full',
                }}
                showFallback
              />
            )}
          />
          <FileUploader
            maxNumberOfFiles={1}
            allowedFileTypes={['.jpg', '.jpeg', '.png']}
            bucketName="image-uploads"
            triggerProps={{
              className:
                'w-8 h-8 bg-black/60 text-white max-w-14 rounded-xl shrink-0 hover:bg-black/40 absolute right-0 bottom-0 m-3 z-[10] rounded-full border-2 border-white',
              isIconOnly: true,
              children: <CiEdit className="shrink-0 text-lg" />,
              variant: 'light',
            }}
            onPublicFilesUploaded={handleFileUpload}
          />
        </div>

        <div className="flex-1 grid gap-4">
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                variant="bordered"
                placeholder="Your awesome course or workshop name goes here"
                isInvalid={!!fieldState.error?.message}
                errorMessage={fieldState.error?.message}
                minRows={1}
                classNames={{
                  input: 'text-3xl font-bold tracking-tight text-black/80',
                  inputWrapper: 'border-none p-0 shadow-none',
                }}
              />
            )}
          />
          <div>
            <div className="relative grid gap-1 before:absolute before:content-[''] before:w-px before:h-[38%] before:-translate-y-2/4 before:z-[-1] before:border-l-[2px] before:border-l-black/50 before:border-dotted before:left-[9px] before:top-2/4">
              <div className="flex items-center gap-6 justify-between">
                <p className="text-gray-400 flex items-center gap-1 text-sm">
                  <GoDotFill className="text-xl" />
                  Start
                </p>
                <DateWithTime
                  dateName="startDate"
                  timeName="startTime"
                  control={control}
                />
              </div>
              <div className="flex items-center gap-6 justify-between">
                <p className="text-gray-400 flex items-center gap-1 text-sm">
                  <GoDot className="text-xl" />
                  End
                </p>
                <DateWithTime
                  dateName="endDate"
                  timeName="endTime"
                  control={control}
                />
              </div>
            </div>
            <div onClick={focusOnClick}>
              <Controller
                control={control}
                name="timezone"
                render={({ field, fieldState }) => (
                  <Autocomplete
                    variant="bordered"
                    name="timezone"
                    placeholder="Search timezone"
                    startContent={
                      <div className="absolute grid gap-1 top-0 z-[-1] mt-[6px]">
                        <RiTimeZoneLine className="text-lg text-gray-400" />
                        <p className="text-sm text-gray-400">
                          GMT{getOffset(field.value)}
                        </p>
                      </div>
                    }
                    className="mt-8"
                    defaultInputValue={getTimeZoneValue()}
                    defaultItems={TimeZones}
                    listboxProps={{ key: searchValue }}
                    onInputChange={(value_) => setSearchValue(value_)}
                    onKeyDown={focusOnClick}
                    onSelectionChange={field.onChange}
                    isInvalid={!!fieldState.error?.message}
                    errorMessage={fieldState.error?.message}
                    selectorButtonProps={{ children: null }}
                    inputProps={{
                      key: field.value,
                      classNames: {
                        inputWrapper: 'h-[84px] items-end p-2',
                        innerWrapper: 'items-end',
                        input: 'h-auto !p-0',
                      },
                    }}
                    selectedKey={field.value}
                    popoverProps={{ className: 'w-[22rem]' }}>
                    {(timeZone) => (
                      <AutocompleteItem
                        endContent={<p>{timeZone.value}</p>}
                        key={timeZone.id}
                        className="flex items-center justify-between">
                        {timeZone.name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      <Controller
        control={control}
        name="description"
        render={({ field, fieldState }) => (
          <Textarea
            {...field}
            variant="bordered"
            size="sm"
            placeholder="This is what your learners would see. You could include high-level learning objectives or brief course overview here"
            classNames={{
              input: 'tracking-tight',
              inputWrapper: 'border-none p-0 shadow-none my-7',
            }}
            isInvalid={!!fieldState.error?.message}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      {renderAction?.()}
    </div>
  )

  return (
    <div>
      {onSubmit ? (
        <form
          onSubmit={participantsForm.handleSubmit(
            onSubmit as SubmitHandler<ScheduleEventFormData>
          )}>
          {FormContentJSX}
        </form>
      ) : (
        FormContentJSX
      )}
    </div>
  )
}
