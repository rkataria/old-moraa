import { ButtonProps, useDisclosure } from '@nextui-org/react'
import { IoIosHelpCircleOutline } from 'react-icons/io'

import { KeyboardShortcutsModal } from './KeyboardShortcutsModal'
import { Tooltip } from './ShortuctTooltip'
import { Button } from '../ui/Button'

export function HelpButton({
  buttonProps = {},
}: {
  buttonProps?: ButtonProps
}) {
  const keyboardShortcutsDisClosure = useDisclosure()

  return (
    <>
      <Tooltip label="Help" actionKey="+ /" systemKeys={['command']}>
        <Button
          size="sm"
          isIconOnly
          variant="light"
          className="shrink-0"
          {...buttonProps}
          onClick={() => keyboardShortcutsDisClosure.onOpen()}>
          <IoIosHelpCircleOutline size={24} />
        </Button>
      </Tooltip>
      <KeyboardShortcutsModal disclosure={keyboardShortcutsDisClosure} />
    </>
  )
}
