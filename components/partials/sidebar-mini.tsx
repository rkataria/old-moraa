import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HomeIcon, Menu } from "lucide-react";
import { SidebarItem } from "./sidebar-item";

export const SidebarMini = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex md:hidden justify-center items-center cursor-pointer ">
          <Menu />
        </div>
      </SheetTrigger>
      <SheetContent side={"left"} className="bg-primary">
        <SheetHeader className="flex items-start">
          <SheetTitle className="text-white">Learn Sight</SheetTitle>
        </SheetHeader>
        <div className="py-6">
          <SidebarItem />
        </div>
      </SheetContent>
    </Sheet>
  );
};
