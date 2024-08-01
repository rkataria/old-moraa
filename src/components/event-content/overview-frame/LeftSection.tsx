import { useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Image, Textarea } from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { Controller, useForm } from 'react-hook-form'
import { CiEdit } from 'react-icons/ci'
import * as yup from 'yup'

import { LocalFilePicker } from '@/components/common/LocalFilePicker'
import { IMAGE_PLACEHOLDER } from '@/constants/common'
import { useEvent } from '@/hooks/useEvent'
import { EventService } from '@/services/event.service'
import { cn } from '@/utils/utils'

export type CreateEventFormData = yup.InferType<
  typeof createEventValidationSchema
>

const createEventValidationSchema = yup.object({
  // eslint-disable-next-line newline-per-chained-call
  name: yup.string().label('Event name').max(50).required(),
  description: yup.string().label('Event description').max(200),
  imageUrl: yup.string(),
})

export function LeftSection() {
  const [imageObject, setImageObject] = useState<string | undefined>(undefined)
  const [imageUploadProgress, setImageUploadProgress] = useState<number>(0)
  const [imageUploading, setImageUploading] = useState<boolean>(false)
  const { eventId } = useParams({ strict: false })
  const eventData = useEvent({ id: eventId })

  const { event } = eventData

  const createEventForm = useForm<CreateEventFormData>({
    resolver: yupResolver(createEventValidationSchema),
    defaultValues: {
      name: event.name,
      description: event.description,
      imageUrl: event.image_url,
    },
  })

  const updateEventMutation = useMutation({
    mutationFn: EventService.updateEvent,
  })

  const onSubmit = async (values: CreateEventFormData) => {
    const payload = {
      eventId: event.id,
      data: {
        name: values.name,
        description: values.description || '',
        image_url: values.imageUrl,
      },
    }

    // eslint-disable-next-line consistent-return
    return updateEventMutation.mutateAsync(payload, {
      onSuccess: () => {
        createEventForm.reset(createEventForm.getValues())
        eventData.refetch()
      },
    })
  }

  const handleFileUpload = (imageUrl: string) => {
    createEventForm.setValue('imageUrl', imageUrl, { shouldDirty: true })
  }

  return (
    <div className="">
      <form
        onSubmit={createEventForm.handleSubmit(onSubmit)}
        aria-label="new-event">
        <div className="py-4">
          <div className="grid items-start gap-8">
            <div className="relative aspect-video">
              <Controller
                control={createEventForm.control}
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
                fileName={`event-image-${event.id}`}
                bucketName="image-uploads"
                uploadRemote
                trigger={
                  <div className="absolute bottom-2 right-2 z-10 h-8 w-8 rounded-full bg-black/40 text-white flex justify-center items-center cursor-pointer hover:bg-black/50 transition-all duration-300">
                    <CiEdit size={20} />
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
            <div className="h-full flex flex-col justify-between gap-8">
              <Controller
                control={createEventForm.control}
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
              <Controller
                control={createEventForm.control}
                name="description"
                render={({ field, fieldState }) => (
                  <Textarea
                    {...field}
                    variant="bordered"
                    size="sm"
                    minRows={1}
                    placeholder="This is what your learners would see. You could include high-level learning objectives or brief course overview here"
                    classNames={{
                      input: 'tracking-tight',
                      inputWrapper: 'border-none p-0 shadow-none',
                    }}
                    isInvalid={!!fieldState.error?.message}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />
              {createEventForm.formState.isDirty && (
                <Button
                  type="submit"
                  color="primary"
                  variant="solid"
                  fullWidth
                  isLoading={updateEventMutation.isPending}>
                  Update
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export const Route = createFileRoute('/events/create/')({
  component: LeftSection,
})
