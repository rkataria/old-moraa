/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useContext } from 'react'

import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { EventContextType } from '@/types/event-context.type'
import { MORAA_SLIDE_TEMPLATES, Template } from '@/utils/moraa-slide-templates'

export function MoraaSlideTemplates() {
  const { currentFrame } = useContext(EventContext) as EventContextType
  const canvas = useMoraaSlideStore(
    (state) => state.canvasInstances[currentFrame?.id as string]
  )
  const { setCanvas } = useMoraaSlideStore((state) => state)

  const loadTemplate = (template: Template) => {
    if (!canvas) return

    setCanvas(currentFrame?.id as string, template.loadTemplate(canvas))
  }

  return (
    <div className="bg-gray-100 w-full h-full flex-none grid grid-cols-3 grid-flow-row gap-2 p-2 content-baseline">
      {MORAA_SLIDE_TEMPLATES.map((template) => (
        <div
          key={template.key}
          className="w-full aspect-video bg-red-100 rounded-md cursor-pointer flex justify-center items-center"
          onClick={() => loadTemplate(template)}>
          <h3>{template.name}</h3>
        </div>
      ))}
    </div>
  )
}
