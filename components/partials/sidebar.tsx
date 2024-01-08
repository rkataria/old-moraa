import { cn } from '@/lib/utils';
import { HomeIcon } from 'lucide-react';
import React from 'react'


const navigation = [
  { name: "Dashboard", href: "/events", icon: HomeIcon, current: true },
];

export const SidebarComponent = (props: {}) => {
  return (
    <div className="w-[300px] bg-primary h-screen hidden md:flex">

      <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <img
            className="h-8 w-auto"
            src="/logo.svg"
            alt="Your Company"
          />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={cn(
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
      </div>

    </div>
  )
}
