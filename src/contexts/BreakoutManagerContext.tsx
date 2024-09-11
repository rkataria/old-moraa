import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useDyteSelector } from '@dytesdk/react-web-core'

import { BreakoutRooms } from '@/utils/dyte-breakout'

const BreakoutManagerContext = React.createContext<{
  breakoutRoomsInstance: BreakoutRooms | null
}>({ breakoutRoomsInstance: null })

export function BreakoutManagerContextProvider({
  children,
}: PropsWithChildren<unknown>) {
  const [breakoutRoomsInstance, setBreakoutRoomsInstance] =
    useState<BreakoutRooms | null>(null)
  const dyteClient = useDyteSelector((state) => state)

  const initiateBreakoutInstance = useCallback(() => {
    if (!dyteClient) return
    const _breakoutRoomsInstance = new BreakoutRooms(dyteClient)
    setBreakoutRoomsInstance(_breakoutRoomsInstance)
  }, [dyteClient])

  useEffect(() => {
    initiateBreakoutInstance()
  }, [initiateBreakoutInstance])

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
