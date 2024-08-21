import { fabric } from 'fabric'

export const dupliacateObjects = (
  canvas: fabric.Canvas,
  callback?: () => void
) => {
  const activeObject = canvas.getActiveObject()

  if (!activeObject) return

  // If active object is a active selection
  if (activeObject.type === 'activeSelection') {
    const objects = (activeObject as fabric.ActiveSelection).getObjects()

    const clonedObjects: fabric.Object[] = []
    objects.forEach((object: fabric.Object) => {
      object.clone((clonedObject: fabric.Object) => {
        clonedObject.set({
          left: activeObject.left! + clonedObject.left! + 10,
          top: activeObject.top! + clonedObject.top! + 10,
        })

        clonedObjects.push(clonedObject)
      })
    })

    canvas.add(...clonedObjects)
    const selection = new fabric.ActiveSelection(clonedObjects, {
      canvas,
    })
    canvas.discardActiveObject()
    canvas.setActiveObject(selection)
    canvas.requestRenderAll()
    callback?.()

    return
  }

  // If active object is a group
  if (activeObject.type === 'group') {
    const objects = (activeObject as fabric.Group).getObjects()

    const clonedObjects: fabric.Object[] = []
    objects.forEach((object: fabric.Object) => {
      object.clone((clonedObject: fabric.Object) => {
        clonedObject.set({
          left: clonedObject.left! + 10,
          top: clonedObject.top! + 10,
        })

        clonedObjects.push(clonedObject)
      })
    })

    canvas.add(...clonedObjects)
    const group = new fabric.Group(objects, {
      canvas,
    })
    canvas.discardActiveObject()
    canvas.setActiveObject(group)
    canvas.requestRenderAll()
    callback?.()

    return
  }

  // If active object is a single object
  canvas.getActiveObject()?.clone((clonedObject: fabric.Object) => {
    clonedObject.set({
      left: clonedObject.left! + 10,
      top: clonedObject.top! + 10,
    })
    canvas.add(clonedObject)
    canvas.setActiveObject(clonedObject)
    canvas.renderAll()
    callback?.()
  })
}
