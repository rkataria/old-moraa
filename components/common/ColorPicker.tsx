import { useEffect, useState } from 'react'

import { cn } from '@/utils/utils'

export function ColorPicker({
  defaultColor,
  className,
  onchange,
}: {
  defaultColor?: string
  className?: string
  onchange: (color: string) => void
}) {
  const [color, setColor] = useState<string>('#ffffff')

  useEffect(() => {
    if (defaultColor) {
      setColor(defaultColor)
    }
  }, [defaultColor])

  return (
    <div
      className={cn('cursor-pointer w-5 h-5 rounded-full bg-white', className)}
      style={{
        backgroundColor: color,
      }}>
      <input
        type="color"
        className="border-0 opacity-0 block"
        value={color}
        onChange={(e) => {
          setColor(e.target.value)
          onchange(e.target.value)
        }}
      />
    </div>
  )
}
