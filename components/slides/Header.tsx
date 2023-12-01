"use client"

import {
  IconArrowBack,
  IconArrowForward,
  IconArrowLeft,
  IconBell,
  IconChevronCompactLeft,
  IconSearch,
  IconSettings,
  IconUser,
  IconUsers,
} from "@tabler/icons-react"
import clsx from "clsx"
import Link from "next/link"
import React, { useState } from "react"

const styles = {
  button: {
    default:
      "flex justify-center items-center hover:bg-gray-800 hover:text-white transition-all duration-200 p-2 rounded-md",
  },
}

function Header({ title = "Title" }: { title?: string }) {
  const [isToolboxCollapsed, setIsToolboxCollapsed] = useState<boolean>(false)

  const openSettings = () => {}

  return (
    <div className="fixed left-0 top-0 w-full h-26 z-50 p-2 bg-transparent pointer-events-none">
      <div className="flex justify-end items-center h-12 w-full">
        <div className="flex justify-start items-center gap-2 bg-white px-2 h-full shadow-lg rounded-md pointer-events-auto">
          <Link
            href="/events"
            className={styles.button.default}
            title="Manage Participants"
          >
            <IconUsers size={20} />
          </Link>
          <button
            onClick={openSettings}
            className={styles.button.default}
            title="Event Settings"
          >
            <IconSettings size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header
