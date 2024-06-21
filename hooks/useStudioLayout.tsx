import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

type LeftSidebarVisiblity = 'minimized' | 'maximized'
type RightSidebarVisiblity = 'ai-chat' | 'frame-settings' | 'notes' | null

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

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toggleSidebars = (e: any) => {
      if (e.detail.key === 'left_sidebar_toggle') {
        toggleLeftSidebar()

        return
      }

      setRightSidebarVisiblity(null)
    }

    window.addEventListener('keyboard_shortcuts', toggleSidebars)

    return () =>
      window.removeEventListener('keyboard_shortcuts', toggleSidebars)
  }, [])

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
