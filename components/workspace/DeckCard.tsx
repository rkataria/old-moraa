"use client"

import { useRouter } from "next/navigation"

interface Deck {
  id: string
  name: string
  description: string
  slides: any[]
}

interface DeckCardProps {
  deck: Deck
  workspaceId: string
}

export default function DeckCard({ deck, workspaceId }: DeckCardProps) {
  const router = useRouter()

  const handleCardClick = (id: string) => {
    router.push(`/content-libraries/${id}/slides`)
  }

  return (
    <div
      className="relative cursor-pointer"
      onClick={() => handleCardClick(deck.id)}
    >
      <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 p-4">
        <div className="mb-8">
          <h4 className="pointer-events-none mt-2 block truncate text-md font-medium text-gray-900">
            {deck.name}
          </h4>
          <p className="pointer-events-none block text-sm text-gray-600">
            {deck.description}
          </p>
        </div>
        <p className="absolute right-1 bottom-1 pointer-events-none block text-sm font-medium text-gray-500 p-2">
          {deck.slides?.length || 0}
          {" slides"}
        </p>
      </div>
    </div>
  )
}
