import React, { ReactElement } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { Control, Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { Input, Select, SelectItem } from '@nextui-org/react'

import { TimeZones } from '@/constants/timezone'

export const scheduleEventValidationSchema = yup.object({
  timezone: yup.string().required().label('Timezone'),
  startDate: yup.string().required().label('Start date'),
  endDate: yup.string().required().label('End date'),
  startTime: yup.string().required().label('Start time'),
  endTime: yup.string().required().label('End time'),
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
  const participantsForm = useForm<ScheduleEventFormData>({
    resolver: yupResolver(scheduleEventValidationSchema),
    defaultValues: defaultValue || {
      startDate: '',
      startTime: '12:00',
      endDate: '',
      endTime: '13:00',
      timezone: '',
    },
  })

  const control = (formControl ||
    participantsForm.control) as Control<ScheduleEventFormData>

  const FormContentJSX = (
    <div id="schedule-event-form">
      <Controller
        control={control}
        name="timezone"
        render={({ field, fieldState }) => (
          <Select
            {...field}
            selectedKeys={field.value ? [field.value] : undefined}
            selectionMode="single"
            items={TimeZones}
            variant="bordered"
            className="mb-4"
            label="Timezone"
            isInvalid={!!fieldState.error?.message}
            errorMessage={fieldState.error?.message}>
            {(timezone) => (
              <SelectItem key={timezone.text} value={timezone.text}>
                {timezone.text}
              </SelectItem>
            )}
          </Select>
        )}
      />
      <div className="flex">
        <Controller
          control={control}
          name="startDate"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              variant="bordered"
              className="mb-4 mr-2"
              placeholder="Start Date"
              type="date"
              isInvalid={!!fieldState.error?.message}
              errorMessage={fieldState.error?.message}
              label="Start Date"
            />
          )}
        />
        <Controller
          control={control}
          name="startTime"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              variant="bordered"
              className="mb-4 ml-2"
              type="time"
              isInvalid={!!fieldState.error?.message}
              errorMessage={fieldState.error?.message}
              label="Start Time"
            />
          )}
        />
      </div>
      <div className="flex">
        <Controller
          control={control}
          name="endDate"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              placeholder="End Date"
              variant="bordered"
              className="mb-4 mr-2"
              type="date"
              isInvalid={!!fieldState.error?.message}
              errorMessage={fieldState.error?.message}
              label="End Date"
            />
          )}
        />
        <Controller
          control={control}
          name="endTime"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              variant="bordered"
              className="mb-4 ml-2"
              type="time"
              isInvalid={!!fieldState.error?.message}
              errorMessage={fieldState.error?.message}
              label="End Time"
            />
          )}
        />
      </div>
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
