import { Bars3Icon } from "@heroicons/react/20/solid";
import React from "react";
import { ThemeSwitcher } from "../hooks/theme-switcher";
import { UserMenu } from "./user-menu";
import { IconComponent } from "../widgets/icon-component";
import { Input } from '@/components/ui/input'
import { SidebarMini } from "./sidebar-mini";

export const HeaderComponent = (props: {}) => {
  return (
    <div className="flex justify-between items-center shadow-md sticky top-0 z-40 ">
      <div className="hidden md:flex gap-2 ml-4">
        <IconComponent icon="search" />
        <Input className="border-none focus:outline-none focus:border-blue-500 focus:bg-blue-100" placeholder="Search" />
      </div>
      <div className="flex h-16 shrink-0 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <SidebarMini />
      </div>

      <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6 pr-2">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <ThemeSwitcher />
          <UserMenu />
        </div>
      </div>
    </div>
  );
};
