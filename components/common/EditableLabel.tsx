/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useRef, useState } from 'react'

import { Tooltip } from '@nextui-org/react'

import { cn } from '@/utils/utils'

export function EditableLabel({
  readOnly = true,
  label,
  className = '',
  onUpdate,
}: {
  readOnly?: boolean
  label: string
  className?: string
  onUpdate: (value: string) => void
}) {
  const contentEditableRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState<string>(label)

  useEffect(() => {
    setValue(label)
  }, [label])

  return (
    <div className="w-full flex justify-between items-center gap-2">
      <Tooltip
        showArrow
        placement="right"
        offset={15}
        hidden={label.length < 15}
        content={
          <div className="px-1 py-2 max-w-[10rem]">
            <div className="text-tiny">{label}</div>
          </div>
        }>
        <div
          ref={contentEditableRef}
          className={cn(
            'w-full outline-none max-w-[9.25rem] overflow-hidden !whitespace-nowrap',
            className
          )}
          onFocus={() => {
            if (readOnly) return
            setValue(label)
          }}
          onDoubleClick={() => {
            if (readOnly) return
            contentEditableRef.current!.contentEditable = 'true'
            contentEditableRef.current!.focus()
          }}
          onBlur={(event) => {
            if (readOnly) return

            contentEditableRef.current!.contentEditable = 'false'

            if (event.target.textContent !== label) {
              const newLabel = event.target.textContent || label
              onUpdate(newLabel)
              contentEditableRef.current!.innerText = newLabel
            }

            contentEditableRef.current!.scrollLeft = 0
          }}
          onKeyDown={(event) => {
            if (readOnly) return
            if (event.key === 'Enter' || event.key === 'Escape') {
              event.preventDefault()
              event.stopPropagation()
              contentEditableRef.current!.blur()
            }
          }}
          suppressContentEditableWarning
          contentEditable={false}>
          {value}
        </div>
      </Tooltip>
    </div>
  )
}
