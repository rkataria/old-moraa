"use client"

import { useParams } from "next/navigation"
import { useEvent } from "@/hooks/useEvent"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import "react-multi-email/dist/style.css"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Input, Select, SelectItem } from "@nextui-org/react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { TimeZones } from "@/constants/timezone"
import { useMutation } from "@tanstack/react-query"
import { createCustomTimeZoneDate, getBrowserTimeZone } from "@/utils/date"
import { useEffect } from "react"
import AddParticipantsForm, {
  participantsListValidationSchema,
} from "./AddParticipantsForm"
import { useUserContext } from "@/hooks/useAuth"

interface NewEventFormProps {
  eventId: string
  onClose: () => void
}

const publishEventValidationSchema = yup.object({
  eventName: yup.string().label("Event name").min(3).max(50).required(),
  description: yup
    .string()
    .label("Event description")
    .min(3)
    .max(200)
    .required(),
  timezone: yup.string().optional(),
  startDate: yup.string().optional(),
  endDate: yup.string().optional(),
  startTime: yup.string().optional(),
  endTime: yup.string().optional(),
  participants: participantsListValidationSchema,
})

type FormData = yup.InferType<typeof publishEventValidationSchema>

function NewEventForm({ onClose, eventId: _eventId }: NewEventFormProps) {
  const { eventId } = useParams()
  const userProfile = useUserContext()
  const publishEventMutation = useMutation({
    mutationFn: async (data: string) => {
      const supabase = createClientComponentClient()
      const response = await supabase.functions.invoke("publish-event", {
        body: data,
      })
      return new Promise((resolve) => {
        setTimeout(async () => {
          await refetch()
          resolve(response)
          onClose()
        }, 3000)
      })
    },
  })

  const { event, refetch } = useEvent({
    id: (eventId || _eventId) as string,
  })
  const publishEventForm = useForm<FormData>({
    resolver: yupResolver(publishEventValidationSchema),
    defaultValues: {
      startTime: "02:00",
      endTime: "05:00",
      participants: [
        {
          email: userProfile.currentUser.email,
        },
      ],
    },
  })

  useEffect(() => {
    if (!event) return
    publishEventForm.reset({
      eventName: event.name,
      description: event.description,

      // TODO: Pre-populate these emails
      participants: [
        {
          email: "",
        },
      ],
      timezone: getBrowserTimeZone().text,
    })
  }, [event])

  const publishEvent: SubmitHandler<FormData> = async (formData) => {
    if (!event) return
    const timezone = TimeZones.find((tz) => tz.text === formData.timezone)

    const [startYear = 1, startMonth = 1, startDay = 1] =
      formData.startDate?.split("-") || []
    const [startHours = "00", startMinutes = "00"] =
      formData.startTime?.split(":") || []

    const [endYear = 1, endMonth = 1, endDay = 1] =
      formData.endDate?.split("-") || []
    const [endHours = "00", endMinutes = "00"] =
      formData.endTime?.split(":") || []

    const startDate = createCustomTimeZoneDate(
      +startYear,
      +startMonth,
      +startDay,
      +startHours,
      +startMinutes,
      timezone?.offset || 0
    )
    const endDate = createCustomTimeZoneDate(
      +endYear,
      +endMonth,
      +endDay,
      +endHours,
      +endMinutes,
      timezone?.offset || 0
    )

    const payload = {
      id: event?.id,
      name: formData.eventName,
      description: formData.description,
      startDate: formData.startDate ? startDate : null,
      endDate: formData.endDate ? endDate : null,
      participants: formData.participants.map((participant) => {
        return { email: participant.email, role: "Participant" }
      }),
    }
    publishEventMutation.mutate(JSON.stringify(payload))
  }

  return (
    <div>
      <form onSubmit={publishEventForm.handleSubmit(publishEvent)}>
        <div>
          <Controller
            control={publishEventForm.control}
            name="eventName"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                variant="bordered"
                className="mb-4"
                isInvalid={!!fieldState.error?.message}
                errorMessage={fieldState.error?.message}
                label="Event Name"
              />
            )}
          />
          <Controller
            control={publishEventForm.control}
            name="description"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                variant="bordered"
                className="mb-4"
                type="textarea"
                isInvalid={!!fieldState.error?.message}
                errorMessage={fieldState.error?.message}
                label="Description"
              />
            )}
          />
          <Controller
            control={publishEventForm.control}
            name="timezone"
            render={({ field, fieldState }) => (
              <Select
                {...field}
                variant="bordered"
                className="mb-4"
                label="Timezone"
                isInvalid={!!fieldState.error?.message}
                errorMessage={fieldState.error?.message}
              >
                {TimeZones.map((timezone) => (
                  <SelectItem key={timezone.text} value={timezone.text}>
                    {timezone.text}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
          <div className="flex">
            <Controller
              control={publishEventForm.control}
              name="startDate"
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  variant="bordered"
                  className="mb-4 mr-2"
                  placeholder="Start Date"
                  type="date"
                  isInvalid={!!fieldState.error?.message}
                  errorMessage={fieldState.error?.message}
                  label="Start Date"
                />
              )}
            />
            <Controller
              control={publishEventForm.control}
              name="startTime"
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  variant="bordered"
                  className="mb-4 ml-2"
                  type="time"
                  isInvalid={!!fieldState.error?.message}
                  errorMessage={fieldState.error?.message}
                  label="Start Time"
                />
              )}
            />
          </div>
          <div className="flex">
            <Controller
              control={publishEventForm.control}
              name="endDate"
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  placeholder="End Date"
                  variant="bordered"
                  className="mb-4 mr-2"
                  type="date"
                  isInvalid={!!fieldState.error?.message}
                  errorMessage={fieldState.error?.message}
                  label="End Date"
                />
              )}
            />
            <Controller
              control={publishEventForm.control}
              name="endTime"
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  variant="bordered"
                  className="mb-4 ml-2"
                  type="time"
                  isInvalid={!!fieldState.error?.message}
                  errorMessage={fieldState.error?.message}
                  label="End Time"
                />
              )}
            />
          </div>
          <AddParticipantsForm formControl={publishEventForm.control} />
          <div className="flex justify-end">
            <Button variant="bordered" className="mr-4" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="solid"
              color="primary"
              type="submit"
              disabled={publishEventMutation.isPending}
              isLoading={publishEventMutation.isPending}
            >
              Publish
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default NewEventForm
