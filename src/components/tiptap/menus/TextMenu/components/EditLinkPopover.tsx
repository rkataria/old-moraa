import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react'

import { LinkEditorPanel } from '@/components/tiptap/panels'
import { Icon } from '@/components/tiptap/ui/Icon'
import { Toolbar } from '@/components/tiptap/ui/Toolbar'

export type EditLinkPopoverProps = {
  onSetLink: (link: string, openInNewTab?: boolean) => void
}

export function EditLinkPopover({ onSetLink }: EditLinkPopoverProps) {
  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Toolbar.Button tooltip="Set Link">
          <Icon name="Link" />
        </Toolbar.Button>
      </PopoverTrigger>
      <PopoverContent>
        {() => <LinkEditorPanel onSetLink={onSetLink} />}
      </PopoverContent>
    </Popover>
  )
}
