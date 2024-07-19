import { useDyteSelector } from '@dytesdk/react-web-core'
import { FaLaptopCode } from 'react-icons/fa'

import { ControlButton } from '../common/ControlButton'

import { cn } from '@/utils/utils'

const DYTE_CODE_EDITOR_PLUGIN_ID = '40b0d43f-388b-4232-b918-c2d900a7d498'

export function CodeEditorToggle() {
  const codeEditorPlugin = useDyteSelector((m) =>
    m.plugins.all.get(DYTE_CODE_EDITOR_PLUGIN_ID)
  )

  const isCodeEditorActive = codeEditorPlugin?.active

  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        radius: 'md',
        variant: 'solid',
        className: cn(
          'w-[120px] h-[50px] flex items-center justify-center gap-2 p-1 rounded-sm bg-black text-white0'
        ),
      }}
      tooltipProps={{
        content: isCodeEditorActive ? 'Close Code Editor' : 'Open Code Editor',
      }}
      onClick={async () => {
        if (!codeEditorPlugin) return

        if (codeEditorPlugin.active) {
          await codeEditorPlugin.deactivate()

          return
        }

        await codeEditorPlugin.activate()
      }}>
      <FaLaptopCode size={20} />
    </ControlButton>
  )
}
