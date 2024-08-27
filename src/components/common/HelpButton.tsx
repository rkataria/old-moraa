import { IoIosHelpCircleOutline } from 'react-icons/io'

import { Tooltip } from './ShortuctTooltip'
import { Button } from '../ui/Button'

export function HelpButton() {
  return (
    <Tooltip label="Help">
      <Button
        size="sm"
        isIconOnly
        variant="light"
        onClick={() => window.open('/help', '_blank', 'noopener,noreferrer')}>
        <IoIosHelpCircleOutline size={18} className="text-[#52525B]" />
      </Button>
    </Tooltip>
  )
}
