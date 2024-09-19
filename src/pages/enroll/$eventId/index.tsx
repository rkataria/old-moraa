import { useEffect, useState } from 'react'

import {
  Button,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import {
  createFileRoute,
  useLocation,
  useParams,
  useRouter,
} from '@tanstack/react-router'
import toast from 'react-hot-toast'
import { FaCheckCircle } from 'react-icons/fa'

import { ParticipantsFormData } from '@/components/common/AddParticipantsForm'
import { RichTextEditor } from '@/components/common/content-types/RichText/Editor'
import { ContentLoading } from '@/components/common/ContentLoading'
import { LogoWithName } from '@/components/common/Logo'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { IUserProfile, UserAvatar } from '@/components/common/UserAvatar'
import { Date } from '@/components/enroll/Date'
import { ThemeEffects } from '@/components/events/ThemeEffects'
import { useAuth } from '@/hooks/useAuth'
import { useEvent } from '@/hooks/useEvent'
import { EventService } from '@/services/event/event-service'

function Participantslist({
  participants = [],
}: {
  participants:
    | {
        id: string
        email: string
        event_role: string
        profile: IUserProfile | IUserProfile[]
      }[]
    | null
    | undefined
}) {
  if (!participants) return null
  const participantsWithoutHost = participants.filter(
    (p) => p.event_role !== 'Host'
  )

  if (participantsWithoutHost.length === 0) {
    return null
  }

  return (
    <div>
      <p className="mt-3 text-sm font-medium text-slate-500">
        {participantsWithoutHost.length} Going
      </p>
      <Divider className="mt-2 mb-3" />
      <div className="flex flex-wrap gap-8">
        {participantsWithoutHost.map((participant) => (
          <UserAvatar
            profile={participant.profile as IUserProfile}
            withName
            nameClass="font-medium"
          />
        ))}
      </div>
    </div>
  )
}

function Dates({
  startDate,
  endDate,
  timeZone,
}: {
  startDate: string | undefined
  endDate: string | undefined
  timeZone: string | undefined
}) {
  if (!startDate || !endDate || !timeZone) return null

  return (
    <div className="flex items-center gap-10 mt-6">
      <Date date={startDate} timezone={timeZone} />
      <Date date={endDate} timezone={timeZone} />
    </div>
  )
}

export const Route = createFileRoute('/enroll/$eventId/')({
  component: Visit,
})

export function Visit() {
  const router = useRouter()
  const location = useLocation()
  const { eventId } = useParams({ strict: false })
  const { autoEnroll } = location.search as {
    autoEnroll: string
  }
  const user = useAuth()

  const descriptionModalDisclosure = useDisclosure()

  const [showEditor, setShowEditor] = useState(true)
  const useEventData = useEvent({
    id: eventId as string,
    validateWithUser: false,
  })
  const eventPageUrl = `/events/${eventId}`

  const { event } = useEventData
  const { profile } = useEventData
  const participants =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useEventData?.participants?.map((p: any) => ({
      email: p.email,
      role: p.event_role,
    })) || []

  const isLoggedIn = user?.currentUser?.id
  const isEnrolled = !!useEventData.participants?.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p: any) => p.email === user?.currentUser?.email
  )

  const addParticipantsMutation = useMutation({
    mutationFn: async ({
      participants: _participants,
    }: ParticipantsFormData) => {
      try {
        const addResponse = await EventService.addParticipant({
          eventId: eventId as string,
          participants: _participants,
        })

        if (JSON.parse(addResponse?.data || '')?.success) {
          if (isLoggedIn) {
            router.navigate({
              to: eventPageUrl,
            })

            return
          }

          router.navigate({ to: `/login?redirectTo=/events/${eventId}` })
        }

        toast.success('Enrolled successfully.')
      } catch (err) {
        console.error(err)
        toast.error('Failed to enrolled participants')
      }
    },
  })

  useEffect(() => {
    if (autoEnroll && !isEnrolled && !useEventData.isFetching) {
      addParticipantsMutation.mutate({
        participants: [
          ...participants,
          { email: user.currentUser.email, role: 'Participant' },
        ],
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoEnroll, isEnrolled, useEventData.isFetching])

  const handleEnrollClick = () => {
    if (isEnrolled) {
      router.navigate({ to: `/events/${eventId}` })

      return
    }

    if (!isLoggedIn) {
      router.navigate({
        to: '/login',
        search: { redirectTo: `/enroll/${event.id}?autoEnroll=true` },
      })

      return
    }

    addParticipantsMutation.mutate({
      participants: [
        ...participants,
        { email: user.currentUser.email, role: 'Participant' },
      ],
    })
  }

  if (useEventData.isLoading) {
    return <ContentLoading fullPage />
  }

  if (!event) return null

  return (
    <ThemeEffects selectedTheme={event.theme} className="h-screen">
      <LogoWithName primary className="m-4" />
      <div className="overflow-y-scroll h-full relative z-[50] pb-40">
        <div className="max-w-[990px] mx-auto py-4 pt-8">
          <div className="grid grid-cols-[40%_60%] items-start gap-12">
            <Image
              src={
                event?.image_url ||
                'https://images.unsplash.com/photo-1525351159099-81893194469e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBhcnR5JTIwaW52aXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D'
              }
              classNames={{
                wrapper: 'w-full h-full',
                img: 'w-full object-cover rounded-3xl shadow-xl aspect-square',
              }}
            />
            <div className="h-full flex flex-col justify-between">
              <div>
                <p className="text-5xl font-bold mb-4">{event.name}</p>
                <p className="text-sm line-clamp-[8]">{event.description}</p>
                <RenderIf isTrue={event?.description?.length > 400}>
                  <Button
                    variant="faded"
                    className="text-xs text-gray-400 cursor-pointer w-fit p-1 h-6 border-1 my-4"
                    onClick={() => descriptionModalDisclosure.onOpen()}>
                    Read More
                  </Button>
                </RenderIf>
                <Dates
                  startDate={event?.start_date}
                  endDate={event?.end_date}
                  timeZone={event?.timezone}
                />
              </div>
              {isEnrolled && (
                <div className="flex items-center gap-2 mt-6">
                  <FaCheckCircle className="text-green-600 text-2xl" />
                  <p className="text-sm text-slate-500">You are enrolled!</p>
                </div>
              )}
              <div className="mt-10 flex items-center gap-2">
                <Button
                  type="submit"
                  className="w-full bg-black text-white shadow-xl"
                  isLoading={addParticipantsMutation.isPending}
                  onClick={handleEnrollClick}>
                  {isEnrolled
                    ? 'Go to event'
                    : addParticipantsMutation.isPending
                      ? 'Enrolling'
                      : 'Enroll'}
                </Button>
              </div>
            </div>
          </div>
          <p className="mt-8 text-sm font-medium text-slate-500">Hosted by</p>
          <Divider className="mt-2 mb-3" />
          <UserAvatar profile={profile} withName nameClass="font-medium" />

          <Participantslist participants={useEventData.participants} />
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
                    <p>{event.description}</p>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
          <RenderIf isTrue={!!showEditor}>
            <div className="mt-10 bg-default/30 shadow-sm backdrop-blur-2xl p-6 rounded-xl">
              <RichTextEditor
                editorId={eventId!}
                showHeader={false}
                editable={false}
                hideSideBar
                classNames={{ editorInPreview: 'overflow-y-visible' }}
                onEmptyContent={() => setShowEditor(false)}
              />
            </div>
          </RenderIf>
        </div>
      </div>
    </ThemeEffects>
  )
}
