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
      shadow="none"
      key={card.contentType}
      isPressable
      onPress={() => {
        if (!card.disabled) {
          onClick(card.contentType, card.templateKey)
        }
      }}
      className="aspect-video border-2 border-transparent bg-gray-100 hover:border-primary hover:shadow-md">
      <CardBody className="flex flex-col justify-center items-center gap-1">
        <div className="text-primary-100">{card.iconLarge}</div>
        <h3 className="font-semibold text-center text-lg text-primary-400">
          {card.name}
        </h3>
        <p className="text-sm text-center text-gray-500">{card.description}</p>
      </CardBody>
    </Card>
  )
}
