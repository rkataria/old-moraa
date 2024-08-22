import { Button } from '@nextui-org/react'
import { IoIosHelpCircleOutline } from 'react-icons/io'

import { Tooltip } from './ShortuctTooltip'

export function HelpButton() {
  return (
    <Tooltip label="Help">
      <Button
        isIconOnly
        variant="light"
        onClick={() => window.open('/help', '_blank', 'noopener,noreferrer')}>
        <IoIosHelpCircleOutline size={24} className="text-[#52525B]" />
      </Button>
    </Tooltip>
  )
}
