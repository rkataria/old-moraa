import { useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Image, Textarea } from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
  useParams,
  useRouter,
} from '@tanstack/react-router'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { CiEdit } from 'react-icons/ci'
import { IoMdArrowBack } from 'react-icons/io'
import * as yup from 'yup'

import { ContentLoading } from '@/components/common/ContentLoading'
import { LocalFilePicker } from '@/components/common/LocalFilePicker'
import { IMAGE_PLACEHOLDER } from '@/constants/common'
import { useAuth } from '@/hooks/useAuth'
import { EventService } from '@/services/event.service'
import { FrameService } from '@/services/frame.service'
import { MeetingService } from '@/services/meeting.service'
import { SectionService } from '@/services/section.service'
import { ICreateEventPayload } from '@/types/event.type'
import { IFrame } from '@/types/frame.type'
import { getDefaultCoverFrame } from '@/utils/content.util'
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

export function EventsCreatePage() {
  const [showPageLoader, setShowPageLoader] = useState(false)
  const { eventId } = useParams({ strict: false })
  const [imageObject, setImageObject] = useState<string | undefined>(undefined)
  const [imageUploadProgress, setImageUploadProgress] = useState<number>(0)
  const [imageUploading, setImageUploading] = useState<boolean>(false)

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
    mutationFn: (data: ICreateEventPayload) =>
      EventService.createEvent(data).then(async (newEvent) => {
        const sectionResponse = await SectionService.createSection({
          name: 'Section 1',
          // TODO: Fix this meeting ID
          meeting_id: newEvent.data.meeting?.id,
          frames: [],
        }).catch(() => {
          toast.error(
            'Failed to create section in newly created event, Please try creating manually.'
          )
        })
        const firstFrame = getDefaultCoverFrame({
          name: createEventForm.getValues('name'),
          title: createEventForm.getValues('name'),
          description: createEventForm.getValues('description'),
        }) as IFrame

        const newFrame = await FrameService.createFrame({
          ...firstFrame,
          section_id: sectionResponse.data.id!,
          // TODO: Fix this meeting ID
          meeting_id: newEvent.data.meeting?.id,
        }).catch(() =>
          toast.error(
            'Failed to create frame in newly created event, Please try creating manually.'
          )
        )

        await Promise.allSettled([
          SectionService.updateSection({
            meetingId: newEvent.data.meeting.id,
            sectionId: sectionResponse.data.id!,
            payload: {
              frames: [newFrame.data.id],
            },
          }),
          MeetingService.updateMeeting({
            meetingId: newEvent.data.meeting.id!,
            meetingPayload: {
              sections: [sectionResponse.data.id],
            },
          }),
        ])

        return newEvent
      }),
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
      onSuccess: async ({ data }) => {
        if (data) {
          toast.success('Event has been created!')
          router.navigate({ to: `/events/${data.id}` })
          setShowPageLoader(true)
        }
      },
    })
  }

  if (showPageLoader) {
    return <ContentLoading fullPage />
  }

  const handleFileUpload = (imageUrl: string) => {
    createEventForm.setValue('imageUrl', imageUrl)
  }

  return (
    <div className="bg-gradient-to-b from-[#e9deff] to-[#feffe1] w-screen min-h-screen">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Link to="/events">
            <Button className="fixed top-6 left-6 !bg-transparent">
              <IoMdArrowBack />
              Back
            </Button>
          </Link>
        </div>
      </div>
      <form
        onSubmit={createEventForm.handleSubmit(onSubmit)}
        aria-label="new-event">
        <div className="max-w-[960px] mx-auto py-4 pt-8">
          <div className="grid grid-cols-[35%_65%] items-start gap-8">
            <div className="relative aspect-square">
              <Controller
                control={createEventForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <Image
                    src={imageObject || field.value || IMAGE_PLACEHOLDER}
                    classNames={{
                      img: 'w-full h-full object-cover border',
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
                trigger={
                  <div className="absolute z-10 flex items-center justify-center w-8 h-8 text-white transition-all duration-300 rounded-full cursor-pointer bottom-2 right-2 bg-black/40 hover:bg-black/50">
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
                      input:
                        'text-[40px] font-semibold tracking-tight text-black/80 leading-[50px]',
                      inputWrapper: 'border-none p-0 shadow-none',
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                      }
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
                    // eslint-disable-next-line jsx-a11y/label-has-associated-control
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

export const Route = createFileRoute('/events/create/')({
  component: EventsCreatePage,
})
