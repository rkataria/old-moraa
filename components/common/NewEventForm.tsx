/* eslint-disable jsx-a11y/label-has-associated-control */

import { ReactElement } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { Control, Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { Avatar, Image, Input, Textarea } from '@nextui-org/react'

import { FileUploader } from '../event-content/FileUploader'

import { cn } from '@/utils/utils'

interface IEventType {
  label: string
  iconUrl: string
  key: string
  disabled: boolean
}

const eventTypes: IEventType[] = [
  {
    label: 'Workshop',
    iconUrl: '/images/workshop.png',
    key: 'workshop',
    disabled: false,
  },
  {
    label: 'Course',
    iconUrl: '/images/mentor.png',
    key: 'course',
    disabled: true,
  },
  {
    label: 'Blended Program',
    iconUrl: '/images/certificate.png',
    key: 'blended-program',
    disabled: true,
  },
]

const createEventValidationSchema = yup.object({
  // eslint-disable-next-line newline-per-chained-call
  name: yup.string().label('Event name').max(50).required(),
  description: yup.string().label('Event description').max(200),
  eventType: yup.string().required(),
  imageUrl: yup.string(),
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      defaultValue?: any
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      defaultValue?: any
    }

export function NewEventForm<
  FormData extends CreateEventFormData = CreateEventFormData,
>({ onSubmit, renderAction, defaultValue }: CreateEventFormProps<FormData>) {
  const createEventForm = useForm<CreateEventFormData>({
    resolver: yupResolver(createEventValidationSchema),
    defaultValues: defaultValue || {
      name: '',
      description: '',
      eventType: 'workshop',
      imageUrl: '',
    },
  })

  const handleFileUpload = (
    files: {
      signedUrl: string
      meta: { name: string; size: number; type: string }
    }[]
  ) => {
    createEventForm.setValue('imageUrl', files[0].signedUrl)
  }
  const FormContentJSX = (
    <div>
      <div className="flex items-center gap-4">
        <Controller
          control={createEventForm.control}
          name="name"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              variant="bordered"
              label="Name"
              className="focus-visible:ring-0 text-black focus-visible:ring-offset-0 placeholder:text-gray-400"
              placeholder="Your awesome course or workshop name goes here"
              isInvalid={!!fieldState.error?.message}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
        <FileUploader
          maxNumberOfFiles={1}
          allowedFileTypes={['.jpg', '.jpeg', '.png']}
          triggerProps={{
            className:
              'w-14 h-14 max-w-14 rounded-xl shrink-0 hover:bg-transparent',
            isIconOnly: true,
            children: (
              <Controller
                control={createEventForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <Avatar
                    name="+"
                    isBordered
                    src={field.value}
                    classNames={{
                      base: cn('w-full h-full rounded-xl bg-transparent', {
                        'border-2 border-default-200': !field.value,
                      }),
                      name: 'text-2xl text-slate-600',
                    }}
                  />
                )}
              />
            ),
            variant: 'light',
          }}
          onFilesUploaded={handleFileUpload}
        />
      </div>

      <div className="my-4">
        <Controller
          control={createEventForm.control}
          name="description"
          render={({ field, fieldState }) => (
            <Textarea
              {...field}
              variant="bordered"
              label="Description"
              size="sm"
              placeholder="This is what your learners would see. You could include high-level learning objectives or brief course overview here"
              className="focus-visible:ring-0 text-black focus-visible:ring-offset-0 placeholder:text-gray-400"
              isInvalid={!!fieldState.error?.message}
              errorMessage={fieldState.error?.message}
            />
          )}
        />

        <div className="mt-6">
          <p className="text-sm font-medium mb-1">
            What will you use event for?
          </p>
          <p className="text-xs text-slate-400">
            Your choice will help us recommended the right templates for you.
          </p>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {eventTypes.map((eventType) => (
              <label>
                <Controller
                  name="eventType"
                  control={createEventForm.control}
                  render={({ field }) => (
                    <div
                      className={cn(
                        'p-3 grid gap-3 place-items-center text-center bg-[#F0F0F0] rounded-2xl border border-transparent shadow-none duration-200',
                        {
                          'border-[#7C3AED] shadow-md':
                            field.value === eventType.key,
                          'opacity-50': eventType.disabled,
                          'cursor-pointer': !eventType.disabled,
                        }
                      )}>
                      {!eventType.disabled && (
                        <input
                          {...field}
                          type="radio"
                          value={eventType.key}
                          checked={field.value === eventType.key}
                          className="hidden"
                        />
                      )}

                      <Image src={eventType.iconUrl} width={80} />
                      <p className="text-sm text-slate-600 font-medium">
                        {eventType.label}
                      </p>
                    </div>
                  )}
                />
              </label>
            ))}
          </div>
        </div>
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
