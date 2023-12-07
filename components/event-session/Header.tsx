"use client"

import EventSessionContext from "@/contexts/EventSessionContext"
import { EventSessionContextType } from "@/types/event-session.type"
import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconLayoutSidebarRightCollapse,
} from "@tabler/icons-react"
import Link from "next/link"
import React, { useContext, useState } from "react"

const styles = {
  button: {
    default:
      "flex justify-center items-center bg-gray-200 hover:bg-gray-800 hover:text-white transition-all duration-200 py-2 px-4 text-xs font-semibold rounded-lg",
  },
}

function Header({ event, meeting }: { event: any; meeting: any }) {
  const handlePreviousSlide = () => {
    meeting?.participants.broadcastMessage("previous-slide", {})
  }

  const handleNextSlide = () => {
    meeting?.participants.broadcastMessage("next-slide", {})
  }

  return (
    <div className="fixed left-0 top-0 w-full z-50 py-1 px-2 bg-white">
      <div className="flex items-center justify-between h-12 w-full">
        <div className="flex justify-start items-center gap-2">
          <Link href="/events">
            <IconArrowLeft size={20} />
          </Link>
          <span className="font-bold">{event.name}</span>
        </div>
        <div className="flex justify-center items-center gap-2">
          <button
            className={styles.button.default}
            onClick={handlePreviousSlide}
          >
            <IconArrowLeft size={16} />
          </button>
          <button className={styles.button.default} onClick={handleNextSlide}>
            <IconArrowRight size={16} />
          </button>
        </div>
        <div className="flex justify-start items-center gap-2 bg-white px-4 h-full">
          <button className={styles.button.default}>Chat</button>
          <button className={styles.button.default}>
            <span className="px-3 py-[2px] bg-gray-400 text-[11px] rounded-full mr-1">
              {meeting.participants.count}
            </span>
            <span>Participants</span>
          </button>
          <div className="bg-gray-200 cursor-pointer border-2 border-transparent hover:border-black rounded-full h-9 w-9 ml-2"></div>
        </div>
      </div>
    </div>
  )
}

export default Header
