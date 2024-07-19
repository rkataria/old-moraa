import { useState } from 'react'

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'

import { LabelWithInlineControl } from '@/components/common/LabelWithInlineControl'

const FRAME_FONT_FAMILIES = [
  {
    name: 'Inter',
    fontStyle: 'Inter',
  },
  {
    name: 'Roboto',
    fontStyle: 'Roboto',
  },
  {
    name: 'Poppins',
    fontStyle: 'Poppins',
  },
  {
    name: 'Montserrat',
    fontStyle: 'Montserrat',
  },
  {
    name: 'Lato',
    fontStyle: 'Lato',
  },
  {
    name: 'Open Sans',
    fontStyle: 'Open Sans',
  },
]

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
        {FRAME_FONT_FAMILIES.map((fontFamily) => (
          <DropdownItem
            key={fontFamily.fontStyle}
            style={{
              fontFamily: fontFamily.fontStyle,
            }}>
            {fontFamily.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
