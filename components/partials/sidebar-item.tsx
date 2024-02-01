import { cn } from "@/utils/utils"
import { Grip, LucideIcon } from "lucide-react"
import React, { useState } from "react"

type TNavigation = {
  name: string
  href: string
  icon: LucideIcon
  current: boolean
}

export const SidebarItem = () => {
  const [navigation] = useState<TNavigation[]>([
    {
      name: "Events",
      href: "/events",
      icon: Grip,
      current: true,
    },
  ])
  return (
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" className="-mx-2 space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={cn(
                    "dark:bg-gray-900 dark:text-white",
                    item.current
                      ? "bg-primarylight text-white"
                      : "text-indigo-200 hover:text-white hover:bg-indigo-700",
                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                  )}
                >
                  <item.icon
                    className={cn(
                      item.current
                        ? "text-white"
                        : "text-indigo-200 group-hover:text-white",
                      "h-6 w-6 shrink-0"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </nav>
  )
}
