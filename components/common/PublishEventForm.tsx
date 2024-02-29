"use client"

import { useParams } from "next/navigation"
import { useEvent } from "@/hooks/useEvent"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { ReactMultiEmail } from "react-multi-email"
import "react-multi-email/dist/style.css"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { TimeZones } from "@/constants/timezone"
import { useMutation } from "@tanstack/react-query"
import { createCustomTimeZoneDate, getBrowserTimeZone } from "@/utils/date"
import { useEffect } from "react"
import { Button, Input, Select, SelectItem } from "@nextui-org/react"
import styles from "@/styles/form-control"
import { cn } from "@/utils/utils"

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

function NewEventForm({ onClose, eventId: _eventId }: NewEventFormProps) {
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
    id: (eventId || _eventId) as string,
  })
  const publishEventForm = useForm<FormData>({
    resolver: yupResolver(publishEventValidationSchema),
    defaultValues: {
      startTime: "02:00",
      endTime: "05:00",
    },
  })

  useEffect(() => {
    if (!event) return
    publishEventForm.reset({
      eventName: event.name,
      description: event.description,
      participants: [],
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
      participants: formData.participants.map((email: string) => {
        return { email: email, role: "Participant" }
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
              <div className={styles.formControl.base}>
                <label className={styles.label.base}>Event Name</label>
                <Input {...field} />
                <p className="text-red-500">{fieldState.error?.message}</p>
              </div>
            )}
          />
          <Controller
            control={publishEventForm.control}
            name="description"
            render={({ field, fieldState }) => (
              <div className={styles.formControl.base}>
                <label className={styles.label.base}>Description</label>
                <Input {...field} type="textarea" />
                <p className="text-red-500">{fieldState.error?.message}</p>
              </div>
            )}
          />
          <Controller
            control={publishEventForm.control}
            name="timezone"
            render={({ field, fieldState }) => (
              <div className={styles.formControl.base}>
                <label className={styles.label.base}>Timezone</label>
                <Select {...field}>
                  {TimeZones.map((timezone, index) => (
                    <SelectItem key={`timezone-${index}`} value={timezone.text}>
                      {timezone.text}
                    </SelectItem>
                  ))}
                </Select>
                <p>{fieldState.error?.message}</p>
              </div>
            )}
          />
          <div className="flex">
            <Controller
              control={publishEventForm.control}
              name="startDate"
              render={({ field, fieldState }) => (
                <div className={cn(styles.formControl.base, "mr-2")}>
                  <label className={styles.label.base}>Start Date</label>
                  <Input {...field} type="date" />
                  <p>{fieldState.error?.message}</p>
                </div>
              )}
            />
            <Controller
              control={publishEventForm.control}
              name="startTime"
              render={({ field, fieldState }) => (
                <div className={cn(styles.formControl.base, "ml-2")}>
                  <label className={styles.label.base}>Start Time</label>
                  <Input {...field} type="time" />
                  <p className="text-red-500">{fieldState.error?.message}</p>
                </div>
              )}
            />
          </div>
          <div className="flex">
            <Controller
              control={publishEventForm.control}
              name="endDate"
              render={({ field, fieldState }) => (
                <div className={cn(styles.formControl.base, "mr-2")}>
                  <label className={styles.label.base}>End Date</label>
                  <Input {...field} type="date" />
                  <p className="text-red-500">{fieldState.error?.message}</p>
                </div>
              )}
            />
            <Controller
              control={publishEventForm.control}
              name="endTime"
              render={({ field, fieldState }) => (
                <div
                  className={cn(styles.formControl.base, "ml-2")}
                  // isInvalid={!!fieldState.error?.message}
                >
                  <label className={styles.label.base}>End Time</label>
                  <Input {...field} type="time" />
                  <p className="text-red-500">{fieldState.error?.message}</p>
                </div>
              )}
            />
          </div>
          <Controller
            control={publishEventForm.control}
            name="participants"
            render={({ field, fieldState }) => (
              <div className={styles.formControl.base}>
                <label className={styles.label.base}>Participants</label>
                <ReactMultiEmail
                  {...field}
                  placeholder="Enter participant emails (Hit enter to add more)"
                  getLabel={(
                    email: string,
                    index: number,
                    removeEmail: (i: number) => void
                  ) => {
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
                <div className="text-red-500">{fieldState.error?.message}</div>
              </div>
            )}
          />
          <div className="flex justify-end">
            <Button variant="ghost" className="mr-4" onClick={onClose}>
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
