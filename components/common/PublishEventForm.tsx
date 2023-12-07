import { redirect, useParams } from "next/navigation"
import FormControlStyles from "@/styles/form-control"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"

interface NewEventFormProps {
  onClose: () => void
}

interface IParticipant {
  email: string
  role?: string
}

function NewEventForm({ onClose }: NewEventFormProps) {
  const params = useParams()
  const [event, setEvent] = useState<any>(null)
  const [participants, setParticipants] = useState<IParticipant[]>([])

  useEffect(() => {
    async function fetchEvent() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("event")
        .select("*")
        .eq("id", params.eventId)
      if (error) {
        console.error(error)
        return
      }
      setEvent(data[0])
    }
    fetchEvent()
  }, [params.eventId])

  async function publish(formData: FormData) {
    if (!event) return

    const supabase = createClient()

    // console.log("participants", participants)

    // return

    const data = await supabase.functions.invoke("publish-event", {
      body: JSON.stringify({
        id: event?.id,
        name: formData.get("name"),
        description: formData.get("description"),
        // start_date: formData.get("start_date"),
        // end_date: formData.get("end-date"),
        participants: [
          { email: "nirajkaushal007@gmail.com" },
          { email: "rahul@rkataria.com" },
        ],
      }),
    })

    console.log("data", data)
    onClose()

    // const event = {
    //   name: formData.get("name"),
    //   description: formData.get("description"),
    //   type: formData.get("type"),
    // }
    // const { data, error } = await supabase
    //   .from("event")
    //   .insert([event])
    //   .select()
    // if (error) {
    //   console.error(error)
    //   return
    // }
    // console.log("data", data)
    // redirect(`/events/${data[0].id}`)
  }

  const handleParticipantEmailChange = (e: any) => {
    console.log("handleParticipantEmailChange", e.target.value, e)

    if (e.key === "Enter") {
      console.log("Enter pressed")
      // addParticipant({ email: e.target.value })
    }
  }

  // async function addParticipant() {
  //   if (!participant) return

  //   const participant: IParticipant = {
  //     email: participant.email,
  //   }
  //   setParticipants([...participants, participant])
  //   setParticipants
  // }

  return (
    <div>
      <form action={publish}>
        <div className="space-y-10 divide-y divide-gray-900/10">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Basic Information
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>

            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
              <div className="px-4 py-6 sm:p-8">
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="title"
                      className={FormControlStyles.label.base}
                    >
                      Title
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          type="text"
                          name="name"
                          id="title"
                          defaultValue={event?.name}
                          className={FormControlStyles.input.base}
                          placeholder="Learn to code"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="description"
                      className={FormControlStyles.label.base}
                    >
                      Description
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="description"
                        name="description"
                        rows={6}
                        defaultValue={event?.description}
                        className={FormControlStyles.textarea.base}
                      />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      Write a few sentences about the event.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Event Scheduling
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Schedule your event and make it visible to the public.
              </p>
            </div>

            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
              <div className="px-4 py-6 sm:p-8">
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="start-date"
                      className={FormControlStyles.label.base}
                    >
                      Start Date
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          type="datetime-local"
                          name="start_date"
                          id="startdate"
                          defaultValue={event?.start_date}
                          className={FormControlStyles.input.base}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="end-date"
                      className={FormControlStyles.label.base}
                    >
                      End Date
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          type="datetime-local"
                          name="end_date"
                          id="end-date"
                          defaultValue={event?.end_date}
                          className={FormControlStyles.input.base}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Event Participants
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Invite people to the event.
              </p>
            </div>

            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
              <div className="px-4 py-6 sm:p-8">
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="participant-email"
                      className={FormControlStyles.label.base}
                    >
                      Participant Email
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          type="email"
                          name="participant_email"
                          id="participant-email"
                          onChange={handleParticipantEmailChange}
                          className={FormControlStyles.input.base}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label className={FormControlStyles.label.base}></label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        {/* <button
                          className={FormControlStyles.input.base}
                          onClick={addParticipant}
                        >
                          Add Emaiil
                        </button> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  {participants.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold leading-5 text-gray-900">
                        Participants
                      </h3>
                      <ul className="mt-2 border-t border-gray-900/10 divide-y divide-gray-900/10">
                        {participants.map((participant) => (
                          <li
                            key={participant.email}
                            className="flex items-center justify-between py-3"
                          >
                            {participant.email}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default NewEventForm
