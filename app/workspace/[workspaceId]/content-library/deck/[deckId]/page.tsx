import Breadcrumb from "@/components/workspace/Breadcrumb"
import SlideManager from "@/components/workspace/SlideManager"
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
    <div className="w-full">
      {/* <Breadcrumb
        homeLink={`/workspace/${params.workspaceId}`}
        pages={pages}
        className="mb-6"
      /> */}

      <SlideManager />
    </div>
  )
}
