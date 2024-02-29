"use client"

import { useState } from "react"
import Modal from "./Modal"
import AddParticipantsForm, {
  ParticipantsFormData,
} from "./AddParticipantsForm"
import { useEvent } from "@/hooks/useEvent"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@nextui-org/react"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import clsx from "clsx"

const styles = {
  button: {
    default:
      "flex justify-center items-center hover:bg-gray-800 hover:text-white transition-all duration-200 p-2 rounded-md",
  },
}

function AddParticipantsButtonWithModal({ eventId }: { eventId: string }) {
  const [open, setOpen] = useState<boolean>(false)
  const { participants, refetch } = useEvent({
    id: eventId,
  })

  const addParticipantsMutations = useMutation({
    mutationFn: async ({ participants }: ParticipantsFormData) => {
      try {
        const supabase = createClientComponentClient()
        const payload = JSON.stringify({
          eventId: eventId,
          participants: participants.map((participant) => {
            return { email: participant.email, role: "Participant" }
          }),
        })
        await supabase.functions.invoke("invite-participants", {
          body: payload,
        })
        refetch()
        toast.success("Participants added successfully.")
        setOpen(false)
      } catch (err) {
        console.error(err)
        toast.error("Failed to add participants")
      }
    },
  })

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={clsx(
          styles.button.default,
          "cursor-pointer font-normal text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900 !rounded-full px-4"
        )}
      >
        Add Participants
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add Participants"
        description="Add participants to the event"
      >
        <AddParticipantsForm
          defaultValue={participants || []}
          onSubmit={addParticipantsMutations.mutate}
          renderAction={() => (
            <div className="flex justify-end">
              <Button
                variant="bordered"
                color="default"
                className="mr-2"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="solid"
                isLoading={addParticipantsMutations.isPending}
              >
                Save
              </Button>
            </div>
          )}
        />
      </Modal>
    </>
  )
}

export default AddParticipantsButtonWithModal
