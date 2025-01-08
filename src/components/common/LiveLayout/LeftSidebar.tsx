import { ReactNode } from '@tanstack/react-router'
import { useHotkeys } from 'react-hotkeys-hook'
import { useDispatch } from 'react-redux'

import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreSelector } from '@/hooks/useRedux'
import {
  collapseLeftSidebarAction,
  maximizeLeftSidebarAction,
} from '@/stores/slices/layout/live.slice'
import { KeyboardShortcuts } from '@/utils/utils'

type LeftSidebarProps = {
  children: ReactNode
}

export function LeftSidebar({ children }: LeftSidebarProps) {
  const dispatch = useDispatch()
  const { permissions } = useEventPermissions()
  const { leftSidebarMode } = useStoreSelector((state) => state.layout.live)

  useHotkeys(
    KeyboardShortcuts['Agenda Panel'].expandAndCollapse.keyWithCode,
    () => {
      if (!permissions.canAcessAllSessionControls) return

      if (leftSidebarMode === 'maximized') {
        dispatch(collapseLeftSidebarAction())
      } else {
        dispatch(maximizeLeftSidebarAction())
      }
    }
  )

  return <div className="flex-none h-full">{children}</div>
}
