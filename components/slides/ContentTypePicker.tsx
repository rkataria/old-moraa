import { IconChartBar, IconX } from "@tabler/icons-react"
import clsx from "clsx"

interface IContentType {
  name: string
  icon: React.ReactNode
  description: string
  contentType: ContentType
}

export enum ContentType {
  BASIC = "basic",
  POLL = "poll",
  IMAGE = "image",
  VIDEO = "video",
}

const contentTypes: IContentType[] = [
  {
    name: "Basic",
    icon: <IconChartBar />,
    description: "You can use this to add a title and description",
    contentType: ContentType.BASIC,
  },
  {
    name: "Poll",
    icon: <IconChartBar />,
    description: "You can this to add a poll to your slide",
    contentType: ContentType.POLL,
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
