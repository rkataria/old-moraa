import { Button } from '@/components/ui/Button'
import { useEventContext } from '@/contexts/EventContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { setFrameSettingsViewAction } from '@/stores/slices/layout/studio.slice'

export function MiroEmbedSettings() {
  const { currentFrame } = useEventContext()
  const dispatch = useStoreDispatch()
  const isEditMode = useStoreSelector(
    (store) => store.layout.studio.frameSettings.view === 'form'
  )

  if (!currentFrame) return null

  return (
    <Button
      onClick={() => {
        if (isEditMode) {
          dispatch(setFrameSettingsViewAction('preview'))
        } else {
          dispatch(setFrameSettingsViewAction('form'))
        }
      }}>
      {isEditMode ? 'Preview Board' : 'Update Board'}
    </Button>
  )
}
