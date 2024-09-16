/* eslint-disable no-console */
import { useContext } from 'react'

import { fabric } from 'fabric'
import toast from 'react-hot-toast'
import { useHotkeys } from 'react-hotkeys-hook'

import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import {
  copyObjects,
  cutObject,
  handleDeleteObjects,
  pasteObjects,
} from '@/libs/moraa-slide-editor'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { EventContextType } from '@/types/event-context.type'

export function useMoraaSlideShortcuts() {
  const { currentFrame } = useContext(EventContext) as EventContextType
  const { canvas, copiedObjectRef } = useMoraaSlideEditorContext()
  const history = useMoraaSlideStore(
    (state) => state.history[currentFrame?.id as string]
  )

  // Delete shortcut for windows
  useHotkeys('Delete', () => {
    if (!canvas) return
    handleDeleteObjects(canvas)
  })

  // Delete shortcut for mac
  useHotkeys('backspace', () => {
    if (!canvas) return
    handleDeleteObjects(canvas)
  })

  // Copy shortcut
  useHotkeys('ctrl+c', () => {
    console.log('ctrl+c')

    if (!canvas) return

    const activeObject = canvas.getActiveObject()

    if (activeObject) {
      copyObjects(canvas, (object) => {
        copiedObjectRef.current = object
        toast.success('🎉 Selection copied')
      })
    }
  })

  // Cut shortcut
  useHotkeys('ctrl+x', () => {
    if (!canvas) return

    const activeObject = canvas.getActiveObject()

    if (activeObject) {
      cutObject(canvas, (object) => {
        copiedObjectRef.current = object
        toast.success('🎉 Selection cut')
      })
    }
  })

  const pasteContent = () => {
    if (!canvas) return

    const activeObject = canvas.getActiveObject()
    const clonedObject = copiedObjectRef.current

    if (activeObject && clonedObject) {
      pasteObjects({ canvas, copiedObject: clonedObject })

      if (clonedObject.get('data')?.cut) {
        copiedObjectRef.current = null
      }

      // Remove if anything is in clipboard
      navigator.clipboard.writeText('')

      return
    }

    if (!navigator.clipboard) {
      console.log('Clipboard API not found')

      return
    }

    navigator.clipboard.read().then((clipboardItems) => {
      clipboardItems.forEach((clipboardItem) => {
        if (clipboardItem.types.includes('image/png')) {
          clipboardItem.getType('image/png').then((blob) => {
            const pasteImage = new Image()
            pasteImage.src = URL.createObjectURL(blob)
            pasteImage.onload = () => {
              const imgInstance = new fabric.Image(pasteImage, {
                left: 100,
                top: 100,
              })

              imgInstance.scaleToWidth(canvas.getWidth() / 3)
              canvas.add(imgInstance)

              // Remove current active object
              canvas.discardActiveObject()

              // Set pasted object as active
              canvas.setActiveObject(imgInstance)
              canvas.renderAll()
            }
          })
        }

        if (clipboardItem.types.includes('text/plain')) {
          clipboardItem.getType('text/plain').then((blob) => {
            blob.text().then((text) => {
              const textInstance = new fabric.Textbox(text, {
                left: 100,
                top: 100,
              })

              textInstance.scaleToWidth(canvas.getWidth() / 3)
              canvas.add(textInstance)

              // Remove current active object
              canvas.discardActiveObject()

              // Set pasted object as active
              canvas.setActiveObject(textInstance)
              canvas.renderAll()
            })
          })
        }
      })
    })
  }

  // Paste shortcut for mac
  useHotkeys('cmd+v', pasteContent)

  // Paste shortcut for windows
  useHotkeys('ctrl+v', pasteContent)

  // Undo shortcut
  useHotkeys('ctrl+z', () => {
    if (!history) return

    history.undo()
  })

  // Redo shortcut
  useHotkeys('ctrl+shift+z', () => {
    if (!history) return

    history.redo()
  })
}
