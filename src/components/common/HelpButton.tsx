import { ButtonProps, useDisclosure } from '@nextui-org/react'
import { IoIosHelpCircleOutline } from 'react-icons/io'

import { KeyboardShortcutsModal } from './KeyboardShortcutsModal'
import { Tooltip } from './ShortuctTooltip'
import { Button } from '../ui/Button'

import { cn } from '@/utils/utils'

export function HelpButton({
  buttonProps = {},
}: {
  buttonProps?: ButtonProps
}) {
  const keyboardShortcutsDisClosure = useDisclosure()

  return (
    <>
      <Tooltip label="Help" actionKey="shift + /">
        <Button
          size="sm"
          isIconOnly
          variant="light"
          className={cn('shrink-0 bg-transparent hover:bg-black/10', {
            'bg-primary text-white hover:bg-primary/80':
              keyboardShortcutsDisClosure.isOpen,
          })}
          {...buttonProps}
          onClick={() => keyboardShortcutsDisClosure.onOpen()}>
          <IoIosHelpCircleOutline size={24} />
        </Button>
      </Tooltip>
      <KeyboardShortcutsModal disclosure={keyboardShortcutsDisClosure} />
    </>
  )
}
