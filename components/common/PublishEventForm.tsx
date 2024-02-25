"use client"

import { useParams } from "next/navigation"
import { useEvent } from "@/hooks/useEvent"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { ReactMultiEmail } from "react-multi-email"
import "react-multi-email/dist/style.css"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Stack,
} from "@chakra-ui/react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { TimeZones } from "@/constants/timezone"
import { useMutation } from "@tanstack/react-query"
import { createCustomTimeZoneDate, getBrowserTimeZone } from "@/utils/date"

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
  participants: yup
    .array(yup.string().label("Participant email").email().required())
    .required(),
})

type FormData = yup.InferType<typeof publishEventValidationSchema>

function NewEventForm({ onClose }: NewEventFormProps) {
  const { eventId } = useParams()
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
    id: eventId as string,
  })
  const publishEventForm = useForm<FormData>({
    resolver: yupResolver(publishEventValidationSchema),
    defaultValues: {
      eventName: event.name,
      description: event.description,
      participants: [],
      timezone: getBrowserTimeZone().text,
      startTime: "02:00",
      endTime: "05:00",
    },
  })

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
      participants: formData.participants.map((email: string) => {
        return { email: email, role: "Participant" }
      }),
    }
    publishEventMutation.mutate(JSON.stringify(payload))
  }

  return (
    <div>
      <form onSubmit={publishEventForm.handleSubmit(publishEvent)}>
        <Stack spacing={3}>
          <Controller
            control={publishEventForm.control}
            name="eventName"
            render={({ field, fieldState }) => (
              <FormControl size="xs" isInvalid={!!fieldState.error?.message}>
                <FormLabel>Event Name</FormLabel>
                <Input {...field} />
                <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
              </FormControl>
            )}
          />
          <Controller
            control={publishEventForm.control}
            name="description"
            render={({ field, fieldState }) => (
              <FormControl size="xs" isInvalid={!!fieldState.error?.message}>
                <FormLabel>Description</FormLabel>
                <Input {...field} type="textarea" />
                <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
              </FormControl>
            )}
          />
          <Controller
            control={publishEventForm.control}
            name="timezone"
            render={({ field, fieldState }) => (
              <FormControl size="xs" isInvalid={!!fieldState.error?.message}>
                <FormLabel>Timezone</FormLabel>
                <Select {...field}>
                  {TimeZones.map((timezone) => (
                    <option value={timezone.text}>{timezone.text}</option>
                  ))}
                </Select>
                <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
              </FormControl>
            )}
          />
          <div className="flex">
            <Controller
              control={publishEventForm.control}
              name="startDate"
              render={({ field, fieldState }) => (
                <FormControl
                  size="xs"
                  className="mr-2"
                  isInvalid={!!fieldState.error?.message}
                >
                  <FormLabel>Start Date</FormLabel>
                  <Input {...field} type="date" />
                  <FormErrorMessage>
                    {fieldState.error?.message}
                  </FormErrorMessage>
                </FormControl>
              )}
            />
            <Controller
              control={publishEventForm.control}
              name="startTime"
              render={({ field, fieldState }) => (
                <FormControl
                  size="xs"
                  className="ml-2"
                  isInvalid={!!fieldState.error?.message}
                >
                  <FormLabel>Start Time</FormLabel>
                  <Input {...field} type="time" />
                  <FormErrorMessage>
                    {fieldState.error?.message}
                  </FormErrorMessage>
                </FormControl>
              )}
            />
          </div>
          <div className="flex">
            <Controller
              control={publishEventForm.control}
              name="endDate"
              render={({ field, fieldState }) => (
                <FormControl
                  size="xs"
                  className="mr-2"
                  isInvalid={!!fieldState.error?.message}
                >
                  <FormLabel>End Date</FormLabel>
                  <Input {...field} type="date" />
                  <FormErrorMessage>
                    {fieldState.error?.message}
                  </FormErrorMessage>
                </FormControl>
              )}
            />
            <Controller
              control={publishEventForm.control}
              name="endTime"
              render={({ field, fieldState }) => (
                <FormControl
                  size="xs"
                  className="ml-2"
                  isInvalid={!!fieldState.error?.message}
                >
                  <FormLabel>End Time</FormLabel>
                  <Input {...field} type="time" />
                  <FormErrorMessage>
                    {fieldState.error?.message}
                  </FormErrorMessage>
                </FormControl>
              )}
            />
          </div>
          <Controller
            control={publishEventForm.control}
            name="participants"
            render={({ field, fieldState }) => (
              <FormControl size="xs" isInvalid={!!fieldState.error?.message}>
                <FormLabel>Participants</FormLabel>
                <ReactMultiEmail
                  {...field}
                  placeholder="Enter participant emails (Hit enter to add more)"
                  getLabel={(email, index, removeEmail) => {
                    return (
                      <div data-tag key={index}>
                        <div data-tag-item>{email}</div>
                        <span
                          data-tag-handle
                          onClick={() => removeEmail(index)}
                        >
                          ×
                        </span>
                      </div>
                    )
                  }}
                />
                <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
              </FormControl>
            )}
          />
          <div className="flex justify-end">
            <Button variant="outline" className="mr-4" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="black"
              variant="solid"
              type="submit"
              disabled={publishEventMutation.isPending}
              isLoading={publishEventMutation.isPending}
            >
              Publish
            </Button>
          </div>
        </Stack>
      </form>
    </div>
  )
}

export default NewEventForm
