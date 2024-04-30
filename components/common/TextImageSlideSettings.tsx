import { useContext, useEffect, useState } from 'react'

import { BsTextLeft } from 'react-icons/bs'
import { TfiLayoutMediaLeft, TfiLayoutMediaRight } from 'react-icons/tfi'
import { TiImageOutline } from 'react-icons/ti'

import { Listbox, ListboxItem, Selection } from '@nextui-org/react'

import { ContentType } from './ContentTypePicker'

import { EventContext } from '@/contexts/EventContext'
import { type EventContextType } from '@/types/event-context.type'

export enum LayoutTypes {
  NO_IMAGE = 'no-image',
  IMAGE_LEFT = 'image-left',
  IMAGE_RIGHT = 'image-right',
  IMAGE_BEHIND = 'image-behind',
}

export const layoutOptions = [
  {
    icon: BsTextLeft,
    label: 'No Image',
    key: LayoutTypes.NO_IMAGE,
  },
  {
    icon: TfiLayoutMediaLeft,
    label: 'Image left',
    key: LayoutTypes.IMAGE_LEFT,
  },

  {
    icon: TfiLayoutMediaRight,
    label: 'Image Right',
    key: LayoutTypes.IMAGE_RIGHT,
  },
  {
    icon: TiImageOutline,
    label: 'Image behind',
    key: LayoutTypes.IMAGE_BEHIND,
  },
]

export function TextImageSlideSettings() {
  const { currentSlide, updateSlide } = useContext(
    EventContext
  ) as EventContextType
  const [selectedKeys, setSelectedKeys] = useState<Selection>()

  useEffect(() => {
    setSelectedKeys(new Set([currentSlide?.config.layoutType]))
  }, [currentSlide?.config.layoutType])
  if (!currentSlide || currentSlide.type !== ContentType.TEXT_IMAGE) return null

  const handleSelectionChange = (keys: Selection) => {
    setSelectedKeys(keys)
    updateSlide({
      slidePayload: {
        config: {
          ...currentSlide.config,
          layoutType: Array.from(keys).join(', '),
        },
      },
      slideId: currentSlide.id,
    })
  }

  return (
    <div className="w-full mt-4">
      <p className="text-xs text-slate-500 mb-2">Choose Layout</p>
      <Listbox
        variant="solid"
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}>
        {layoutOptions.map((layout) => (
          <ListboxItem
            className="text-sm"
            key={layout.key}
            startContent={<layout.icon className="text-xl text-slate-600" />}>
            {layout.label}
          </ListboxItem>
        ))}
      </Listbox>
    </div>
  )
}
