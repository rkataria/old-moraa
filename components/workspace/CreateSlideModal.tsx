"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import ButtonWithModal from "../ButtonWithModal"
import { useRouter } from "next/navigation"
import ContentTypeDropdown from "./ContentTypeDropdown"

interface Slide {
  name: string
  description: string
  visibility: "public" | "private"
}

interface CreateSlideModalProps {}

export default function CreateSlideModal(props: CreateSlideModalProps) {
  const [hideModal, setHideModal] = useState<boolean>(false)
  const [creating, setCreating] = useState<boolean>(false)

  return (
    <ButtonWithModal buttonLabel="Create Slide" hide={hideModal}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">Name</label>
          <input
            type="text"
            disabled={creating}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
          />
        </div>

        <ContentTypeDropdown />

        <div className="flex justify-end mt-2">
          <button
            disabled={creating}
            className="px-6 py-2 text-white bg-black rounded-md"
          >
            {creating ? "Creating" : "Create"}
          </button>
        </div>
      </div>
    </ButtonWithModal>
  )
}
