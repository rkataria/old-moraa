import { Card, CardBody } from '@nextui-org/react'

import { ContentType, IContentType } from '@/utils/content.util'

interface IContentCard {
  card: IContentType | undefined
  onClick: (contentType: ContentType, templateKey?: string) => void
}

export function ContentTypeCard({ card, onClick }: IContentCard) {
  if (!card) return null

  return (
    <Card
      shadow="sm"
      key={card.contentType}
      isPressable
      onPress={() => {
        if (!card.disabled) {
          onClick(card.contentType, card.templateKey)
        }
      }}
      className="hover:bg-gray-300 flex-col items-start bg-[#E9D8FD] shadow-none hover:shadow-sm duration-300">
      <CardBody className="p-2.5 flex flex-col items-start w-full">
        <div className="flex items-center gap-2 w-max">
          <div className="w-8 h-8 text-[#7C3AED]">{card.icon}</div>
          <h3 className="font-semibold text-sm w-full text-left tracking-tight">
            {card.name}
          </h3>
        </div>

        <p className="text-xs mt-1 w-full text-left tracking-tight">
          {card.description}
        </p>
      </CardBody>
    </Card>
  )
}
