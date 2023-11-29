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

  const collapseToolbox = () => {
    setIsToolboxCollapsed(!isToolboxCollapsed)
  }

  return (
    <div className="fixed left-0 top-0 w-full h-20 z-50 bg-transparent">
      <div className="flex items-center justify-between h-12 w-full">
        <div className="flex justify-start items-center gap-2 bg-white pl-4 pr-2 h-full shadow-lg rounded-md w-full">
          <Link href="/events" className={styles.button.default}>
            <IconArrowLeft size={20} />
          </Link>
          <div
            className={clsx("flex justify-start items-center gap-2 ml-2", {
              hidden: isToolboxCollapsed,
            })}
          >
            <h3 className="font-semibold pr-4">{title}</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
