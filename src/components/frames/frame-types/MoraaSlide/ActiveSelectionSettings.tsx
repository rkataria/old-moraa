import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'

export function ActiveSelectionSettings() {
  const { canvas } = useMoraaSlideEditorContext()

  if (!canvas) return null

  const activeObjects = canvas.getActiveObjects()

  if (activeObjects.length === 0) return null

  return <div />
}
