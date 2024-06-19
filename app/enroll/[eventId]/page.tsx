'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCheckCircle } from 'react-icons/fa'
import { MdOutlineEmail } from 'react-icons/md'
import * as yup from 'yup'

import { Button, Divider, Image, Input, User } from '@nextui-org/react'

import { ParticipantsFormData } from '@/components/common/AddParticipantsForm'
import { ContentLoading } from '@/components/common/ContentLoading'
import { MoraaLogo } from '@/components/common/MoraaLogo'
import { Date } from '@/components/enroll/Date'
import { useAuth } from '@/hooks/useAuth'
import { useEvent } from '@/hooks/useEvent'
import { EventService } from '@/services/event/event-service'
import { getAvatarForName } from '@/utils/utils'

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter valid email address')
    .required('Please enter your email address'),
})

function Participantslist({
  participants = [],
}: {
  participants:
    | { id: string; email: string; event_role: string }[]
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
          <User
            key={participant.id}
            name={participant.email}
            avatarProps={{
              src: getAvatarForName(participant.email),
            }}
            classNames={{ name: 'font-medium' }}
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

function Visit() {
  const router = useRouter()
  const { eventId }: { eventId: string } = useParams()
  const user = useAuth()
  const useEventData = useEvent({
    id: eventId as string,
    validateWithUser: false,
  })
  const eventPageUrl = `${window.location.origin}/events/${eventId}`

  const { event } = useEventData
  const { profile } = useEventData
  const participants =
    useEventData?.participants?.map((p) => ({
      email: p.email,
      role: p.event_role,
    })) || []

  const isLoggedIn = user?.currentUser?.id
  const isEnrolled = useEventData.participants?.find(
    (p) => p.email === user?.currentUser?.email
  )

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '' },
  })

  const addParticipantsMutation = useMutation({
    mutationFn: async ({
      participants: _participants,
    }: ParticipantsFormData) => {
      try {
        const addResponse = await EventService.addParticipant({
          eventId,
          participants: _participants,
        })

        if (JSON.parse(addResponse?.data || '')?.success) {
          if (isLoggedIn) {
            router.push(eventPageUrl)

            return
          }

          router.push(`/login?redirectTo=/events/${eventId}`)
        }

        toast.success('Enrolled successfully.')
      } catch (err) {
        console.error(err)
        toast.error('Failed to enrolled participants')
      }
    },
  })

  const getProfileName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`
    }

    return null
  }

  const hostName = getProfileName()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEnrollClick = (data: any) => {
    if (isEnrolled) {
      router.push(`${window.location.origin}/events/${eventId}`)

      return
    }

    if (isLoggedIn) {
      addParticipantsMutation.mutate({
        participants: [
          ...participants,
          { email: user.currentUser.email, role: 'Participant' },
        ],
      })

      return
    }

    addParticipantsMutation.mutate({
      participants: [
        ...participants,
        { email: data.email, role: 'Participant' },
      ],
    })
  }

  if (useEventData.isLoading) {
    return <ContentLoading fullPage />
  }
  if (!event) return null

  return (
    <div className="bg-gradient-to-b from-[#e9deff] to-[#feffe1] w-screen h-screen">
      <MoraaLogo color="primary" className="scale-[0.7] origin-left ml-6" />
      <div className="max-w-[960px] mx-auto py-[5rem]">
        <div className="grid grid-cols-[0.5fr_1fr] items-start gap-[3rem]">
          <Image
            src={
              event?.image_url ||
              'https://images.unsplash.com/photo-1525351159099-81893194469e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBhcnR5JTIwaW52aXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D'
            }
            classNames={{
              wrapper: 'w-full h-full',
              img: 'w-full object-cover h-full rounded-3xl shadow-xl w-[20rem] h-[20rem]',
            }}
          />
          <div className="h-full flex flex-col justify-between">
            <div>
              <p className="text-5xl font-bold mb-4">{event.name}</p>
              <p className="text-slate-400 text-sm">{event.description}</p>
              <Dates
                startDate={event?.start_date}
                endDate={event?.end_date}
                timeZone={event?.timezone}
              />
            </div>
            {isEnrolled && (
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-600 text-2xl" />
                <p className="text-sm text-slate-500">You are enrolled!</p>
              </div>
            )}
            <div className="mt-10 flex items-center gap-2">
              {!isLoggedIn && (
                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="relative w-full">
                      <Input
                        type="email"
                        {...field}
                        placeholder="you@example.com"
                        labelPlacement="outside"
                        variant="bordered"
                        startContent={
                          <MdOutlineEmail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        isInvalid={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                        classNames={{
                          inputWrapper: 'shadow-none',
                          helperWrapper: 'py-0 absolute -bottom-5',
                        }}
                      />
                    </div>
                  )}
                />
              )}

              <Button
                type="submit"
                className="w-full bg-black text-white shadow-xl"
                isLoading={addParticipantsMutation.isPending}
                onClick={
                  isLoggedIn
                    ? handleEnrollClick
                    : handleSubmit(handleEnrollClick)
                }>
                {isEnrolled ? 'Go to event' : 'Enroll'}
              </Button>
            </div>
          </div>
        </div>
        <p className="mt-8 text-sm font-medium text-slate-500">Hosted by</p>
        <Divider className="mt-2 mb-3" />
        <User
          name={hostName}
          avatarProps={{
            src: hostName
              ? getAvatarForName(hostName)
              : 'https://github.com/shadcn.png',
          }}
          classNames={{ name: 'font-medium' }}
        />
        <Participantslist participants={useEventData.participants} />
      </div>
    </div>
  )
}

export default Visit
