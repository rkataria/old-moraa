/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext, useContext, useState } from 'react'

type AppContextType = {
  isZenMode: boolean
  toggleZenMode: () => void
  setZenMode: (value: boolean) => void
}

const AppContext = createContext<AppContextType>({
  isZenMode: false,
  toggleZenMode: () => {},
  setZenMode: () => {},
})

export function AppContextProvider({
  children,
}: React.PropsWithChildren<object>) {
  const [isZenMode, setZenMode] = useState(false)

  const toggleZenMode = () => setZenMode((prev) => !prev)

  const handleSetZenMode = (value: boolean) => setZenMode(value)

  return (
    <AppContext.Provider
      value={{
        isZenMode,
        toggleZenMode,
        setZenMode: handleSetZenMode,
      }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext) as AppContextType

  if (!context) {
    throw new Error('useAppContext must be used within `AppContextProvider`')
  }

  return context
}
