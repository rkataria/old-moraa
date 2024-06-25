/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { CiGrid42 } from 'react-icons/ci'

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react'

import { LabelWithInlineControl } from '@/components/common/LabelWithInlineControl'
import { cn } from '@/utils/utils'

export type FrameLayout = {
  key: string
  name?: string
  url?: string
}

type FrameLayoutControlProps = {
  currentLayoutKey: string
  layouts: FrameLayout[]
  onLayoutChange: (layoutKey: string) => void
}

type FrameLayoutSelectorProps = {
  currentLayoutKey: string
  layouts: FrameLayout[]
  onChange: (layoutKey: string) => void
}

export function FrameLayoutControl({
  currentLayoutKey,
  layouts,
  onLayoutChange,
}: FrameLayoutControlProps) {
  return (
    <LabelWithInlineControl
      label="Layout"
      control={
        <FrameLayoutSelector
          currentLayoutKey={currentLayoutKey}
          layouts={layouts}
          onChange={onLayoutChange}
        />
      }
      className="items-center"
    />
  )
}

function FrameLayoutSelector({
  currentLayoutKey,
  layouts,
  onChange,
}: FrameLayoutSelectorProps) {
  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Button variant="light" radius="md" size="sm" className="font-bold">
          <CiGrid42 size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2">
        <div className="grid grid-cols-3 grid-flow-row gap-2 w-96">
          {layouts.map((layout) => (
            <div
              key={layout.key}
              className={cn(
                'w-full h-auto aspect-video bg-gray-100 bg-cover bg-center rounded-md cursor-pointer overflow-hidden flex justify-center items-center',
                {
                  'border-2 border-primary-500':
                    layout.key === currentLayoutKey,
                }
              )}
              style={{
                backgroundImage: `url(${layout.url})`,
              }}
              onClick={() => onChange(layout.key)}>
              {layout.url ? '' : layout.name}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
