import { useEffect } from 'react'

import { useDyteSelector } from '@dytesdk/react-web-core'
import { track, useEditor } from 'tldraw'

export const NameEditor = track(() => {
  const editor = useEditor()
  const name = useDyteSelector((s) => s.self.name)

  useEffect(() => {
    editor.user.updateUserPreferences({
      name,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name])

  const { color } = editor.user.getUserPreferences()

  return (
    <div className="flex justify-end items-center gap-1 pointer-events-auto h-10 px-2 bg-[var(--color-low)] rounded-bl-[11px]">
      <input
        type="color"
        className="w-12 cursor-pointer"
        value={color}
        onChange={(e) => {
          editor.user.updateUserPreferences({
            color: e.currentTarget.value,
          })
        }}
      />
      <span>{name}</span>
    </div>
  )
})
