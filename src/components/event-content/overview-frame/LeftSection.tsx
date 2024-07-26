import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Image, Textarea } from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { Controller, useForm } from 'react-hook-form'
import { CiEdit } from 'react-icons/ci'
import * as yup from 'yup'

import {
  FileUploader,
  FileWithoutSignedUrl,
} from '@/components/event-content/FileUploader'
import { IMAGE_PLACEHOLDER } from '@/constants/common'
import { useEvent } from '@/hooks/useEvent'
import { EventService } from '@/services/event.service'

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
        eventData.refetch()
        createEventForm.reset(createEventForm.getValues())
      },
    })
  }

  const handleFileUpload = (files: FileWithoutSignedUrl[]) => {
    const file = files?.[0]
    createEventForm.setValue('imageUrl', file.url, { shouldDirty: true })
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
                    src={field.value || IMAGE_PLACEHOLDER}
                    classNames={{
                      img: 'w-full h-full object-cover',
                      wrapper: '!max-w-none h-full rounded-lg overflow-hidden',
                    }}
                  />
                )}
              />
              <FileUploader
                maxNumberOfFiles={1}
                allowedFileTypes={['.jpg', '.jpeg', '.png']}
                bucketName="image-uploads"
                triggerProps={{
                  className:
                    'min-w-8 w-8 h-8 bg-black/60 text-white max-w-14 border-2 border-white rounded-xl shrink-0 hover:bg-black/20 absolute right-0 bottom-0 m-3 z-[10] rounded-full',
                  isIconOnly: true,
                  children: <CiEdit className="shrink-0 text-lg" />,
                  variant: 'light',
                }}
                onPublicFilesUploaded={handleFileUpload}
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
                  className="w-full bg-black text-white shadow-xl"
                  isLoading={updateEventMutation.isPending}>
                  Save
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
