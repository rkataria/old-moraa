import { ReactNode } from '@tanstack/react-router'
import { useHotkeys } from 'react-hotkeys-hook'
import { useDispatch } from 'react-redux'

import { useStoreSelector } from '@/hooks/useRedux'
import {
  collapseLeftSidebarAction,
  maximizeLeftSidebarAction,
} from '@/stores/slices/layout/live.slice'

type LeftSidebarProps = {
  children: ReactNode
}

export function LeftSidebar({ children }: LeftSidebarProps) {
  const dispatch = useDispatch()
  const { leftSidebarMode } = useStoreSelector((state) => state.layout.live)

  useHotkeys('ctrl + [', () => {
    if (leftSidebarMode === 'maximized') {
      dispatch(collapseLeftSidebarAction())
    } else {
      dispatch(maximizeLeftSidebarAction())
    }
  })

  return <div className="flex-none h-full">{children}</div>
}
