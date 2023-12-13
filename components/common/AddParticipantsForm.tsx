import { redirect, useParams } from "next/navigation";
import FormControlStyles from "@/styles/form-control";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const DEFAULT_EVENT_ROLE = "participant";
interface NewEventFormProps {
  onClose: () => void;
}

interface IParticipant {
  email: string;
  role?: string;
}

function AddParticipantsForm({ onClose }: NewEventFormProps) {
  const params = useParams();
  const [emails, setEmails] = useState<string[]>([]);
  const [event, setEvent] = useState<any>({});
  const [participants, setParticipants] = useState<IParticipant[]>([]);
  const [participant, setParticipant] = useState<string>("");

  useEffect(() => {
    async function fetchEvent() {
      const supabase = createClient();
      console.log(params.eventId);
      const { data, error } = await supabase
        .from("event")
        .select("*")
        .eq("id", params.eventId);
      if (error) {
        console.error(error);
        return;
      }

      console.log("data:", data);
      setEvent(data[0]);
      console.log("event: ", event);
    }
    fetchEvent();
  }, [params.eventId]);

  async function inviteParticipants(formData: FormData) {
    if (!event) return;

    const supabase = createClient();
    const payload = JSON.stringify({
      eventId: event?.id,
      participants: emails.map((email: string) => {
        return { email: email, role: "Participant" };
      }),
    });
    console.log(payload);
    const data = await supabase.functions.invoke("invite-participants", {
      body: payload,
    });

    console.log("data: ", data);
    onClose();
  }

  const handleEmailsInputChange = (e: any) => {
    const inputValue = e.target.value;
    const emailArray = inputValue
      .split(",")
      .map((email: string) => email.trim());

    // Set the emails as an array
    setEmails(emailArray);
    console.log(emailArray);
  };

  return (
    <div>
      <form action={inviteParticipants}>
        <div className="space-y-10 divide-y divide-gray-900/10">
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
                          type="text"
                          name="participant_email"
                          id="participant-email"
                          onChange={handleEmailsInputChange}
                          // onChange={(e) => setParticipant(e.target.value)}
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
                  {emails.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold leading-5 text-gray-900">
                        Participants
                      </h3>
                      <ul className="mt-2 border-t border-gray-900/10 divide-y divide-gray-900/10">
                        {emails.map((email) => (
                          <li
                            key={email}
                            className="flex items-center justify-between py-3"
                          >
                            {email}
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
  );
}

export default AddParticipantsForm;
