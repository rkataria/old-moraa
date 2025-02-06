import {
  ArrowUpRight,
  Eraser,
  Hand,
  Redo,
  Square,
  StickyNote,
  Trash2,
  Type,
  Undo,
  Image,
  Pencil,
} from 'lucide-react'
import { RiGlobalLine } from 'react-icons/ri'
import { useEditor } from 'tldraw'

import { ToolButton } from './ToolButton'

export function VerticalToolbar() {
  const editor = useEditor()
  // const helpers = useDefaultHelpers()
  // const trackEvent = useUiEvents()
  // const editorComponents = useEditorComponents()

  const tools = [
    { icon: <Hand size={20} />, tool: 'select', label: 'Select Tool' },
    { icon: <Pencil size={20} />, tool: 'draw', label: 'Pencil' },
    { icon: <Square size={20} />, tool: 'geo', label: 'Rectangle' },
    // { icon: <Circle size={20} />, tool: 'geo', label: 'Circle' },
    { icon: <ArrowUpRight size={20} />, tool: 'arrow', label: 'Arrow' },
    { icon: <Type size={20} />, tool: 'text', label: 'Text' },
    { icon: <StickyNote size={20} />, tool: 'note', label: 'Sticky Note' },
    { icon: <Image size={20} />, tool: 'media', label: 'Image' },
    { icon: <RiGlobalLine size={20} />, tool: 'embed', label: 'Embed' },
    { icon: <Eraser size={20} />, tool: 'eraser', label: 'Eraser' },
  ]

  const currentToolId = editor.getCurrentToolId()

  return (
    <div className="absolute left-1 top-1/2 -translate-y-1/2 bg-white rounded-md p-1 flex flex-col gap-1 border border-gray-200">
      {tools.map(({ icon, tool, label }) => (
        <ToolButton
          key={tool + label}
          icon={icon}
          isActive={currentToolId === tool}
          onClick={() => {
            if (tool === 'embed') {
              // Open the embed dialog
              // helpers.addDialog(editorComponents.)
              // editor.dispatch({
              //   type: 'click',
              //   props: {
              //     url: '', // You can prefill a URL if needed
              //   },
              // })
            }
            editor.setCurrentTool(tool)
            // For geo tool, set the appropriate shape
            if (tool === 'geo' && label.includes('Rectangle')) {
              editor.setCurrentTool('geo', { type: 'rectangle' })
            } else if (tool === 'geo' && label.includes('Circle')) {
              editor.setCurrentTool('geo', { type: 'ellipse' })
            }
          }}
          label={label}
        />
      ))}
      <div className="h-px bg-gray-200 my-1" />
      <ToolButton
        icon={<Undo size={20} />}
        onClick={() => editor.undo()}
        label="Undo"
      />
      <ToolButton
        icon={<Redo size={20} />}
        onClick={() => editor.redo()}
        label="Redo"
      />
      <ToolButton
        icon={<Trash2 size={20} />}
        onClick={() =>
          editor
            .getSelectedShapes()
            .forEach((shape) => editor.deleteShape(shape.id))
        }
        label="Delete Selected"
      />
    </div>
  )
}
