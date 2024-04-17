import { useContext } from 'react'

import { Switch } from '@nextui-org/react'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function PreviewSwitcher() {
  const { preview, setPreview } = useContext(EventContext) as EventContextType

  return <Switch isSelected={preview} onValueChange={setPreview} />
}
