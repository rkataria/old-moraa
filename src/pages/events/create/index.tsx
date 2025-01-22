/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import {
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Textarea,
  useDisclosure,
} from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useParams, useRouter } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { TbFileDescription } from 'react-icons/tb'
import * as yup from 'yup'

import { ContentLoading } from '@/components/common/ContentLoading'
import { MediaPicker } from '@/components/common/MediaPicker/MediaPicker'
import { MoraaLogo } from '@/components/common/MoraaLogo'
import { ThemeEffects } from '@/components/events/ThemeEffects'
import { theme } from '@/components/events/ThemeModal'
import { ThemePicker } from '@/components/events/ThemePicker'
import { Button } from '@/components/ui/Button'
import { IMAGE_PLACEHOLDER } from '@/constants/common'
import { useAuth } from '@/hooks/useAuth'
import { EventService } from '@/services/event.service'
import { MeetingService } from '@/services/meeting.service'
import { SectionService } from '@/services/section.service'
import { uploadFile } from '@/services/storage.service'
import { ICreateEventPayload } from '@/types/event.type'
import { cn } from '@/utils/utils'

export type CreateEventFormData = yup.InferType<
  typeof createEventValidationSchema
>

const createEventValidationSchema = yup.object({
  // eslint-disable-next-line newline-per-chained-call
  name: yup.string().label('Event name').max(80).required(),
  description: yup.string().label('Event description'),
  eventType: yup.string().required(),
  imageUrl: yup.string(),
  theme: yup.mixed().optional().nullable(),
})

