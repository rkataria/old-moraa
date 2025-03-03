/* eslint-disable max-classes-per-file */
import { fabric } from 'fabric'

import { getBulletChar } from '@/components/frames/frame-types/MoraaSlide/ListBox'

declare module 'fabric/fabric-impl' {
  export class BulletList extends Textbox {
    bulletType: string
  }

  export class NumberList extends Textbox {
    bulletType: string
  }

  export class StickyNote extends Rect {
    type: string
  }

  export interface IObjectOptions {
    id?: string
    bulletType?: string
    text?: string
  }
}

export const loadCustomFabricObjects = () => {
  /** *************************** */
  /** BulletList                  */
  /** *************************** */
  fabric.BulletList = fabric.util.createClass(fabric.Textbox, {
    type: 'BulletList',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialize(text: string, options: fabric.IObjectOptions) {
      this.callSuper('initialize', text, options)
      this.set('bulletType', options.bulletType || '')

      // This logic adds a bullet when a bullet list is added on canvas first time
      const updatedText = this.text
        .split('\n')
        .map((line: string) =>
          line.startsWith(getBulletChar(this.bulletType))
            ? `${getBulletChar(this.bulletType)} ${line.slice(2)}`
            : `${getBulletChar(this.bulletType)} ${line}`
        )
        .join('\n')
      this.text = updatedText

      this.set('text', updatedText)
    },
    onInput(e: Event) {
      this.callSuper('onInput', e)

      const updatedText = this.text
        .split('\n')
        .map((line: string) =>
          line.startsWith(getBulletChar(this.bulletType))
            ? `${getBulletChar(this.bulletType)} ${line.slice(2)}`
            : `${getBulletChar(this.bulletType)} ${line}`
        )
        .join('\n')
      this.text = updatedText

      this.set('text', updatedText)
      this.setSelectionStart(updatedText.length + 1) // +1 to move cursor to the end
      this.setSelectionEnd(updatedText.length + 1) // +1 to move cursor to the end
      this.canvas?.requestRenderAll()
    },
    toObject() {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        bulletType: this.get('bulletType'),
      })
    },
  })

  fabric.BulletList.fromObject = (
    options: fabric.IObjectOptions,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: any
  ) => callback(new fabric.BulletList(options.text!, options))

  /** *************************** */
  /** NumberList                  */
  /** *************************** */
  fabric.NumberList = fabric.util.createClass(fabric.Textbox, {
    type: 'NumberList',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialize(text: string, options: fabric.IObjectOptions) {
      this.callSuper('initialize', text, options)
    },
    onInput(e: Event) {
      this.callSuper('onInput', e)

      const isList = this.text
        .split('\n')
        .some((line: string) => line.startsWith('1.'))

      if (!isList) {
        const updatedText = this.text
          .split('\n')
          .map((line: string, index: number) => `${index + 1}. ${line}`)
          .join('\n')
        this.text = updatedText

        this.set('text', updatedText)
        this.setSelectionStart(updatedText.length + 1) // +1 to move cursor to the end
        this.setSelectionEnd(updatedText.length + 1) // +1 to move cursor to the end
        this.canvas?.requestRenderAll()
      }
    },
    toObject() {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        type: this.type,
      })
    },
  })
  fabric.NumberList.fromObject = (
    options: fabric.IObjectOptions,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: any
  ) => callback(new fabric.NumberList(options.text!, options))
}
