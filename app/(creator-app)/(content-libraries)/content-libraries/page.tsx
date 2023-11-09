import CreateContentPackModal from "@/components/workspace/CreateContentPackModal"
import DeckCard from "@/components/workspace/DeckCard"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export default async function ContentLibrariesPage({
  params,
}: {
  params: { workspaceId: string }
}) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase.from("content_decks").select()

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-black">Content Decks</h2>
          <p className="text-md font-normal text-gray-600">
            Content Deck is a tool for creating and managing content.
          </p>
        </div>
        <div>
          <CreateContentPackModal />
        </div>
      </div>
      <div className="mt-12">
        {data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 mt-4 h-96">
            <span className="text-gray-600">No content found.</span>
          </div>
        ) : (
          <ul
            role="list"
            className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-3 xl:gap-x-8"
          >
            {data?.map((data) => (
              <li key={data.id} className="relative cursor-pointer">
                <DeckCard deck={data} workspaceId={params.workspaceId} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
