/* eslint-disable jsx-a11y/label-has-associated-control */

import { ReactElement, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { Avatar, Image, Input, Textarea } from '@nextui-org/react'
import { Control, Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { LocalFilePicker } from './LocalFilePicker'

import { eventTypes } from '@/utils/event.util'
import { cn } from '@/utils/utils'

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
      renderAction?: ({
        disableAction,
      }: {
        disableAction: boolean
      }) => ReactElement
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      defaultValue?: any
    }

export function NewEventForm<
  FormData extends CreateEventFormData = CreateEventFormData,
>({ onSubmit, renderAction, defaultValue }: CreateEventFormProps<FormData>) {
  const [imageObject, setImageObject] = useState<string | undefined>(undefined)
  const [imageUploadProgress, setImageUploadProgress] = useState<number>(0)
  const [imageUploading, setImageUploading] = useState<boolean>(false)
  const createEventForm = useForm<CreateEventFormData>({
    resolver: yupResolver(createEventValidationSchema),
    defaultValues: defaultValue || {
      name: '',
      description: '',
      eventType: 'workshop',
      imageUrl: '',
    },
  })

  const handleFileUpload = (imageUrl: string) => {
    createEventForm.setValue('imageUrl', imageUrl)
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
        <LocalFilePicker
          accept="image/png, image/jpeg, image/jpg"
          fileName={`event-image-${Date.now()}`}
          bucketName="image-uploads"
          uploadRemote
          trigger={
            <div className="w-12 h-12 max-w-12 rounded-xl shrink-0 hover:bg-transparent relative overflow-hidden">
              <Controller
                control={createEventForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <Avatar
                    name="+"
                    isBordered
                    src={imageObject || field.value}
                    classNames={{
                      base: cn('w-full h-full rounded-xl bg-transparent', {
                        'border-2 border-default-200': !field.value,
                      }),
                      name: 'text-2xl text-slate-600',
                    }}
                  />
                )}
              />
              {imageUploading && (
                <div
                  className={cn(
                    'absolute left-0 top-0 w-full h-full flex justify-center items-center z-[1] rounded-e-md text-white text-md font-bold bg-black/80'
                  )}
                  style={{
                    opacity: 100 - imageUploadProgress,
                  }}>
                  {parseInt(imageUploadProgress.toString(), 10)}%
                </div>
              )}
            </div>
          }
          onSelect={(file) => {
            setImageUploading(true)
            const _imageObject = window.URL.createObjectURL(file)
            setImageObject(_imageObject)
          }}
          onUpload={(response) => {
            setImageUploading(false)
            handleFileUpload(response?.url)
          }}
          onProgressChange={setImageUploadProgress}
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

      {renderAction?.({
        disableAction: imageUploading,
      })}
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
