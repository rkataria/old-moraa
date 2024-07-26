import { useMemo } from 'react'

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react'
import { icons } from 'lucide-react'
import { IoChevronDown } from 'react-icons/io5'

import {
  DropdownButton,
  DropdownCategoryTitle,
} from '@/components/tiptap/ui/Dropdown'
import { Icon } from '@/components/tiptap/ui/Icon'

export type ContentTypePickerOption = {
  label: string
  id: string
  type: 'option'
  disabled: () => boolean
  isActive: () => boolean
  onClick: () => void
  icon: keyof typeof icons
}

export type ContentTypePickerCategory = {
  label: string
  id: string
  type: 'category'
}

export type ContentPickerOptions = Array<
  ContentTypePickerOption | ContentTypePickerCategory
>

export type ContentTypePickerProps = {
  options: ContentPickerOptions
}

const isOption = (
  option: ContentTypePickerOption | ContentTypePickerCategory
): option is ContentTypePickerOption => option.type === 'option'
const isCategory = (
  option: ContentTypePickerOption | ContentTypePickerCategory
): option is ContentTypePickerCategory => option.type === 'category'

export function ContentTypePicker({ options }: ContentTypePickerProps) {
  const activeItem = useMemo(
    () =>
      options.find((option) => option.type === 'option' && option.isActive()),
    [options]
  )

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Button className="h-8 bg-gray-200" endContent={<IoChevronDown />}>
          <Icon
            name={
              (activeItem?.type === 'option' && activeItem.icon) || 'Pilcrow'
            }
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {() => (
          <div>
            {options.map((option) => {
              if (isOption(option)) {
                return (
                  <DropdownButton
                    key={option.id}
                    onClick={option.onClick}
                    isActive={option.isActive()}>
                    <Icon name={option.icon} className="w-4 h-4 mr-1" />
                    {option.label}
                  </DropdownButton>
                )
              }
              if (isCategory(option)) {
                return (
                  <div className="mt-2 first:mt-0" key={option.id}>
                    <DropdownCategoryTitle key={option.id}>
                      {option.label}
                    </DropdownCategoryTitle>
                  </div>
                )
              }

              return null
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
