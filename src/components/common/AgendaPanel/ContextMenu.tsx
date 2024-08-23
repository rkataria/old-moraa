import { useState, useRef, useEffect, MouseEvent } from 'react'

import { Listbox, ListboxItem } from '@nextui-org/react'
import { ReactNode } from '@tanstack/react-router'

export function ContextMenu({
  children,
  items,
  handleActions,
}: {
  children: ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: { key: string; label: string; icon: ReactNode }[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleActions: (item: any) => void
}) {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setVisible(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

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
      className="relative inline-block w-full h-full">
      {children}
      {visible && (
        <ul
          ref={menuRef}
          className="fixed bg-white border border-gray-300 shadow-lg z-50 py-1 mt-1 rounded-lg"
          style={{ left: `${position.x}px`, top: `${position.y}px` }}>
          <Listbox aria-label="Actions">
            {items.map((item) => (
              <ListboxItem
                key={item.key}
                onClick={() => handleActions(item)}
                startContent={item.icon}>
                {item.label}
              </ListboxItem>
            ))}
          </Listbox>
        </ul>
      )}
    </div>
  )
}
