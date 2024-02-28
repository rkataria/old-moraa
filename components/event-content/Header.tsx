"use client"

import { IconArrowLeft } from "@tabler/icons-react"
import clsx from "clsx"
import Link from "next/link"
// import PublishEventButtonWithModal from "../common/PublishEventButtonWithModal"
import AddParticipantsButtonWithModal from "../common/AddParticipantsButtonWithModal"
import { useAuth } from "@/hooks/useAuth"
import { useMemo } from "react"

enum EventType {
  PUBLISHED = "PUBLISHED",
  DRAFT = "DRAFT",
}

const styles = {
  button: {
    default:
      "flex justify-center items-center hover:bg-gray-800 hover:text-white transition-all duration-200 p-2 rounded-md",
  },
}

function Header({ event }: { event: any }) {
  const { currentUser } = useAuth()

  const userId = currentUser?.id
  const isOwner = useMemo(() => userId === event?.owner_id, [userId, event])
  return (
    <div className="fixed left-0 top-0 w-full h-26 z-50 p-2 bg-white">
      <div className="flex justify-between items-center h-12 w-full">
        <div className="flex justify-start items-center gap-2">
          <Link href="/events">
            <IconArrowLeft size={20} />
          </Link>
          <span className="font-bold">{event?.name}</span>
        </div>
        <div className="flex justify-start items-center gap-2 bg-white px-2 h-full">
          {/* {event?.status === EventType.DRAFT && userId === event.owner_id && (
            <PublishEventButtonWithModal eventId={event.id} />
          )} */}
          {event?.status === EventType.PUBLISHED && (
            <>
              {isOwner && <AddParticipantsButtonWithModal eventId={event.id} />}
              <Link
                href={`/event-session/${event.id}`}
                className={clsx(
                  styles.button.default,
                  "font-semibold text-sm bg-black text-white !rounded-full px-4"
                )}
                title="Start Session"
              >
                {isOwner ? "Start" : "Join"} Session
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
