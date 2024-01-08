import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Link from 'next/link'
import { useState } from "react";

type TUserNavigation =
  | {
    type: "link";
    name: string;
    href: string;
  }
  | {
    type: "action";
    name: string;
    visible?: boolean;
  };

export const UserMenu = () => {
  const [userNavigation] = useState<TUserNavigation[]>([
    { name: "Profile", href: "/profile", type: "link" },
    { name: "Logout", visible: true, type: "action" },
  ]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt="@shadcn"
            className="rounded-3xl"
          />
          <AvatarFallback className="dark:bg-[#34444d]">John</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {userNavigation.map((item, i) => {
            return (
              <>
                {item.type === "action" ? (
                  <DropdownMenuItem key={i} onClick={() => alert("hello")}>
                    {item.name}
                  </DropdownMenuItem>
                ) : (
                  <Link href={item.href}>
                    <DropdownMenuItem key={i}>
                      {item.name}
                    </DropdownMenuItem>
                  </Link>
                )}
              </>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
