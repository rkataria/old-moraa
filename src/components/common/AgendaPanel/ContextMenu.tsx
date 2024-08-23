import { useState, useRef, useEffect, MouseEvent } from 'react'

import { Listbox, ListboxItem } from '@nextui-org/react'
import { ReactNode } from '@tanstack/react-router'

import { RenderIf } from '../RenderIf/RenderIf'

import { FrameAction } from '@/types/frame.type'

export function ContextMenu({
  children,
  items,
  handleActions,
}: {
  children: ReactNode
  items: FrameAction[]
  handleActions: (item: FrameAction) => void
}) {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClickOutside = (event: any) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        visible
      ) {
        setVisible(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    document.addEventListener('contextmenu', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('contextmenu', handleClickOutside)
    }
  }, [visible])

  const handleContextMenu = (
    event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    event.preventDefault()

    setPosition({ x: event.pageX, y: event.pageY })
    setVisible(true)
  }

  return (
    <div
      onContextMenu={handleContextMenu}
      ref={menuRef}
      className="relative inline-block w-full h-full">
      {children}
      <RenderIf isTrue={visible}>
        <Listbox
          aria-label="Actions"
          className="fixed w-fit bg-white border border-gray-300 shadow-lg z-[200] py-1 mt-1 rounded-lg"
          style={{ left: `${position.x}px`, top: `${position.y}px` }}>
          {items.map((item) => (
            <ListboxItem
              key={item.key}
              onClick={() => handleActions(item)}
              startContent={item.icon}>
              {item.label}
            </ListboxItem>
          ))}
        </Listbox>
      </RenderIf>
    </div>
  )
}
