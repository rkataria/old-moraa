import { fabric } from 'fabric'

import { TYPOGRAPHY_LIST } from '@/components/common/content-types/MoraaSlide/TextBox'
import { fonts } from '@/libs/fonts'

export type Template = {
  key: string
  name: string
  loadTemplate: (canvas: fabric.Canvas) => fabric.Canvas
}

const titleTypography = TYPOGRAPHY_LIST[0]
// const subtitleTypography = TYPOGRAPHY_LIST[1]
const headingTypography = TYPOGRAPHY_LIST[2]
const subheadingTypography = TYPOGRAPHY_LIST[3]
const bodyTypography = TYPOGRAPHY_LIST[4]
const smallTypography = TYPOGRAPHY_LIST[5]

export const MORAA_SLIDE_TEMPLATES: Template[] = [
  {
    key: 'blank',
    name: 'Blank',
    loadTemplate: (canvas: fabric.Canvas) => {
      canvas.clear()

      canvas.setBackgroundColor('transparent', canvas.renderAll.bind(canvas))

      canvas.requestRenderAll()
      canvas.fire('object:modified')

      return canvas
    },
  },
  {
    key: 'quote',
    name: 'Quote',
    loadTemplate: (canvas: fabric.Canvas) => {
      const quote = 'The harder you fall, the higher you bounce.'
      const author = '- Anonymous'

      const quoteText = new fabric.Textbox(quote, {
        name: headingTypography.name,
        fontSize: headingTypography.fontSize,
        fontWeight: headingTypography.fontWeight,
        fontFamily: fonts.inter.style.fontFamily,
        textAlign: 'center',
        width: canvas.getWidth() * 0.9,
        left: canvas.getWidth() * 0.05,
        top: canvas.getHeight() * 0.3,
      })

      const authorText = new fabric.Textbox(author, {
        name: bodyTypography.name,
        fontSize: bodyTypography.fontSize,
        fontWeight: bodyTypography.fontWeight,
        fontFamily: fonts.inter.style.fontFamily,
        textAlign: 'center',
        width: canvas.getWidth() * 0.6,
        left: canvas.getWidth() * 0.2,
        top:
          quoteText.getBoundingRect().top +
          quoteText.getBoundingRect().height +
          10,
      })

      canvas.clear()

      canvas.setBackgroundColor('transparent', canvas.renderAll.bind(canvas))

      canvas.add(quoteText)
      canvas.add(authorText)

      canvas.renderAll()
      canvas.fire('object:modified')

      return canvas
    },
  },
  {
    key: 'intro',
    name: 'Intro',
    loadTemplate: (canvas: fabric.Canvas) => {
      const title = 'A light minimalist template'

      const titleText = new fabric.Textbox(title, {
        name: titleTypography.name,
        fontSize: titleTypography.fontSize,
        fontWeight: titleTypography.fontWeight,
        fontFamily: fonts.inter.style.fontFamily,
        textAlign: 'center',
        padding: 10,
        width: canvas.getWidth() * 0.6,
      })

      canvas.clear()

      canvas.setBackgroundColor('transparent', canvas.renderAll.bind(canvas))

      canvas.add(titleText)
      canvas.viewportCenterObject(titleText)

      canvas.renderAll()
      canvas.fire('object:modified')

      return canvas
    },
  },
  {
    key: 'main-title',
    name: 'Main Title',
    loadTemplate: (canvas: fabric.Canvas) => {
      const title = 'A beautiful title'
      const subtitle = 'This is a subtitle for your beautiful presentation'
      const footerLeft = 'A company name'
      const footerRight = 'awesomesite.com'
      const footerCenter = new Date().toLocaleDateString('en-US')

      const titleText = new fabric.Textbox(title, {
        name: headingTypography.name,
        fontSize: headingTypography.fontSize,
        fontWeight: headingTypography.fontWeight,
        fontFamily: fonts.poppins.style.fontFamily,
        textAlign: 'center',
        padding: 10,
        width: canvas.getWidth() * 0.6,
        left: canvas.getWidth() * 0.2,
        top: canvas.getHeight() * 0.3,
      })

      const subtitleText = new fabric.Textbox(subtitle, {
        name: subheadingTypography.name,
        fontSize: subheadingTypography.fontSize,
        fontWeight: subheadingTypography.fontWeight,
        fontFamily: fonts.poppins.style.fontFamily,
        textAlign: 'center',
        padding: 2,
        width: canvas.getWidth() * 0.6,
        left: canvas.getWidth() * 0.2,
        top:
          titleText.getBoundingRect().top +
          titleText.getBoundingRect().height +
          10,
      })

      const footerLeftText = new fabric.Textbox(footerLeft, {
        name: smallTypography.name,
        fontSize: smallTypography.fontSize,
        fontWeight: smallTypography.fontWeight,
        fontFamily: fonts.poppins.style.fontFamily,
        textAlign: 'left',
        padding: 2,
        width: canvas.getWidth() * 0.3,
        top: canvas.getHeight() * 0.9,
        left: canvas.getWidth() * 0.05,
      })

      const footerRightText = new fabric.Textbox(footerRight, {
        name: smallTypography.name,
        fontSize: smallTypography.fontSize,
        fontWeight: smallTypography.fontWeight,
        fontFamily: fonts.poppins.style.fontFamily,
        textAlign: 'right',
        padding: 2,
        width: canvas.getWidth() * 0.3,
        top: canvas.getHeight() * 0.9,
        left: canvas.getWidth() * 0.65,
      })

      const footerCenterText = new fabric.Textbox(footerCenter, {
        name: smallTypography.name,
        fontSize: smallTypography.fontSize,
        fontWeight: smallTypography.fontWeight,
        fontFamily: fonts.poppins.style.fontFamily,
        textAlign: 'center',
        padding: 2,
        width: canvas.getWidth() * 0.3,
        top: canvas.getHeight() * 0.9,
        left: canvas.getWidth() * 0.35,
      })

      canvas.clear()

      canvas.setBackgroundColor('transparent', canvas.renderAll.bind(canvas))

      canvas.add(titleText)
      canvas.add(subtitleText)
      canvas.add(footerLeftText)
      canvas.add(footerRightText)
      canvas.add(footerCenterText)

      canvas.renderAll()
      canvas.fire('object:modified')

      return canvas
    },
  },
  {
    key: 'article',
    name: 'Article',
    loadTemplate: (canvas: fabric.Canvas) => {
      const title = 'A beautiful article'
      const subtitle = 'This is a subtitle for your beautiful presentation'
      const paragraph =
        'Ramen freemium conversion incubator buyer creative supply chain gen-z crowdsource. Pitch research & development seed round disruptive analytics. Churn rate freemium business-to-consumer business model canvas MVP. Marketing facebook seed round. A/B testing alpha user experience return on investment termsheet funding churn rate strategy mass market agile development early adopters.\n\n This is a new paragraph with a line break.'

      const titleText = new fabric.Textbox(title, {
        name: headingTypography.name,
        fontSize: headingTypography.fontSize,
        fontWeight: headingTypography.fontWeight,
        fontFamily: fonts.poppins.style.fontFamily,
        textAlign: 'left',
        padding: 10,
        width: canvas.getWidth() * 0.6,
        left: canvas.getWidth() * 0.1,
        top: canvas.getHeight() * 0.2,
      })

      const subtitleText = new fabric.Textbox(subtitle, {
        name: subheadingTypography.name,
        fontSize: subheadingTypography.fontSize,
        fontWeight: subheadingTypography.fontWeight,
        fontFamily: fonts.poppins.style.fontFamily,
        textAlign: 'left',
        padding: 10,
        width: canvas.getWidth() * 0.6,
        left: canvas.getWidth() * 0.1,
        top:
          titleText.getBoundingRect().top +
          titleText.getBoundingRect().height +
          10,
      })

      const paragraphText = new fabric.Textbox(paragraph, {
        name: smallTypography.name,
        fontSize: smallTypography.fontSize,
        fontWeight: smallTypography.fontWeight,
        fontFamily: fonts.poppins.style.fontFamily,
        textAlign: 'left',
        padding: 10,
        width: canvas.getWidth() * 0.8,
        left: canvas.getWidth() * 0.1,
        top:
          subtitleText.getBoundingRect().top +
          subtitleText.getBoundingRect().height +
          10,
        splitByGrapheme: true,
      })

      canvas.clear()

      canvas.setBackgroundColor('transparent', canvas.renderAll.bind(canvas))

      canvas.add(titleText)
      canvas.add(subtitleText)
      canvas.add(paragraphText)

      canvas.renderAll()
      canvas.fire('object:modified')

      return canvas
    },
  },
  {
    key: 'article-image-left',
    name: 'Image Left',
    loadTemplate: (canvas: fabric.Canvas) => {
      canvas.clear()

      const canvasWidth = canvas.getWidth()

      const titleText = 'A beautiful image'
      const subtitleText = 'This is a subtitle for your beautiful presentation'
      const paragraph =
        'Ramen freemium conversion incubator buyer creative supply chain gen-z crowdsource. Pitch research & development seed round disruptive analytics. Churn rate freemium business-to-consumer business model canvas MVP. Marketing facebook seed round. A/B testing alpha user experience return on investment termsheet funding churn rate strategy mass market agile development early adopters.'
      const imageUrl =
        'https://images.unsplash.com/photo-1720587844245-eea34eaad7fa?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

      fabric.Image.fromURL(
        imageUrl,
        (img) => {
          img.set({
            left: 0,
            top: 0,
          })

          img.scaleToHeight(canvas.getHeight())
          img.scaleToWidth(canvasWidth * 0.5)
          canvas.add(img)

          return img
        },
        {
          crossOrigin: 'anonymous',
        }
      )

      const title = new fabric.Textbox(titleText, {
        name: headingTypography.name,
        fontSize: headingTypography.fontSize,
        fontWeight: headingTypography.fontWeight,
        fontFamily: fonts.tiltWarp.style.fontFamily,
        textAlign: 'left',
        padding: 10,
        width: canvasWidth * 0.4,
        left: canvasWidth * 0.55,
        top: canvas.getHeight() * 0.2,
      })

      const subtitle = new fabric.Textbox(subtitleText, {
        name: subheadingTypography.name,
        fontSize: subheadingTypography.fontSize,
        fontWeight: subheadingTypography.fontWeight,
        fontFamily: fonts.poppins.style.fontFamily,
        textAlign: 'left',
        padding: 10,
        width: canvasWidth * 0.4,
        left: canvasWidth * 0.55,
        top: title.getBoundingRect().top + title.getBoundingRect().height + 10,
      })

      const paragraphText = new fabric.Textbox(paragraph, {
        name: smallTypography.name,
        fontSize: smallTypography.fontSize,
        fontWeight: smallTypography.fontWeight,
        fontFamily: fonts.poppins.style.fontFamily,
        textAlign: 'left',
        padding: 10,
        width: canvasWidth * 0.4,
        left: canvasWidth * 0.55,
        top:
          subtitle.getBoundingRect().top +
          subtitle.getBoundingRect().height +
          10,
      })

      canvas.add(title)
      canvas.add(subtitle)
      canvas.add(paragraphText)

      canvas.requestRenderAll()

      canvas.setBackgroundColor('transparent', canvas.renderAll.bind(canvas))

      canvas.renderAll()
      canvas.fire('object:modified')

      return canvas
    },
  },
  {
    key: 'article-image-right',
    name: 'Image Right',
    loadTemplate: (canvas: fabric.Canvas) => {
      canvas.clear()

      const titleText = 'A beautiful image'
      const subtitleText = 'This is a subtitle for your beautiful presentation'
      const paragraph =
        'Ramen freemium conversion incubator buyer creative supply chain gen-z crowdsource. Pitch research & development seed round disruptive analytics. Churn rate freemium business-to-consumer business model canvas MVP. Marketing facebook seed round. A/B testing alpha user experience return on investment termsheet funding churn rate strategy mass market agile development early adopters.'
      const imageUrl =
        'https://images.unsplash.com/photo-1574001412367-cf5f9756bb32?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920&h=1920&fit=max&ixid=eyJhcHBfaWQiOjgzNjd9'

      fabric.Image.fromURL(imageUrl, (img) => {
        img.set({
          left: canvas.getWidth() * 0.5,
          top: 0,
        })

        img.scaleToHeight(canvas.getHeight())

        canvas.add(img)
      })

      const title = new fabric.Textbox(titleText, {
        name: headingTypography.name,
        fontSize: headingTypography.fontSize,
        fontWeight: headingTypography.fontWeight,
        fontFamily: fonts.tiltWarp.style.fontFamily,
        textAlign: 'left',
        padding: 10,
        width: canvas.getWidth() * 0.4,
        left: canvas.getWidth() * 0.05,
        top: canvas.getHeight() * 0.2,
      })

      const subtitle = new fabric.Textbox(subtitleText, {
        name: subheadingTypography.name,
        fontSize: subheadingTypography.fontSize,
        fontWeight: subheadingTypography.fontWeight,
        fontFamily: fonts.poppins.style.fontFamily,
        textAlign: 'left',
        padding: 10,
        width: canvas.getWidth() * 0.4,
        left: canvas.getWidth() * 0.05,
        top: title.getBoundingRect().top + title.getBoundingRect().height + 10,
      })

      const paragraphText = new fabric.Textbox(paragraph, {
        name: smallTypography.name,
        fontSize: smallTypography.fontSize,
        fontWeight: smallTypography.fontWeight,
        fontFamily: fonts.poppins.style.fontFamily,
        textAlign: 'left',
        padding: 10,
        width: canvas.getWidth() * 0.4,
        left: canvas.getWidth() * 0.05,
        top:
          subtitle.getBoundingRect().top +
          subtitle.getBoundingRect().height +
          10,
      })
      canvas.add(title)
      canvas.add(subtitle)
      canvas.add(paragraphText)

      canvas.requestRenderAll()

      canvas.setBackgroundColor('transparent', canvas.renderAll.bind(canvas))

      canvas.renderAll()
      canvas.fire('object:modified')

      return canvas
    },
  },
  {
    key: 'background-image',
    name: 'Background Image',
    loadTemplate: (canvas: fabric.Canvas) => {
      canvas.clear()

      const imageUrl =
        'https://images.unsplash.com/photo-1574001412367-cf5f9756bb32?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920&h=1920&fit=max&ixid=eyJhcHBfaWQiOjgzNjd9'

      fabric.Image.fromURL(imageUrl, (img) => {
        img.set({
          left: 0,
          top: 0,
        })

        img.scaleToHeight(canvas.getHeight())
        img.scaleToWidth(canvas.getWidth())
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas))
        canvas.fire('object:modified', { target: img })
        canvas.renderAll()
      })

      return canvas
    },
  },
]
