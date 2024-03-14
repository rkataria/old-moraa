/* eslint-disable jsx-a11y/label-has-associated-control */

import { ReactElement } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { Control, Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { Input, Textarea } from '@nextui-org/react'

import { styles } from '@/styles/form-control'

const createEventValidationSchema = yup.object({
  // eslint-disable-next-line newline-per-chained-call
  name: yup.string().label('Event name').min(3).max(50).required(),
  description: yup
    .string()
    .label('Event description')
    .min(3)
    .max(200)
    .required(),
})

export type CreateEventFormData = yup.InferType<
  typeof createEventValidationSchema
>

export type CreateEventFormProps<
  FormData extends CreateEventFormData = CreateEventFormData,
> =
  | {
      formControl?: Control<FormData>
      onSubmit?: void
      renderAction?: void
    }
  | {
      formControl?: never
      onSubmit?: (values: CreateEventFormData) => void
      /**
       * The action is responsible for triggering the `onSubmit` handler
       * so a least one of the button rendered using the `renderAction` should have `type="submit"`
       * @returns {ReactElement}
       */
      renderAction?: () => ReactElement
    }

export function NewEventForm<
  FormData extends CreateEventFormData = CreateEventFormData,
>({ onSubmit, renderAction }: CreateEventFormProps<FormData>) {
  const createEventForm = useForm<CreateEventFormData>({
    resolver: yupResolver(createEventValidationSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const FormContentJSX = (
    <div>
      <label htmlFor="name" className={styles.label.base}>
        Name
      </label>
      <Controller
        control={createEventForm.control}
        name="name"
        render={({ field, fieldState }) => (
          <Input
            {...field}
            className="focus-visible:ring-0 text-black focus-visible:ring-offset-0 placeholder:text-gray-400"
            placeholder="Your awesome course or workshop name goes here"
            isInvalid={!!fieldState.error?.message}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <div className="my-4">
        <label className={styles.label.base}>Description</label>
        <Controller
          control={createEventForm.control}
          name="description"
          render={({ field, fieldState }) => (
            <Textarea
              {...field}
              placeholder="This is what your learners would see. You could include high-level learning objectives or brief course overview here"
              className="focus-visible:ring-0 text-black focus-visible:ring-offset-0 placeholder:text-gray-400"
              isInvalid={!!fieldState.error?.message}
              errorMessage={fieldState.error?.message}
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
        <form onSubmit={createEventForm.handleSubmit(onSubmit)}>
          {FormContentJSX}
        </form>
      ) : (
        FormContentJSX
      )}
    </div>
  )
}
