import Image from '@tiptap/extension-image'

export const CustomImageResize = Image.extend({
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      style: {
        default: 'width: 100%; height: auto; cursor: pointer;',
        parseHTML: (element) => {
          const width = element.getAttribute('width')

          return width
            ? `width: ${width}px; height: auto; cursor: pointer;`
            : `${element.style.cssText}`
        },
      },
      title: {
        default: null,
      },
      loading: {
        default: null,
      },
      srcset: {
        default: null,
      },
      sizes: {
        default: null,
      },
      crossorigin: {
        default: null,
      },
      usemap: {
        default: null,
      },
      ismap: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
      referrerpolicy: {
        default: null,
      },
      longdesc: {
        default: null,
      },
      decoding: {
        default: null,
      },
      class: {
        default: null,
      },
      id: {
        default: null,
      },
      name: {
        default: null,
      },
      draggable: {
        default: true,
      },
      tabindex: {
        default: null,
      },
      'aria-label': {
        default: null,
      },
      'aria-labelledby': {
        default: null,
      },
      'aria-describedby': {
        default: null,
      },
    }
  },
  addNodeView() {
    return ({ node, editor, getPos }) => {
      const {
        view,
        options: { editable },
      } = editor
      const { style } = node.attrs
      const $wrapper = document.createElement('div')
      const $container = document.createElement('div')
      const $img = document.createElement('img')
      const iconStyle = 'width: 24px; height: 24px; cursor: pointer;'

      const dispatchNodeView = () => {
        if (typeof getPos === 'function') {
          const newAttrs = {
            ...node.attrs,
            style: `${$img.style.cssText}`,
          }
          view.dispatch(view.state.tr.setNodeMarkup(getPos(), null, newAttrs))
        }
      }
      const paintPositionContoller = () => {
        const $postionController = document.createElement('div')

        const $leftController = document.createElement('img')
        const $centerController = document.createElement('img')
        const $rightController = document.createElement('img')

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const controllerMouseOver = (e: any) => {
          e.target.style.opacity = 0.3
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const controllerMouseOut = (e: any) => {
          e.target.style.opacity = 1
        }

        $postionController.setAttribute(
          'class',
          'absolute left-[50%] top-0 h-10 translate-x-[-50%] translate-y-[-50%] flex justify-center items-center gap-2 shadow-md bg-gray-100 p-2 rounded-md text-black transition-all duration-500 z-[1]'
        )

        $leftController.setAttribute(
          'src',
          'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_left/default/20px.svg'
        )
        $leftController.setAttribute('style', iconStyle)
        $leftController.addEventListener('mouseover', controllerMouseOver)
        $leftController.addEventListener('mouseout', controllerMouseOut)

        $centerController.setAttribute(
          'src',
          'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_center/default/20px.svg'
        )
        $centerController.setAttribute('style', iconStyle)
        $centerController.addEventListener('mouseover', controllerMouseOver)
        $centerController.addEventListener('mouseout', controllerMouseOut)

        $rightController.setAttribute(
          'src',
          'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_right/default/20px.svg'
        )
        $rightController.setAttribute('style', iconStyle)
        $rightController.addEventListener('mouseover', controllerMouseOver)
        $rightController.addEventListener('mouseout', controllerMouseOut)

        $leftController.addEventListener('click', () => {
          $img.setAttribute(
            'style',
            `${$img.style.cssText} margin: 0 auto 0 0;`
          )
          dispatchNodeView()
        })
        $centerController.addEventListener('click', () => {
          $img.setAttribute('style', `${$img.style.cssText} margin: 0 auto;`)
          dispatchNodeView()
        })
        $rightController.addEventListener('click', () => {
          $img.setAttribute(
            'style',
            `${$img.style.cssText} margin: 0 0 0 auto;`
          )
          dispatchNodeView()
        })

        $postionController.appendChild($leftController)
        $postionController.appendChild($centerController)
        $postionController.appendChild($rightController)

        $container.appendChild($postionController)
      }

      $wrapper.setAttribute('style', 'display: flex;')
      $wrapper.appendChild($container)

      $container.setAttribute('style', `${style}`)
      $container.appendChild($img)

      Object.entries(node.attrs).forEach(([key, value]) => {
        if (value === undefined || value === null) return
        $img.setAttribute(key, value)
      })

      if (!editable) return { dom: $img }

      const dotsPosition = [
        'top: -4px; left: -4px; cursor: nwse-resize;',
        'top: -4px; right: -4px; cursor: nesw-resize;',
        'bottom: -4px; left: -4px; cursor: nesw-resize;',
        'bottom: -4px; right: -4px; cursor: nwse-resize;',
      ]

      let isResizing = false
      let startX: number
      let startWidth: number

      $container.addEventListener('click', () => {
        // remove remaining dots and position controller
        if ($container.childElementCount > 3) {
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < 5; i++) {
            $container.removeChild($container.lastChild as Node)
          }
        }

        paintPositionContoller()

        $container.setAttribute(
          'style',
          `position: relative; border: 1px dashed #6C6C6C; ${style} cursor: pointer;`
        )
        // eslint-disable-next-line array-callback-return
        Array.from({ length: 4 }, (_, index) => {
          const $dot = document.createElement('div')
          $dot.setAttribute(
            'style',
            `position: absolute; width: 9px; height: 9px; border: 1.5px solid #6C6C6C; border-radius: 50%; ${dotsPosition[index]}`
          )

          $dot.addEventListener('mousedown', (e) => {
            e.preventDefault()
            isResizing = true
            startX = e.clientX
            startWidth = $container.offsetWidth
            // eslint-disable-next-line @typescript-eslint/no-shadow,
            const onMouseMove = (e: MouseEvent) => {
              if (!isResizing) return
              const deltaX =
                index % 2 === 0 ? -(e.clientX - startX) : e.clientX - startX

              const newWidth = startWidth + deltaX

              $container.style.width = `${newWidth}px`

              $img.style.width = `${newWidth}px`
            }

            const onMouseUp = () => {
              if (isResizing) {
                isResizing = false
              }
              dispatchNodeView()

              document.removeEventListener('mousemove', onMouseMove)
              document.removeEventListener('mouseup', onMouseUp)
            }

            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', onMouseUp)
          })
          $container.appendChild($dot)
        })
      })

      document.addEventListener('click', (e: MouseEvent) => {
        const $target = e.target as HTMLElement
        const isClickInside =
          $container.contains($target) || $target.style.cssText === iconStyle

        if (!isClickInside) {
          const containerStyle = $container.getAttribute('style')
          const newStyle = containerStyle?.replace(
            'border: 1px dashed #6C6C6C;',
            ''
          )
          $container.setAttribute('style', newStyle as string)

          if ($container.childElementCount > 3) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < 5; i++) {
              $container.removeChild($container.lastChild as Node)
            }
          }
        }
      })

      return {
        dom: $wrapper,
      }
    }
  },
})
