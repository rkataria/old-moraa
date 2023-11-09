"use client"

import {
  IconArrowBack,
  IconArrowForward,
  IconBell,
  IconChevronCompactLeft,
  IconSearch,
  IconSettings,
  IconUser,
} from "@tabler/icons-react"
import clsx from "clsx"
import React, { useState } from "react"

const styles = {
  button: {
    default:
      "flex justify-center items-center hover:bg-gray-800 hover:text-white transition-all duration-200 p-2 rounded-md",
  },
}

function Header() {
  const [isToolboxCollapsed, setIsToolboxCollapsed] = useState<boolean>(false)

  const collapseToolbox = () => {
    setIsToolboxCollapsed(!isToolboxCollapsed)
  }

  return (
    <div className="fixed left-0 top-0 w-full h-20 z-50 p-4 bg-transparent">
      <div className="flex items-center justify-between h-12 w-full">
        <div className="flex justify-start items-center gap-2 bg-white pl-4 pr-2 h-full shadow-lg rounded-md">
          <h2 className="text-lg font-bold pr-4 border-r-2 border-gray-200 text-purple-700">
            Learnsight
          </h2>
          <div
            className={clsx("flex justify-start items-center gap-2 ml-2", {
              hidden: isToolboxCollapsed,
            })}
          >
            <h3 className="font-semibold pr-4 border-r-2 border-gray-200">
              Learn to code by building real apps
            </h3>
            <button className={styles.button.default}>
              <IconArrowBack size={20} />
            </button>
            <button className={styles.button.default}>
              <IconArrowForward size={20} />
            </button>
            <button className={styles.button.default}>
              <IconSearch size={20} />
            </button>
          </div>
          <button
            className={clsx("flex justify-center items-center p-2 rounded-md", {
              "rotate-180": isToolboxCollapsed,
            })}
            onClick={collapseToolbox}
          >
            <IconChevronCompactLeft size={20} />
          </button>
        </div>
        <div className="flex justify-start items-center gap-2 bg-white px-4 h-full shadow-lg rounded-md">
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
