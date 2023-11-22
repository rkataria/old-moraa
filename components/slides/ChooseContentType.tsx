import {
  IconArtboard,
  IconBrandGoogleDrive,
  IconChartBar,
} from "@tabler/icons-react"

interface IContentType {
  name: string
  icon: React.ReactNode
  description: string
  contentType: ContentType
}

export type ContentType = "poll" | "text" | "image"

const contentTypes: IContentType[] = [
  {
    name: "Poll",
    icon: <IconChartBar />,
    description: "You can add a poll to your slide",
    contentType: "poll",
  },
  {
    name: "Drive",
    icon: <IconBrandGoogleDrive />,
    description: "You can embed a Google Drive file",
    contentType: "text",
  },
  {
    name: "Canvas",
    icon: <IconArtboard />,
    description: "You can draw on a canvas",
    contentType: "image",
  },
]

interface ChooseContentTypeProps {
  onChoose: (contentType: ContentType) => void
}

export default function ChooseContentType(props: ChooseContentTypeProps) {
  return (
    <>
      <ul
        role="list"
        className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-3 xl:gap-x-8"
      >
        {contentTypes?.map((contentType) => (
          <li
            key={contentType.name}
            className="relative cursor-pointer"
            onClick={() => props.onChoose(contentType.contentType)}
          >
            <div className="flex flex-col justify-center items-center bg-white aspect-video rounded-md">
              <div className="flex items-center flex-col">
                <div className="flex-shrink-0">{contentType.icon}</div>
                <div className="font-bold">{contentType.name}</div>
              </div>
              <div className="text-sm text-gray-500">
                {contentType.description}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
