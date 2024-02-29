"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { IconMoon, IconSun } from "@tabler/icons-react"

import { cn } from "@/utils/utils"
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly variant="bordered" className="rounded-full">
          <IconSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <IconMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem
          className={cn({ "font-bold": theme === "light" })}
          onClick={() => setTheme("light")}
        >
          Light
        </DropdownItem>
        <DropdownItem
          className={cn({ "font-bold": theme === "dark" })}
          onClick={() => setTheme("dark")}
        >
          Dark
        </DropdownItem>
        <DropdownItem
          className={cn({ "font-bold": theme === "system" })}
          onClick={() => setTheme("system")}
        >
          System
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
