"use client"

import { IconArrowLeft } from "@tabler/icons-react"
import clsx from "clsx"
import Link from "next/link"
import React, { useState } from "react"
import PublishEventButtonWithModal from "../common/PublishEventButtonWithModal"

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
  return (
    <div className="fixed left-0 top-0 w-full h-26 z-50 p-2 bg-white">
      <div className="flex justify-between items-center h-12 w-full">
        <div className="flex justify-start items-center gap-2">
          <Link href="/events">
            <IconArrowLeft size={20} />
          </Link>
          <span className="font-bold">{event.name}</span>
        </div>
        <div className="flex justify-start items-center gap-2 bg-white px-2 h-full">
          {event.status === EventType.DRAFT && <PublishEventButtonWithModal />}
          {event.status === EventType.PUBLISHED && (
            <>
              <button
                className={clsx(
                  styles.button.default,
                  "font-normal text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900 !rounded-full px-4"
                )}
                title="Publish Event"
              >
                Add participant
              </button>
              <button
                className={clsx(
                  styles.button.default,
                  "font-semibold text-sm bg-black text-white !rounded-full px-4"
                )}
                title="Publish Event"
              >
                Start Session
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
