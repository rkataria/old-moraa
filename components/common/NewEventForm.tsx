import { redirect } from "next/navigation"
import FormControlStyles from "@/styles/form-control"
import { createClient } from "@/utils/supabase/client"

interface NewEventFormProps {
  onClose: () => void
}

function NewEventForm({ onClose }: NewEventFormProps) {
  async function create(formData: FormData) {
    const supabase = createClient()
    const currentUser = await supabase.auth.getSession()
    const event = {
      name: formData.get("name"),
      description: formData.get("description"),
      type: "course", //formData.get("type"),
      start_date: formData.get("start_date") || new Date(),
      end_date: formData.get("end_date") || new Date(),
      owner_id: currentUser.data.session?.user.id,
    }
    const { data, error } = await supabase
      .from("event")
      .insert([event])
      .select()
    if (error) {
      console.error(error)
      return
    }
    console.log("data", data)
    redirect(`/events/${data[0].id}`)
  }

  return (
    <div>
      <form action={create}>
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
                        rows={3}
                        className={FormControlStyles.textarea.base}
                        defaultValue={""}
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
                          id="start-date"
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
                          className={FormControlStyles.input.base}
                        />
                      </div>
                    </div>
                  </div>
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
