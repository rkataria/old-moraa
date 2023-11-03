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
  const supabase = createClient()
  const router = useRouter()

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
        {/* <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">
            Visibility
          </label>
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="visibility"
                className="w-4 h-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                checked={slide.visibility === "public"}
                onChange={() =>
                  setSlide({ ...slide, visibility: "public" })
                }
              />
              <span className="text-sm font-semibold text-gray-600">
                Public
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="visibility"
                className="w-4 h-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                checked={slide.visibility === "private"}
                onChange={() =>
                  setSlide({ ...slide, visibility: "private" })
                }
              />
              <span className="text-sm font-semibold text-gray-600">
                Private
              </span>
            </div>
          </div>
        </div> */}
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
