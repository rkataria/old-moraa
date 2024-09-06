import { useDisclosure } from '@nextui-org/react'
import { IoIosHelpCircleOutline } from 'react-icons/io'

import { KeyboardShortcutsModal } from './KeyboardShortcutsModal'
import { Tooltip } from './ShortuctTooltip'
import { Button } from '../ui/Button'

export function HelpButton() {
  const keyboardShortcutsDisClosure = useDisclosure()

  return (
    <>
      <Tooltip label="Help" actionKey="+ /" systemKeys={['command']}>
        <Button
          size="sm"
          isIconOnly
          variant="light"
          onClick={() => keyboardShortcutsDisClosure.onOpen()}
          className="shrink-0">
          <IoIosHelpCircleOutline size={24} className="text-[#52525B]" />
        </Button>
      </Tooltip>
      <KeyboardShortcutsModal disclosure={keyboardShortcutsDisClosure} />
    </>
  )
}
