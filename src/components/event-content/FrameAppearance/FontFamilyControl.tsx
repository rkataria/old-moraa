import { useState } from 'react'

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'

import { LabelWithInlineControl } from '@/components/common/LabelWithInlineControl'
import { FONT_FAMILIES } from '@/libs/fonts'

export function FontFamilyControl() {
  return (
    <LabelWithInlineControl
      label="Font Family"
      control={<FontSelector />}
      className="items-center"
    />
  )
}

function FontSelector() {
  const [selectedFontFamily, setSelectedFontFamily] = useState('Inter')

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="light"
          radius="md"
          size="sm"
          className="font-bold"
          style={{
            fontFamily: selectedFontFamily,
          }}>
          Aa
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSelectionChange={(data: any) => {
          const selectedItems = Array.from(data)
          setSelectedFontFamily(selectedItems[0] as string)
        }}>
        {FONT_FAMILIES.map((fontFamily) => (
          <DropdownItem
            key={fontFamily.value}
            style={{
              fontFamily: fontFamily.value,
            }}>
            {fontFamily.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
