'use client'

import 'tldraw/tldraw.css'

import { useContext } from 'react'

import { IoAddSharp } from 'react-icons/io5'

import { Card } from '@nextui-org/react'

import { EditableLabel } from '../EditableLabel'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'

export type BreakoutFrame = IFrame & {
  content: {
    title: string
    description: string
    selectedBreakout: string
    countOfRoomsGroups: number
  }
}

interface BreakoutProps {
  frame: BreakoutFrame
}

export function Breakout({ frame }: BreakoutProps) {
  const { isOwner, preview } = useContext(EventContext) as EventContextType
  const editable = isOwner && !preview

  console.log(frame)

  return (
    <div className="grid gap-2 h-72 grid-flow-col bottom-6 absolute">
      {frame.content?.breakoutDetails?.length &&
        frame.content?.breakoutDetails?.map((breakout, idx) => (
          <Card
            // eslint-disable-next-line react/no-array-index-key
            key={`breakout-${frame.config?.selectedBreakout}-${idx}`}
            className="border p-4">
            <div className="flex justify-between gap-4">
              <EditableLabel
                readOnly={!editable}
                label={breakout?.name || ''}
                className="text-sm"
                onUpdate={(value) => {
                  if (!editable) return
                  if (frame.content.breakout === value) {
                    console.log('here')
                  }

                  // updateFrame({
                  //   framePayload: { name: value },
                  //   frameId: frame.id,
                  // })
                }}
              />
              <span className="flex gap-2">
                <IoAddSharp className="border border-dashed border-gray-400 text-gray-400" />
                {editable && <IoAddSharp className="rotate-45" />}
              </span>
            </div>
            <div className="h-72 border border-dashed border-gray-200 p-2 text-gray-400 mt-4">
              You can add existing slide from any section or add new slide which
              will be added under the Breakout section
            </div>
          </Card>
        ))}
    </div>
  )
}
