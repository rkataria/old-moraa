import { HomeIcon } from "@heroicons/react/20/solid"

const pages = [
  { name: "Projects", href: "#", current: false },
  { name: "Project Nero", href: "#", current: true },
]

interface BreadcrumbPage {
  name: string
  href: string
  current: boolean
}

interface BreadcrumbProps {
  className?: string
  homeLink: string
  pages: BreadcrumbPage[]
}

export default function Breadcrumb({
  className,
  homeLink,
  pages,
}: BreadcrumbProps) {
  if (pages?.length === 0) return <></>

  return (
    <div className={className}>
      <nav className="flex" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-2">
          <li>
            <div>
              <a href={homeLink} className="text-gray-400 hover:text-gray-500">
                <HomeIcon
                  className="h-4 w-4 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="sr-only">Home</span>
              </a>
            </div>
          </li>
          {pages.map((page: BreadcrumbPage) => (
            <li key={page.name}>
              <div className="flex items-center">
                <svg
                  className="h-4 w-4 flex-shrink-0 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <a
                  href={page.href}
                  className="ml-4 text-xs font-medium text-gray-500 hover:text-gray-700"
                  aria-current={page.current ? "page" : undefined}
                >
                  {page.name}
                </a>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