export function EventsCreatePage() {
  const [showPageLoader, setShowPageLoader] = useState(false)
  const { eventId } = useParams({ strict: false })
  const [imageObject, setImageObject] = useState<string | undefined>(undefined)
  const [imageUploadProgress, setImageUploadProgress] = useState<number>(0)
  const [imageUploading, setImageUploading] = useState<boolean>(false)
  const descriptionModalDisclosure = useDisclosure()
  const themeModalDisclosure = useDisclosure()

  const randomNumber = Math.floor(Math.random() * 16) + 1

  const defaultImage = `/images/invite/invite-${randomNumber}.jpg`

  const createEventForm = useForm<CreateEventFormData>({
    resolver: yupResolver(createEventValidationSchema),
    defaultValues: {
      name: '',
      description: '',
      eventType: 'workshop',
      imageUrl: defaultImage,
    },
  })

  const { currentUser } = useAuth()

  const router = useRouter()

  const eventMutation = useMutation({
    mutationFn: (data: ICreateEventPayload) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      EventService.createEvent(data).then(async (newEvent: any) => {
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

        await Promise.allSettled([
          SectionService.updateSection({
            meetingId: newEvent.data.meeting.id,
            sectionId: sectionResponse.data.id!,
            payload: {
              frames: [],
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
      theme: values.theme,
    }

    // eslint-disable-next-line consistent-return
    return eventMutation.mutateAsync(payload, {
      onSuccess: async ({ data }) => {
        if (data) {
          toast.success('Event has been created!')
          router.navigate({
            to: `/events/${data.id}`,
            search: (prev) => ({
              ...prev,
              action: 'edit',
            }),
          })
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

  const handleThemeChange = (selectedTheme: theme | null) => {
    createEventForm.setValue('theme', selectedTheme)
  }

  const selectedTheme = createEventForm.watch('theme') as theme

  return (
    <ThemeEffects
      className="w-screen min-h-screen grid place-items-center "
      selectedTheme={selectedTheme}>
      <MoraaLogo
        color="primary"
        onClick={() => router.navigate({ to: '/events' })}
        className="fixed left-0 top-0 m-8 cursor-pointer"
      />

      <motion.form
        className="relative z-10"
        initial={{ x: 30 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        onSubmit={createEventForm.handleSubmit(onSubmit)}
        aria-label="new-event">
        <div className="max-w-[990px] mx-auto py-4 pt-8">
          <div className="grid grid-cols-[40%_60%] items-start gap-8">
            <div className="h-full w-full">
              <div className="relative aspect-square rounded-lg border overflow-hidden">
                <Controller
                  control={createEventForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <Image
                      src={imageObject || field.value || IMAGE_PLACEHOLDER}
                      classNames={{
                        img: 'w-full h-full object-cover',
                        wrapper: '!max-w-none h-full',
                      }}
                    />
                  )}
                />

                {imageUploading && (
                  <div
                    className={cn(
                      'absolute left-0 top-0 w-full h-full flex justify-center items-center text-white text-md font-bold z-10 bg-black/80'
                    )}
                    style={{
                      opacity: 100 - imageUploadProgress,
                    }}>
                    {parseInt(imageUploadProgress.toString(), 10)}%
                  </div>
                )}

                <MediaPicker
                  ImageOrientation="squarish"
                  trigger={
                    <div className="absolute z-10 flex items-center justify-center w-8 h-8 text-white transition-all duration-300 rounded-full cursor-pointer bottom-2 right-2 bg-black/40 hover:bg-black/50">
                      <svg
                        className="mt-0.5 ml-0.5"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M17.2481 3.11458C17.2481 2.28854 16.9199 1.49634 16.3358 0.91224C15.7517 0.328143 14.9595 0 14.1335 0H3.11458C2.28854 0 1.49634 0.328143 0.91224 0.91224C0.328143 1.49634 0 2.28854 0 3.11458V14.1345C0 14.9605 0.328143 15.7527 0.91224 16.3368C1.49634 16.9209 2.28854 17.249 3.11458 17.249H7.82383L8.165 15.8844L8.18417 15.8115H3.11458C2.91781 15.8109 2.73189 15.779 2.55683 15.7157L8.12187 10.2676L8.20142 10.2005C8.33876 10.1005 8.5071 10.0523 8.67657 10.0646C8.84604 10.0769 9.00569 10.1488 9.12717 10.2676L11.1195 12.2188L12.1354 11.2029L10.1325 9.24025L10.0098 9.12908C9.59965 8.78504 9.0762 8.60587 8.54126 8.62641C8.00633 8.64696 7.49816 8.86576 7.11562 9.24025L1.53621 14.7027C1.47164 14.5202 1.43827 14.3281 1.4375 14.1345V3.11363C1.4375 2.18788 2.18788 1.43654 3.11458 1.43654H14.1345C15.0602 1.43654 15.8115 2.18788 15.8115 3.11363V7.889C16.2696 7.70692 16.7632 7.636 17.249 7.67817L17.2481 3.11458ZM13.8987 5.51233C13.8987 4.93995 13.6713 4.39101 13.2666 3.98628C12.8619 3.58154 12.3129 3.35417 11.7405 3.35417C11.1682 3.35417 10.6192 3.58154 10.2145 3.98628C9.80975 4.39101 9.58237 4.93995 9.58237 5.51233C9.58237 6.08471 9.80975 6.63365 10.2145 7.03839C10.6192 7.44312 11.1682 7.6705 11.7405 7.6705C12.3129 7.6705 12.8619 7.44312 13.2666 7.03839C13.6713 6.63365 13.8987 6.08471 13.8987 5.51233ZM11.0199 5.51233C11.0199 5.3212 11.0958 5.1379 11.231 5.00275C11.3661 4.86759 11.5494 4.79167 11.7405 4.79167C11.9317 4.79167 12.115 4.86759 12.2501 5.00275C12.3853 5.1379 12.4612 5.3212 12.4612 5.51233C12.4612 5.70347 12.3853 5.88677 12.2501 6.02192C12.115 6.15707 11.9317 6.233 11.7405 6.233C11.5494 6.233 11.3661 6.15707 11.231 6.02192C11.0958 5.88677 11.0199 5.70347 11.0199 5.51233ZM15.4282 9.26612L9.77212 14.9213C9.44258 15.2515 9.20847 15.6648 9.09458 16.1173L8.65662 17.871C8.46496 18.6348 9.15687 19.3258 9.91971 19.135L11.6735 18.6961C12.1258 18.5825 12.5391 18.3487 12.8695 18.0195L18.5246 12.3625C18.9248 11.9495 19.1466 11.3957 19.142 10.8206C19.1374 10.2455 18.9069 9.69524 18.5002 9.28863C18.0934 8.88203 17.5431 8.65167 16.968 8.64728C16.3929 8.64289 15.8392 8.86482 15.4263 9.26517"
                          fill="white"
                        />
                      </svg>
                    </div>
                  }
                  onSelect={async (file) => {
                    setImageUploading(true)
                    const response: any = await uploadFile({
                      file,
                      fileName: `${eventId}/event-image-.${file.name.split('.').pop()}`,
                      bucketName: import.meta.env.VITE_MORAA_ASSETS_BUCKET_NAME, // 'image-uploads',
                      onProgressChange: setImageUploadProgress,
                    }).promise

                    if (response?.url) {
                      handleFileUpload(response?.url)
                      setImageUploading(false)
                    }
                  }}
                  onSelectCallback={(imageElement) => {
                    setImageObject(imageElement.src)
                    handleFileUpload(imageElement.src)
                  }}
                />
              </div>
            </div>

            <div className="h-full flex flex-col justify-between gap-4 mr-16">
              <Controller
                control={createEventForm.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Textarea
                    autoFocus
                    {...field}
                    variant="bordered"
                    placeholder="Awesome event name here"
                    isInvalid={!!fieldState.error?.message}
                    errorMessage={fieldState.error?.message}
                    minRows={1}
                    classNames={{
                      input:
                        'text-[48px] font-semibold tracking-tight text-black/80 leading-[50px] placeholder:text-black/36',
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
              {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
              <div
                className="p-3 bg-default/30 backdrop-blur-xl rounded-lg cursor-pointer !h-full"
                // onClick={descriptionModalDisclosure.onOpen}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <TbFileDescription size={20} />
                    <p className="text-base">Brief headline</p>
                  </div>
                  {/* <BiExpandAlt
                    className="text-gray-400"
                    size={16}
                    onClick={descriptionModalDisclosure.onOpen}
                  /> */}
                </div>

                {/* <RenderIf
                  isTrue={createEventForm.getValues('description')!.length > 0}>
                  <p className="line-clamp-[7] break-all ml-1 mt-2">
                    {createEventForm.getValues('description')}
                  </p>
                </RenderIf> */}
                <Controller
                  control={createEventForm.control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <Textarea
                      {...field}
                      variant="bordered"
                      size="sm"
                      minRows={1}
                      maxRows={5}
                      placeholder="This is what your learners would see. You could include high-level learning objectives or brief course overview here"
                      classNames={{
                        input: 'tracking-tight text-lighter scrollbar-none',
                        inputWrapper: 'border-none p-0 shadow-none mt-4 pl-1',
                      }}
                      isInvalid={!!fieldState.error?.message}
                      errorMessage={fieldState.error?.message}
                    />
                  )}
                />
              </div>
              <ThemePicker
                selectedTheme={selectedTheme}
                disclosure={themeModalDisclosure}
                onThemeChange={handleThemeChange}
              />

              {/* <div>
                <div className="flex items-center gap-2">
                  <p className="text-gray-600">Type of event </p>
                  <Tooltip label="Your choice will help us recommended the right templates for you">
                    <div>
                      <BsInfoCircle />
                    </div>
                  </Tooltip>
                </div>

                <div className=" flex flex-col gap-4 mt-4">
                  {eventTypes.map((eventType) => (
                    // eslint-disable-next-line jsx-a11y/label-has-associated-control
                    <label>
                      <Controller
                        name="eventType"
                        control={createEventForm.control}
                        render={({ field }) => (
                          <div
                            className={cn(
                              'p-4 h-full flex gap-3 grid-rows-3 bg-white rounded-lg border border-transparent shadow-none duration-200 cursor-pointer',
                              {
                                'bg-primary shadow-lg':
                                  field.value === eventType.key,
                              }
                            )}>
                            <input
                              {...field}
                              type="radio"
                              value={eventType.key}
                              checked={field.value === eventType.key}
                              className="hidden"
                            />

                            <Image
                              src={eventType.iconUrl}
                              width={44}
                              className="border-1 border-gray-200 p-1 rounded-full"
                            />
                            <div>
                              <p
                                className={cn('text-gray-600 font-medium', {
                                  'text-white': field.value === eventType.key,
                                })}>
                                {eventType.label}
                              </p>
                              <p
                                className={cn('text-sm text-gray-600 mt-1', {
                                  'text-white': field.value === eventType.key,
                                })}>
                                {eventType.description}
                              </p>
                            </div>
                          </div>
                        )}
                      />
                    </label>
                  ))}
                </div>
              </div> */}
              <Modal
                size="xl"
                isOpen={descriptionModalDisclosure?.isOpen}
                onClose={descriptionModalDisclosure.onClose}>
                <ModalContent>
                  {() => (
                    <>
                      <ModalHeader className="flex flex-col gap-1 bg-primary text-white p-6">
                        <h2 className="font-md font-semibold">Description</h2>
                      </ModalHeader>
                      <ModalBody className="mt-4 mb-4">
                        <Controller
                          control={createEventForm.control}
                          name="description"
                          render={({ field, fieldState }) => (
                            <Textarea
                              {...field}
                              variant="bordered"
                              size="sm"
                              minRows={1}
                              maxRows={20}
                              placeholder="This is what your learners would see. You could include high-level learning objectives or brief course overview here"
                              classNames={{
                                input: 'tracking-tight text-lighter',
                                inputWrapper: 'border-none p-0 shadow-none',
                              }}
                              isInvalid={!!fieldState.error?.message}
                              errorMessage={fieldState.error?.message}
                            />
                          )}
                        />
                      </ModalBody>
                    </>
                  )}
                </ModalContent>
              </Modal>

              <Button
                style={{
                  background:
                    createEventForm.watch('name').length !== 0
                      ? 'linear-gradient(107.56deg, rgb(181, 10, 193) 0%, rgb(137, 47, 255) 100%)'
                      : '',
                }}
                size="lg"
                type="submit"
                className="w-full bg-primary text-white shadow-xl font-medium shrink-0"
                isLoading={eventMutation.isPending}
                isDisabled={createEventForm.watch('name').length === 0}>
                Create
              </Button>
            </div>
          </div>
        </div>
      </motion.form>
      <p className="fixed bottom-12 w-full text-center left-0 text-gray-600 z-[10]">
        Note: Once your event is created, you can manage everything in the
        <span
          style={{
            background:
              'linear-gradient(107.56deg, rgb(181, 10, 193) 0%, rgb(137, 47, 255) 100%)',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          className="font-semibold">
          {' '}
          Overview tab.
        </span>
      </p>
    </ThemeEffects>
  )
}

export const Route = createFileRoute('/events/create/')({
  component: EventsCreatePage,
})
