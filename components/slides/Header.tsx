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
    <div className="fixed left-0 top-0 w-full h-16 z-50 bg-white">
      <div className="flex items-center justify-between h-full">
        <div className="flex justify-start items-center gap-2">
          <div className="w-48 h-full pl-6 flex justify-start items-center">
            <h2 className="text-lg font-bold text-purple-700">Learnsight</h2>
          </div>
          <div
            className={clsx("flex justify-start items-center gap-2 ml-2", {
              hidden: isToolboxCollapsed,
            })}
          >
            <Link href="/events" className={styles.button.default}>
              <IconArrowLeft size={20} />
            </Link>
            <h3 className="font-semibold">{title}</h3>
          </div>
        </div>
        <div className="flex justify-start items-center gap-2 px-4 h-full">
          <button className={styles.button.default}>
            <IconBell size={20} />
          </button>
          <button className={styles.button.default}>
            <IconSettings size={20} />
          </button>
          <div className="bg-gray-200 cursor-pointer border-2 border-transparent hover:border-black rounded-full h-9 w-9 ml-2"></div>
        </div>
      </div>
    </div>
  )
}

export default Header
