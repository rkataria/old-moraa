import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react'

type LeftSidebarVisiblity = 'minimized' | 'maximized'
type RightSidebarVisiblity = 'ai-chat' | 'slide-settings' | 'notes' | null

type StudioLayoutContextType = {
  leftSidebarVisiblity: LeftSidebarVisiblity
  rightSidebarVisiblity: RightSidebarVisiblity
  toggleLeftSidebar: () => void
  setRightSidebarVisiblity: Dispatch<SetStateAction<RightSidebarVisiblity>>
}

const StudioLayoutContext = createContext<StudioLayoutContextType>({
  leftSidebarVisiblity: 'maximized',
  rightSidebarVisiblity: null,
  toggleLeftSidebar: () => {},
  setRightSidebarVisiblity: () => {},
})

export const useStudioLayoutContext = () => useContext(StudioLayoutContext)

export function StudioLayoutContextProvider({
  children,
}: React.PropsWithChildren<object>) {
  const [leftSidebarVisiblity, setLeftSidebarVisiblity] =
    useState<LeftSidebarVisiblity>('maximized')
  const [rightSidebarVisiblity, setRightSidebarVisiblity] =
    useState<RightSidebarVisiblity>(null)

  const toggleLeftSidebar = () => {
    setLeftSidebarVisiblity((prevState) =>
      prevState === 'maximized' ? 'minimized' : 'maximized'
    )
  }

  return (
    <StudioLayoutContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        leftSidebarVisiblity,
        rightSidebarVisiblity,
        toggleLeftSidebar,
        setRightSidebarVisiblity,
      }}>
      {children}
    </StudioLayoutContext.Provider>
  )
}

export const useStudioLayout = () => useStudioLayoutContext()
