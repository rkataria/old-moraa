import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react'

import DyteClient from '@dytesdk/web-core'

import { BreakoutRooms } from '@/utils/dyte-breakout'

const BreakoutManagerContext = React.createContext<{
  breakoutRoomsInstance: BreakoutRooms | null
}>({ breakoutRoomsInstance: null })

export function BreakoutManagerContextProvider({
  meeting,
  children,
}: PropsWithChildren<{ meeting: DyteClient | undefined }>) {
  const [breakoutRoomsInstance, setBreakoutRoomsInstance] =
    useState<BreakoutRooms | null>(null)

  useEffect(() => {
    if (!meeting) return
    const _breakoutRoomsInstance = new BreakoutRooms(meeting)
    setBreakoutRoomsInstance(_breakoutRoomsInstance)
  }, [meeting])

  const breakoutManagerInstanceMemo = useMemo(
    () => ({ breakoutRoomsInstance }),
    [breakoutRoomsInstance]
  )

  return (
    <BreakoutManagerContext.Provider value={breakoutManagerInstanceMemo}>
      {children}
    </BreakoutManagerContext.Provider>
  )
}

export const useBreakoutManagerContext = () =>
  React.useContext(BreakoutManagerContext)
