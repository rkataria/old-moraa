/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { MORAA_SLIDE_TEMPLATES, Template } from '@/utils/moraa-slide-templates'

export function MoraaSlideTemplates() {
  const { canvas } = useMoraaSlideEditorContext()

  if (!canvas) return null

  const loadTemplate = (template: Template) => {
    template.loadTemplate(canvas)
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
