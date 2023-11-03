import Breadcrumb from "@/components/workspace/Breadcrumb"
import CreateSlideModal from "@/components/workspace/CreateSlideModal"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export default async function Index({
  params,
}: {
  params: { workspaceId: string; deckId: string }
}) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from("content_decks")
    .select("*")
    .eq("id", params.deckId)

  const deck = data?.[0]
  const pages = [
    {
      name: "Content Deck",
      href: `/workspace/${params.workspaceId}/content-library`,
      current: false,
    },
    {
      name: deck?.name,
      href: `/workspace/${params.workspaceId}/content-library/deck/${params.deckId}`,
      current: true,
    },
  ]

  if (error) {
    console.log(error)
    return <div>Error</div>
  }

  return (
    <div className="w-full p-4">
      <Breadcrumb
        homeLink={`/workspace/${params.workspaceId}`}
        pages={pages}
        className="mb-6"
      />
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-black">{deck.name}</h2>
          <p className="text-md font-normal text-gray-600">
            {deck.description}
          </p>
        </div>
        <div>
          <CreateSlideModal />
        </div>
      </div>
      <div className="mt-12">
        {data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 mt-4 h-96">
            <span className="text-gray-600">No slide found.</span>
          </div>
        ) : (
          <ul
            role="list"
            className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-3 xl:gap-x-8"
          >
            {data?.map((data) => (
              <li key={data.id} className="relative cursor-pointer">
                {/* <Slide deck={data} workspaceId={params.workspaceId} /> */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
