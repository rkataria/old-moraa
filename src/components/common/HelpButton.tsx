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
        onClick={() => window.open('/help', '_blank', 'noopener,noreferrer')}
        className="shrink-0">
        <IoIosHelpCircleOutline size={24} className="text-[#52525B]" />
      </Button>
    </Tooltip>
  )
}
