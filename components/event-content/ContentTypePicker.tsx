import { IconChartBar, IconX } from "@tabler/icons-react"
import clsx from "clsx"

interface IContentType {
  name: string
  icon: React.ReactNode
  description: string
  contentType: ContentType
}

export enum ContentType {
  COVER = "cover",
  POLL = "poll",
  IMAGE = "image",
  VIDEO = "video",
  GOOGLE_SLIDERS = "google-slides",
}

const contentTypes: IContentType[] = [
  {
    name: "Title & Description",
    icon: <IconChartBar />,
    description: "Suitable for cover pages and dividers",
    contentType: ContentType.COVER,
  },
  {
    name: "Poll",
    icon: <IconChartBar />,
    description: "Break the ice and gauge opinions easily and visually.",
    contentType: ContentType.POLL,
  },
  {
    name: "Google Slides",
    icon: <IconChartBar />,
    description: "Google slides embed",
    contentType: ContentType.GOOGLE_SLIDERS,
  },
]

interface ChooseContentTypeProps {
  open: boolean
  onClose: () => void
  onChoose: (contentType: ContentType) => void
}

export default function ContentTypePicker({
  open,
  onClose,
  onChoose,
}: ChooseContentTypeProps) {
  return (
    <div
      className={clsx(
        "fixed w-full h-full bg-black/75 left-0 top-0 overflow-hidden z-50",
        {
          "opacity-0 pointer-events-none": !open,
          "opacity-100 pointer-events-auto": open,
        }
      )}
    >
      <div className="fixed bottom-0 left-0 w-full bg-white p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">Choose content type</h3>
            <p className="text-sm text-gray-500">
              Choose the type of content you want to add to your slide
            </p>
          </div>
          <button onClick={onClose}>
            <IconX />
          </button>
        </div>
        <div className="flex justify-start items-center gap-4 py-4 flex-nowrap overflow-x-auto scrollbar-none rounded-md mt-4">
          {contentTypes.map((contentType, index) => (
            <div
              key={index}
              className="h-32 rounded-md flex-none aspect-video cursor-pointer transition-all border-2 flex flex-col justify-center items-center gap-2 p-4 text-center bg-gray-900 text-white hover:bg-black hover:border-black"
              onClick={() => onChoose(contentType.contentType)}
            >
              <h3 className="font-bold">{contentType.name}</h3>
              <p className="text-sm text-gray-400">{contentType.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
