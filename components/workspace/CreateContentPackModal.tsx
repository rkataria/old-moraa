"use client"

import { useState } from "react"
import ButtonWithModal from "../ButtonWithModal"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface ContentPack {
  name: string
  description: string
  visibility: "public" | "private"
}

interface CreateContentPackModalProps {}

export default function CreateContentPackModal(
  props: CreateContentPackModalProps
) {
  const [hideModal, setHideModal] = useState<boolean>(false)
  const [contentPack, setContentPack] = useState<ContentPack>({
    name: "",
    description: "",
    visibility: "public",
  })
  const [creating, setCreating] = useState<boolean>(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const createContentPack = async () => {
    setCreating(true)
    const { data, error } = await supabase
      .from("content_decks")
      .insert([
        { name: contentPack.name, description: contentPack.description },
      ])
      .select()

    console.log(contentPack)
    setCreating(false)

    if (error) {
      alert(error.message)
      return
    }
    setHideModal(true)
    router.refresh()
  }

  return (
    <ButtonWithModal buttonLabel="Create Content Deck" hide={hideModal}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">Name</label>
          <input
            type="text"
            disabled={creating}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
            value={contentPack.name}
            onChange={(e) =>
              setContentPack({ ...contentPack, name: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">
            Description
          </label>
          <textarea
            disabled={creating}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
            value={contentPack.description}
            onChange={(e) =>
              setContentPack({ ...contentPack, description: e.target.value })
            }
          />
        </div>
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
                checked={contentPack.visibility === "public"}
                onChange={() =>
                  setContentPack({ ...contentPack, visibility: "public" })
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
                checked={contentPack.visibility === "private"}
                onChange={() =>
                  setContentPack({ ...contentPack, visibility: "private" })
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
            onClick={createContentPack}
          >
            {creating ? "Creating" : "Create"}
          </button>
        </div>
      </div>
    </ButtonWithModal>
  )
}
