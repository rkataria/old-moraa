/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useRef, useState } from 'react'

export function EditableLabel({
  readOnly = true,
  label,
  onUpdate,
}: {
  readOnly?: boolean
  label: string
  onUpdate: (value: string) => void
}) {
  const contentEditableRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState<string>(label)

  useEffect(() => {
    setValue(label)
  }, [label])

  return (
    <div className="w-full flex justify-between items-center gap-2 h-10 max-h-10">
      <div
        ref={contentEditableRef}
        className="w-full outline-none line-clamp-1"
        onFocus={() => {
          if (readOnly) return
          setValue(label)
        }}
        onBlur={(event) => {
          if (readOnly) return
          if (event.target.textContent !== label) {
            const newLabel = event.target.textContent || label
            onUpdate(newLabel)
            contentEditableRef.current!.innerText = newLabel
          }
        }}
        contentEditable={!readOnly}>
        {value}
      </div>
    </div>
  )
}
