import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

export type LeftSidebarVisiblity = 'minimized' | 'maximized'
export type RightSidebarType =
  | 'frame-appearance'
  | 'frame-notes'
  | 'chat'
  | 'participants'
type ResizableRightSidebarType = 'ai-chat'
type RightSidebarVisiblity = RightSidebarType | null
type ResizableRightSidebarVisiblity = ResizableRightSidebarType | null

type LiveLayoutContextType = {
  leftSidebarVisiblity: LeftSidebarVisiblity
  rightSidebarVisiblity: RightSidebarVisiblity
  resizableRightSidebarVisiblity: ResizableRightSidebarVisiblity
  toggleLeftSidebar: () => void
  setRightSidebarVisiblity: Dispatch<SetStateAction<RightSidebarVisiblity>>
  setResizableRightSidebarVisiblity: Dispatch<
    SetStateAction<ResizableRightSidebarVisiblity>
  >
}

const LiveLayoutContext = createContext<LiveLayoutContextType>({
  leftSidebarVisiblity: 'maximized',
  rightSidebarVisiblity: null,
  resizableRightSidebarVisiblity: null,
  toggleLeftSidebar: () => {},
  setRightSidebarVisiblity: () => {},
  setResizableRightSidebarVisiblity: () => {},
})

export const useLiveLayoutContext = () => useContext(LiveLayoutContext)

export function LiveLayoutContextProvider({
  children,
}: React.PropsWithChildren<object>) {
  const [leftSidebarVisiblity, setLeftSidebarVisiblity] =
    useState<LeftSidebarVisiblity>('maximized')
  const [rightSidebarVisiblity, setRightSidebarVisiblity] =
    useState<RightSidebarVisiblity>(null)
  const [resizableRightSidebarVisiblity, setResizableRightSidebarVisiblity] =
    useState<ResizableRightSidebarVisiblity>(null)

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
    <LiveLayoutContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        leftSidebarVisiblity,
        rightSidebarVisiblity,
        resizableRightSidebarVisiblity,
        toggleLeftSidebar,
        setRightSidebarVisiblity,
        setResizableRightSidebarVisiblity,
      }}>
      {children}
    </LiveLayoutContext.Provider>
  )
}

export const useLiveLayout = () => useLiveLayoutContext()
