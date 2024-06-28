/* eslint-disable jsx-a11y/label-has-associated-control */

'use client'

import { useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { CiEdit } from 'react-icons/ci'
import { TbNotes } from 'react-icons/tb'
import * as yup from 'yup'

import { Button, Image, Textarea } from '@nextui-org/react'

import { ContentLoading } from '@/components/common/ContentLoading'
import { UserMenu } from '@/components/common/UserMenu'
import {
  FileUploader,
  FileWithoutSignedUrl,
} from '@/components/event-content/FileUploader'
import { IMAGE_PLACEHOLDER } from '@/constants/common'
import { useAuth } from '@/hooks/useAuth'
import { EventService } from '@/services/event.service'
import { eventTypes } from '@/utils/event.util'
import { cn } from '@/utils/utils'

export type CreateEventFormData = yup.InferType<
  typeof createEventValidationSchema
>

const createEventValidationSchema = yup.object({
  // eslint-disable-next-line newline-per-chained-call
  name: yup.string().label('Event name').max(50).required(),
  description: yup.string().label('Event description').max(200),
  eventType: yup.string().required(),
  imageUrl: yup.string(),
})

export default function EventsCreatePage() {
  const [showPageLoader, setShowPageLoader] = useState(false)

  const createEventForm = useForm<CreateEventFormData>({
    resolver: yupResolver(createEventValidationSchema),
    defaultValues: {
      name: '',
      description: '',
      eventType: 'workshop',
      imageUrl: '',
    },
  })

  const { currentUser } = useAuth()

  const router = useRouter()

  const eventMutation = useMutation({
    mutationFn: EventService.createEvent,
  })

  const onSubmit = async (values: CreateEventFormData) => {
    const payload = {
      name: values.name,
      description: values.description || '',
      type: values.eventType,
      owner_id: currentUser.id,
      start_date: null,
      end_date: null,
      image_url: values.imageUrl,
    }

    // eslint-disable-next-line consistent-return
    return eventMutation.mutateAsync(payload, {
      onSuccess: ({ data }) => {
        if (data) {
          toast.success('Event has been created!')
          router.push(`/events/${data.id}`)
          setShowPageLoader(true)
        }
      },
    })
  }

  if (showPageLoader) {
    return <ContentLoading fullPage />
  }

  const handleFileUpload = (files: FileWithoutSignedUrl[]) => {
    const file = files?.[0]
    createEventForm.setValue('imageUrl', file.url)
  }

  return (
    <div className="bg-gradient-to-b from-[#e9deff] to-[#feffe1] w-screen min-h-screen">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-10">
          <Image src="/logo-icon-square.svg" />
          <div>
            <Button
              as={Link}
              href="/events"
              variant="light"
              startContent={<TbNotes className="text-lg shrink-0" />}
              className="text-gray-600 text-sm flex items-center gap-1">
              Events
            </Button>
          </div>
        </div>

        <div>
          <UserMenu />
        </div>
      </div>
      <form
        onSubmit={createEventForm.handleSubmit(onSubmit)}
        aria-label="new-event">
        <div className="max-w-[960px] mx-auto py-4">
          <div className="grid grid-cols-[36%_64%] items-start gap-8">
            <div className="relative aspect-square">
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
                    'w-8 h-8 bg-black/60 text-white max-w-14 border-2 border-white rounded-xl shrink-0 hover:bg-black/20 absolute right-0 bottom-0 m-3 z-[10] rounded-full',
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
              <div>
                <p className="text-sm font-medium mb-1">
                  What will you use event for?
                </p>
                <p className="text-xs text-slate-400">
                  Your choice will help us recommended the right templates for
                  you.
                </p>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {eventTypes.map((eventType) => (
                    <label className="h-[15rem]">
                      <Controller
                        name="eventType"
                        control={createEventForm.control}
                        render={({ field }) => (
                          <div
                            className={cn(
                              'p-7 h-full grid gap-3 grid-rows-3 place-items-center text-center bg-white rounded-lg border border-transparent shadow-none duration-200',
                              {
                                'border-[#7C3AED] shadow-md':
                                  field.value === eventType.key,
                                'opacity-70': eventType.disabled,
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

                            <Image
                              src={eventType.iconUrl}
                              width={65}
                              className="border border-gray-200 p-2 rounded-full"
                            />
                            <p className="text-slate-600 font-semibold">
                              {eventType.label}
                            </p>
                            <p className="text-xs text-slate-600">
                              {eventType.description}
                            </p>
                          </div>
                        )}
                      />
                    </label>
                  ))}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-black text-white shadow-xl"
                isLoading={eventMutation.isPending}>
                Create
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
