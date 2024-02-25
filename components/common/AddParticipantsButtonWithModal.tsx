"use client"

import { useState } from "react"
import Modal from "./Modal"
import clsx from "clsx"
import AddParticipantsForm, {
  ParticipantsFormData,
} from "./AddParticipantsForm"
import { useEvent } from "@/hooks/useEvent"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"

const styles = {
  button: {
    default:
      "flex justify-center items-center hover:bg-gray-800 hover:text-white transition-all duration-200 p-2 rounded-md",
  },
}

function AddParticipantsButtonWithModal({ eventId }: { eventId: string }) {
  const [open, setOpen] = useState<boolean>(false)
  // const { event } = useEvent({
  //   id: eventId,
  // })
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
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="mb-8 flex justify-start items-center gap-2">
          <h1 className="text-xl font-semibold leading-6 text-gray-900">
            Add Participants
          </h1>
        </div>
        <AddParticipantsForm
          onSubmit={addParticipantsMutations.mutate}
          renderAction={() => (
            <div className="flex justify-end">
              <Button
                variant="outline"
                colorScheme="gray"
                className="mr-2"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
              <Button
                type="submit"
                colorScheme="brand"
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
