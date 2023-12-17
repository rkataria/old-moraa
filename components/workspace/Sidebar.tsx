import { IconBook, IconDashboard, IconTemplate } from "@tabler/icons-react"
import Link from "next/link"

const navItems = [
  {
    icon: <IconDashboard />,
    title: "Dashboard",
    href: "/workspace/1",
  },
  {
    icon: <IconBook />,
    title: "Courses",
    href: "/workspace/1/courses",
  },
  {
    icon: <IconTemplate />,
    title: "Content Deck",
    href: "/workspace/1/content-deck",
  },
]

export default function Sidebar() {
  return (
    <div className="w-[300px] h-screen max-h-screen bg-background">
      <div className="px-2 py-4">
        <span className="text-xl font-semibold text-center">Learnsight</span>
      </div>
      <div className="px-2 py-4 mt-6">
        <input
          placeholder="Enter to search"
          className="px-4 py-2 w-full rounded-sm bg-white/10 border-0"
        />
      </div>
      <div className="px-2 py-4 mt-6">
        <nav>
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li className="w-full" key={index}>
                <Link
                  href={item.href}
                  className=" flex items-center p-2 w-full text-white/60 hover:text-white hover:bg-white/10"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="ml-2">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
