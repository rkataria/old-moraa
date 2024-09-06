/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { ReactElement, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import {
  Autocomplete,
  AutocompleteItem,
  Image,
  Textarea,
} from '@nextui-org/react'
import { useParams } from '@tanstack/react-router'
import { DateTime } from 'luxon'
import { Control, Controller, SubmitHandler, useForm } from 'react-hook-form'
import { CiEdit } from 'react-icons/ci'
import { GoDot, GoDotFill } from 'react-icons/go'
import { RiTimeZoneLine } from 'react-icons/ri'
import * as yup from 'yup'

import { LocalFilePicker } from './LocalFilePicker'
import { DateWithTime } from './Schedule/DateWithTime'

import { IMAGE_PLACEHOLDER } from '@/constants/common'
import { TimeZones } from '@/constants/timezone'
import { getOffset } from '@/utils/date'
import { cn } from '@/utils/utils'

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
      id?: string
      formControl?: Control<FormData>
      onSubmit?: void
      renderAction?: void
    }
  | {
      id?: string
      formControl?: never

      onSubmit?: (formData: FormData) => void
      /**
       * The action is responsible for triggering the `onSubmit` handler
       * so a least one of the button rendered using the `renderAction` should have `type="submit"`
       * @returns {ReactElement}
       */
      renderAction?: (renderProps: {
        hasNewChanges: boolean
      }) => ReactElement | null
    }
)

export function ScheduleEventForm<
  FormData extends ScheduleEventFormData = ScheduleEventFormData,
>({
  id,
  formControl,
  defaultValue,
  onSubmit,
  renderAction,
}: ScheduleEventFormProps<FormData>) {
  const [imageObject, setImageObject] = useState<string | undefined>(undefined)
  const [imageUploadProgress, setImageUploadProgress] = useState<number>(0)
  const [imageUploading, setImageUploading] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState('')
  const { eventId } = useParams({ strict: false })
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

  const handleFileUpload = (url: string) => {
    participantsForm.setValue('imageUrl', url, { shouldDirty: true })
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
      document.getElementsByName(`timezone-${id}`)?.[0]?.focus()
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
              <Image
                src={imageObject || field.value || IMAGE_PLACEHOLDER}
                classNames={{
                  img: 'w-full h-full object-cover',
                  wrapper: '!max-w-none h-full rounded-lg overflow-hidden',
                }}
              />
            )}
          />
          {imageUploading && (
            <div
              className={cn(
                'absolute left-0 top-0 w-full h-full flex justify-center items-center rounded-e-md text-white text-md font-bold z-10 bg-black/80'
              )}
              style={{
                opacity: 100 - imageUploadProgress,
              }}>
              {parseInt(imageUploadProgress.toString(), 10)}%
            </div>
          )}
          <LocalFilePicker
            accept="image/png, image/jpeg, image/jpg"
            fileName={`event-image-${eventId}`}
            bucketName="image-uploads"
            uploadRemote
            crop
            trigger={
              <div className="absolute z-10 flex items-center justify-center w-8 h-8 text-white transition-all duration-300 rounded-full cursor-pointer bottom-2 right-2 bg-black/40 hover:bg-black/50">
                <CiEdit size={20} />
              </div>
            }
            // eslint-disable-next-line @typescript-eslint/no-shadow
            onSelect={(imageObject) => {
              setImageUploading(true)
              setImageObject(imageObject)
            }}
            onUpload={(response) => {
              setImageUploading(false)
              handleFileUpload(response?.url)
            }}
            onProgressChange={setImageUploadProgress}
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
            <div className="relative grid gap-1 before:absolute before:content-[''] before:w-px before:h-[38%] before:-translate-y-2/4     before:border-l-[2px] before:border-l-black/50 before:border-dotted before:left-[9px] before:top-2/4">
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
                    name={`timezone-${id}`}
                    placeholder="Search timezone"
                    startContent={
                      <div className="absolute grid gap-1 top-0 mt-[6px]">
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

      {renderAction?.({ hasNewChanges: participantsForm.formState.isDirty })}
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
