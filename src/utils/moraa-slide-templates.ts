import { fabric } from 'fabric'

import { TYPOGRAPHY_LIST } from '@/components/common/content-types/MoraaSlide/TextBox'
import { DEFAULT_FONT_FAMILY } from '@/libs/fonts'

export type MoraaSlideTemplate = {
  key: string
  name: string
  thumbnail: string
  loadTemplate: (canvas: fabric.Canvas) => fabric.Canvas
}

const titleTypography = TYPOGRAPHY_LIST[0]
const subtitleTypography = TYPOGRAPHY_LIST[1]
const headingTypography = TYPOGRAPHY_LIST[2]
const subheadingTypography = TYPOGRAPHY_LIST[3]
const bodyTypography = TYPOGRAPHY_LIST[4]
const smallTypography = TYPOGRAPHY_LIST[5]
const DEFAULT_LINE_HEIGHT = 1.5

const loadCenterGuideHelperRect = (canvas: fabric.Canvas) => {
  console.log('loadCenterGuideHelperRect', canvas)
  // NOTE: Add a background rect to make guides visible to center objects
  // const rect = new fabric.Rect({
  //   name: 'guide-rect',
  //   left: 0,
  //   top: 0,
  //   width: canvas.getWidth(),
  //   height: canvas.getHeight(),
  //   fill: '#f0f0f000',
  //   selectable: false,
  //   lockMovementX: true,
  //   lockMovementY: true,
  //   lockScalingX: true,
  //   lockScalingY: true,
  //   lockRotation: true,
  //   lockScalingFlip: true,
  //   lockUniScaling: true,
  //   hoverCursor: 'context-menu',
  // })
  // canvas.add(rect)
  // canvas.sendToBack(rect)
}

export const MORAA_SLIDE_TEMPLATES: MoraaSlideTemplate[] = [
  {
    key: 'title',
    name: 'Title',
    thumbnail: '/images/frame-templates/moraa-slide/title.png',
    loadTemplate: (canvas: fabric.Canvas) => {
      const title = 'A beautiful title'
      const subtitle = 'A subtitle for your beautiful presentation'

      const titleText = new fabric.Textbox(title, {
        name: titleTypography.name,
        fontSize: titleTypography.fontSize,
        fontWeight: titleTypography.fontWeight,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'center',
        padding: 20,
        width: canvas.getWidth() * 0.6,
        left: canvas.getWidth() * 0.2,
        top: canvas.getHeight() * 0.35,
      })

      const subtitleText = new fabric.Textbox(subtitle, {
        name: subheadingTypography.name,
        fontSize: subheadingTypography.fontSize,
        fontWeight: subheadingTypography.fontWeight,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'center',
        padding: 10,
        width: canvas.getWidth() * 0.6,
        left: canvas.getWidth() * 0.2,
        top:
          titleText.getBoundingRect().top +
          titleText.getBoundingRect().height +
          10,
      })

      canvas.clear()

      // NOTE: Add a background rect to make guides visible to center objects
      loadCenterGuideHelperRect(canvas)

      canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas))

      canvas.add(titleText)
      canvas.add(subtitleText)

      canvas.renderAll()
      canvas.fire('object:modified')

      return canvas
    },
  },
  {
    key: 'heading-content',
    name: 'Content',
    thumbnail: '/images/frame-templates/moraa-slide/content.png',
    loadTemplate: (canvas: fabric.Canvas) => {
      const title = 'A beautiful article'
      const content =
        'Ramen freemium conversion incubator buyer creative supply chain gen-z crowdsource. Pitch research & development seed round disruptive analytics. Churn rate freemium business-to-consumer business model canvas MVP. Marketing facebook seed round. A/B testing alpha user experience return on investment termsheet funding churn rate strategy mass market agile development early adopters.'

      const titleText = new fabric.Textbox(title, {
        name: subtitleTypography.name,
        fontSize: subtitleTypography.fontSize,
        fontWeight: subtitleTypography.fontWeight,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'center',
        padding: 20,
        width: canvas.getWidth() * 0.6,
        left: canvas.getWidth() * 0.2,
        top: canvas.getHeight() * 0.3,
      })

      const contentText = new fabric.Textbox(content, {
        name: smallTypography.name,
        fontSize: smallTypography.fontSize,
        fontWeight: smallTypography.fontWeight,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'center',
        padding: 10,
        width: canvas.getWidth() * 0.8,
        left: canvas.getWidth() * 0.1,
        top:
          titleText.getBoundingRect().top +
          titleText.getBoundingRect().height +
          10,
        splitByGrapheme: true,
      })

      canvas.clear()

      // NOTE: Add a background rect to make guides visible to center objects
      loadCenterGuideHelperRect(canvas)

      canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas))

      canvas.add(titleText)
      canvas.add(contentText)

      canvas.renderAll()
      canvas.fire('object:modified')

      return canvas
    },
  },
  {
    key: 'image-caption',
    name: 'Image Caption',
    thumbnail: '/images/frame-templates/moraa-slide/image-caption.png',
    loadTemplate: (canvas: fabric.Canvas) => {
      canvas.clear()

      // NOTE: Add a background rect to make guides visible to center objects
      loadCenterGuideHelperRect(canvas)

      const captionText = 'A caption for the beautiful image'
      const imageUrl =
        'https://plus.unsplash.com/premium_photo-1666432045848-3fdbb2c74531?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

      fabric.Image.fromURL(
        imageUrl,
        (img) => {
          img.set({
            left: 0,
            top: 0,
          })

          if (img.width! > canvas.getWidth()) {
            img.scaleToWidth(canvas.getWidth() + 20)
          } else {
            img.scaleToHeight(canvas.getHeight() + 20)
          }

          canvas.add(img)

          img.sendToBack()

          return img
        },
        {
          crossOrigin: 'anonymous',
        }
      )

      const captionContainer = new fabric.Rect({
        left: 0,
        width: canvas.getWidth(),
        height: 40,
        fill: 'rgba(0, 0, 0, 0.5)',
      })
      captionContainer.set({
        top:
          canvas.getHeight() - captionContainer.getBoundingRect().height + 20,
      })

      const caption = new fabric.Textbox(captionText, {
        name: smallTypography.name,
        fontSize: smallTypography.fontSize,
        fontWeight: smallTypography.fontWeight,
        fontFamily: DEFAULT_FONT_FAMILY,
        textAlign: 'center',
        fill: '#FFFFFF',
        lineHeight: 1,
        width: canvas.getWidth() * 0.6,
        left: canvas.getWidth() * 0.2,
      })

      caption.set({
        top:
          canvas.getHeight() -
          (caption.getBoundingRect().height +
            captionContainer.getBoundingRect().height) /
            2 +
          20,
      })

      canvas.add(caption)
      canvas.add(captionContainer)

      canvas.sendToBack(captionContainer)

      canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas))

      canvas.renderAll()
      canvas.fire('object:modified')

      return canvas
    },
  },
  {
    key: 'big-number',
    name: 'Big Number',
    thumbnail: '/images/frame-templates/moraa-slide/big-number.png',
    loadTemplate: (canvas: fabric.Canvas) => {
      const title = '8.2 Billion'
      const subtitle = 'Total population of the world'

      const titleText = new fabric.Textbox(title, {
        name: titleTypography.name,
        fontSize: titleTypography.fontSize * 1.25,
        fontWeight: 800,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'center',
        padding: 20,
        width: canvas.getWidth() * 0.6,
        left: canvas.getWidth() * 0.2,
        top: canvas.getHeight() * 0.3,
      })

      const subtitleText = new fabric.Textbox(subtitle, {
        name: headingTypography.name,
        fontSize: headingTypography.fontSize,
        fontWeight: headingTypography.fontWeight,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'center',
        padding: 0,
        width: canvas.getWidth() * 0.6,
        left: canvas.getWidth() * 0.2,
        top:
          titleText.getBoundingRect().top + titleText.getBoundingRect().height,
      })

      canvas.clear()

      // NOTE: Add a background rect to make guides visible to center objects
      loadCenterGuideHelperRect(canvas)

      canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas))

      canvas.add(titleText)
      canvas.add(subtitleText)

      canvas.renderAll()
      canvas.fire('object:modified')

      return canvas
    },
  },
  {
    key: 'two-columns',
    name: 'Two Columns',
    thumbnail: '/images/frame-templates/moraa-slide/two-columns.png',
    loadTemplate: (canvas: fabric.Canvas) => {
      canvas.clear()

      // NOTE: Add a background rect to make guides visible to center objects
      loadCenterGuideHelperRect(canvas)

      const titleText = 'A beautiful image'
      const columnOneTitleText = 'Column One'
      const columnTwoTitleText = 'Column Two'
      const columnOneText =
        'Ramen freemium conversion incubator buyer creative supply chain gen-z crowdsource. Pitch research & development seed round disruptive analytics. Churn rate freemium business-to-consumer business model canvas MVP. Marketing facebook seed round. A/B testing alpha user experience return on investment termsheet funding churn rate strategy mass market agile development early adopters.'
      const columnTwoText =
        'Ramen freemium conversion incubator buyer creative supply chain gen-z crowdsource. Pitch research & development seed round disruptive analytics. Churn rate freemium business-to-consumer business model canvas MVP. Marketing facebook seed round. A/B testing alpha user experience return on investment termsheet funding churn rate strategy mass market agile development early adopters.'

      const title = new fabric.Textbox(titleText, {
        name: headingTypography.name,
        fontSize: headingTypography.fontSize * 1.25,
        fontWeight: 600,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        width: canvas.getWidth() * 0.8,
        left: canvas.getWidth() * 0.05,
        top: canvas.getHeight() * 0.1,
      })

      const columnOneTitle = new fabric.Textbox(columnOneTitleText, {
        name: bodyTypography.name,
        fontSize: bodyTypography.fontSize,
        fontWeight: 600,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        fill: '#a6a6a6',
        width: canvas.getWidth() * 0.4,
        left: canvas.getWidth() * 0.05,
        top: title.getBoundingRect().top + title.getBoundingRect().height + 10,
      })

      const columnTwoTitle = new fabric.Textbox(columnTwoTitleText, {
        name: bodyTypography.name,
        fontSize: bodyTypography.fontSize,
        fontWeight: 600,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        fill: '#a6a6a6',
        width: canvas.getWidth() * 0.4,
        left: canvas.getWidth() * 0.55,
        top: title.getBoundingRect().top + title.getBoundingRect().height + 10,
      })

      const columnOne = new fabric.Textbox(columnOneText, {
        name: smallTypography.name,
        fontSize: smallTypography.fontSize,
        fontWeight: smallTypography.fontWeight,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        width: canvas.getWidth() * 0.4,
        left: canvas.getWidth() * 0.05,
        top:
          columnOneTitle.getBoundingRect().top +
          columnOneTitle.getBoundingRect().height +
          10,
      })

      const columnTwo = new fabric.Textbox(columnTwoText, {
        name: smallTypography.name,
        fontSize: smallTypography.fontSize,
        fontWeight: smallTypography.fontWeight,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        width: canvas.getWidth() * 0.4,
        left: canvas.getWidth() * 0.55,
        top:
          columnTwoTitle.getBoundingRect().top +
          columnTwoTitle.getBoundingRect().height +
          10,
      })

      canvas.add(title)
      canvas.add(columnOneTitle)
      canvas.add(columnTwoTitle)
      canvas.add(columnOne)
      canvas.add(columnTwo)

      canvas.requestRenderAll()

      canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas))

      canvas.renderAll()
      canvas.fire('object:modified')

      return canvas
    },
  },
  {
    key: 'three-columns',
    name: 'Three Columns',
    thumbnail: '/images/frame-templates/moraa-slide/three-columns.png',
    loadTemplate: (canvas: fabric.Canvas) => {
      canvas.clear()

      // NOTE: Add a background rect to make guides visible to center objects
      loadCenterGuideHelperRect(canvas)

      const titleText = 'A beautiful image'
      const columnOneOrderText = '1.'
      const columnTwoOrderText = '2.'
      const columnThreeOrderText = '3.'

      const columnOneTitleText = 'Column One'
      const columnTwoTitleText = 'Column Two'
      const columnThreeTitleText = 'Column Three'

      const columnOneText =
        'Ramen freemium conversion incubator buyer creative supply chain gen-z crowdsource. Pitch research & development seed round disruptive analytics. Churn rate freemium business-to-consumer business model canvas MVP.'
      const columnTwoText =
        'Ramen freemium conversion incubator buyer creative supply chain gen-z crowdsource. Pitch research & development seed round disruptive analytics. Churn rate freemium business-to-consumer business model canvas MVP.'
      const columnThreeText =
        'Ramen freemium conversion incubator buyer creative supply chain gen-z crowdsource. Pitch research & development seed round disruptive analytics. Churn rate freemium business-to-consumer business model canvas MVP.'

      const title = new fabric.Textbox(titleText, {
        name: headingTypography.name,
        fontSize: headingTypography.fontSize * 1.25,
        fontWeight: 600,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        width: canvas.getWidth() * 0.8,
        left: canvas.getWidth() * 0.05,
        top: canvas.getHeight() * 0.1,
      })

      const columnOneOrder = new fabric.Textbox(columnOneOrderText, {
        name: subtitleTypography.name,
        fontSize: subtitleTypography.fontSize,
        fontWeight: 800,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        fill: '#d8d8d8',
        width: canvas.getWidth() * 0.25,
        left: canvas.getWidth() * 0.05,
        top: title.getBoundingRect().top + title.getBoundingRect().height + 40,
      })

      const columnTwoOrder = new fabric.Textbox(columnTwoOrderText, {
        name: subtitleTypography.name,
        fontSize: subtitleTypography.fontSize,
        fontWeight: 800,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        fill: '#d8d8d8',
        width: canvas.getWidth() * 0.25,
        left: canvas.getWidth() * 0.35,
        top: title.getBoundingRect().top + title.getBoundingRect().height + 40,
      })

      const columnThreeOrder = new fabric.Textbox(columnThreeOrderText, {
        name: subtitleTypography.name,
        fontSize: subtitleTypography.fontSize,
        fontWeight: 800,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        fill: '#d8d8d8',
        width: canvas.getWidth() * 0.25,
        left: canvas.getWidth() * 0.65,
        top: title.getBoundingRect().top + title.getBoundingRect().height + 40,
      })

      const columnOneTitle = new fabric.Textbox(columnOneTitleText, {
        name: bodyTypography.name,
        fontSize: bodyTypography.fontSize,
        fontWeight: 600,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        fill: '#a6a6a6',
        width: canvas.getWidth() * 0.25,
        left: canvas.getWidth() * 0.05,
        top:
          columnOneOrder.getBoundingRect().top +
          columnOneOrder.getBoundingRect().height +
          10,
      })

      const columnTwoTitle = new fabric.Textbox(columnTwoTitleText, {
        name: bodyTypography.name,
        fontSize: bodyTypography.fontSize,
        fontWeight: 600,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        fill: '#a6a6a6',
        width: canvas.getWidth() * 0.25,
        left: canvas.getWidth() * 0.35,
        top:
          columnTwoOrder.getBoundingRect().top +
          columnTwoOrder.getBoundingRect().height +
          10,
      })

      const columnThreeTitle = new fabric.Textbox(columnThreeTitleText, {
        name: bodyTypography.name,
        fontSize: bodyTypography.fontSize,
        fontWeight: 600,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        fill: '#a6a6a6',
        width: canvas.getWidth() * 0.25,
        left: canvas.getWidth() * 0.65,
        top:
          columnThreeOrder.getBoundingRect().top +
          columnThreeOrder.getBoundingRect().height +
          10,
      })

      const columnOne = new fabric.Textbox(columnOneText, {
        name: smallTypography.name,
        fontSize: smallTypography.fontSize,
        fontWeight: smallTypography.fontWeight,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        width: canvas.getWidth() * 0.25,
        left: canvas.getWidth() * 0.05,
        top:
          columnOneTitle.getBoundingRect().top +
          columnOneTitle.getBoundingRect().height +
          10,
      })

      const columnTwo = new fabric.Textbox(columnTwoText, {
        name: smallTypography.name,
        fontSize: smallTypography.fontSize,
        fontWeight: smallTypography.fontWeight,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        width: canvas.getWidth() * 0.25,
        left: canvas.getWidth() * 0.35,
        top:
          columnTwoTitle.getBoundingRect().top +
          columnTwoTitle.getBoundingRect().height +
          10,
      })

      const columnThree = new fabric.Textbox(columnThreeText, {
        name: smallTypography.name,
        fontSize: smallTypography.fontSize,
        fontWeight: smallTypography.fontWeight,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        width: canvas.getWidth() * 0.25,
        left: canvas.getWidth() * 0.65,
        top:
          columnThreeTitle.getBoundingRect().top +
          columnThreeTitle.getBoundingRect().height +
          10,
      })

      canvas.add(title)
      canvas.add(columnOneOrder)
      canvas.add(columnTwoOrder)
      canvas.add(columnThreeOrder)
      canvas.add(columnOneTitle)
      canvas.add(columnTwoTitle)
      canvas.add(columnThreeTitle)
      canvas.add(columnOne)
      canvas.add(columnTwo)
      canvas.add(columnThree)

      canvas.requestRenderAll()

      canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas))

      canvas.renderAll()
      canvas.fire('object:modified')

      return canvas
    },
  },
  {
    key: 'vertical-list',
    name: 'Vertical List',
    thumbnail: '/images/frame-templates/moraa-slide/vertical-list.png',
    loadTemplate: (canvas: fabric.Canvas) => {
      canvas.clear()

      // NOTE: Add a background rect to make guides visible to center objects
      loadCenterGuideHelperRect(canvas)

      const titleText = 'The awesome list'
      const listOneTitleText = 'List One'
      const listTwoTitleText = 'List Two'
      const listThreeTitleText = 'List Three'

      const listOneDesciptionText =
        'Ramen freemium conversion incubator buyer creative supply chain gen-z crowdsource.'
      const listTwoDesciptionText =
        'Pitch research & development seed round disruptive analytics.'
      const listThreeDesciptionText =
        'Churn rate freemium business-to-consumer business model canvas MVP.'

      const title = new fabric.Textbox(titleText, {
        name: headingTypography.name,
        fontSize: headingTypography.fontSize * 1.25,
        fontWeight: 600,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        width: canvas.getWidth() * 0.4,
        left: canvas.getWidth() * 0.05,
      })

      title.set({
        top: canvas.getHeight() / 2 - title.getBoundingRect().height / 2,
      })

      const listOneTitle = new fabric.Textbox(listOneTitleText, {
        name: bodyTypography.name,
        fontSize: bodyTypography.fontSize,
        fontWeight: 600,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        fill: '#a6a6a6',
        width: canvas.getWidth() * 0.4,
        left: canvas.getWidth() * 0.5,
        top: canvas.getHeight() * 0.1,
      })

      const listTwoTitle = new fabric.Textbox(listTwoTitleText, {
        name: bodyTypography.name,
        fontSize: bodyTypography.fontSize,
        fontWeight: 600,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        fill: '#a6a6a6',
        width: canvas.getWidth() * 0.4,
        left: canvas.getWidth() * 0.5,
        top: canvas.getHeight() * 0.4,
      })

      const listThreeTitle = new fabric.Textbox(listThreeTitleText, {
        name: bodyTypography.name,
        fontSize: bodyTypography.fontSize,
        fontWeight: 600,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        fill: '#a6a6a6',
        width: canvas.getWidth() * 0.4,
        left: canvas.getWidth() * 0.5,
        top: canvas.getHeight() * 0.7,
      })

      const listOneDesciption = new fabric.Textbox(listOneDesciptionText, {
        name: smallTypography.name,
        fontSize: smallTypography.fontSize,
        fontWeight: smallTypography.fontWeight,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        width: canvas.getWidth() * 0.4,
        left: canvas.getWidth() * 0.5,
        top:
          listOneTitle.getBoundingRect().top +
          listOneTitle.getBoundingRect().height +
          10,
      })

      const listTwoDesciption = new fabric.Textbox(listTwoDesciptionText, {
        name: smallTypography.name,
        fontSize: smallTypography.fontSize,
        fontWeight: smallTypography.fontWeight,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        width: canvas.getWidth() * 0.4,
        left: canvas.getWidth() * 0.5,
        top:
          listTwoTitle.getBoundingRect().top +
          listTwoTitle.getBoundingRect().height +
          10,
      })

      const listThreeDesciption = new fabric.Textbox(listThreeDesciptionText, {
        name: smallTypography.name,
        fontSize: smallTypography.fontSize,
        fontWeight: smallTypography.fontWeight,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        width: canvas.getWidth() * 0.4,
        left: canvas.getWidth() * 0.5,
        top:
          listThreeTitle.getBoundingRect().top +
          listThreeTitle.getBoundingRect().height +
          10,
      })

      canvas.add(title)
      canvas.add(listOneTitle)
      canvas.add(listTwoTitle)
      canvas.add(listThreeTitle)
      canvas.add(listOneDesciption)
      canvas.add(listTwoDesciption)
      canvas.add(listThreeDesciption)

      canvas.requestRenderAll()

      canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas))

      canvas.renderAll()
      canvas.fire('object:modified')

      return canvas
    },
  },
  {
    key: 'bullete-list',
    name: 'Bullet List',
    thumbnail: '/images/frame-templates/moraa-slide/bullet-list.png',
    loadTemplate: (canvas: fabric.Canvas) => {
      canvas.clear()

      // NOTE: Add a background rect to make guides visible to center objects
      loadCenterGuideHelperRect(canvas)

      const titleText = 'Slide with bullets'
      const billetListText = 'Bullete 1 \nBullet 2 \nBullet 3'

      const title = new fabric.Textbox(titleText, {
        name: headingTypography.name,
        fontSize: headingTypography.fontSize * 1.25,
        fontWeight: 600,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        width: canvas.getWidth() * 0.4,
        left: canvas.getWidth() * 0.05,
        top: canvas.getHeight() * 0.3,
      })

      const bulletList = new fabric.BulletList(billetListText, {
        name: bodyTypography.name,
        bulletType: 'arrow',
        fontSize: bodyTypography.fontSize,
        fontWeight: bodyTypography.fontWeight,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        width: canvas.getWidth() * 0.4,
        left: canvas.getWidth() * 0.05,
        top:
          title.getBoundingRect().top +
          title.getBoundingRect().height +
          canvas.getHeight() * 0.05,
      })

      canvas.add(title)
      canvas.add(bulletList)

      canvas.requestRenderAll()

      canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas))

      canvas.renderAll()
      canvas.fire('object:modified')

      return canvas
    },
  },
  {
    key: 'two-images',
    name: 'Two Images',
    thumbnail: '/images/frame-templates/moraa-slide/two-images.png',
    loadTemplate: (canvas: fabric.Canvas) => {
      canvas.clear()

      // NOTE: Add a background rect to make guides visible to center objects
      loadCenterGuideHelperRect(canvas)

      const titleText = 'Two beautiful images'
      const imageOneUrl = 'https://picsum.photos/id/237/1200/800'
      const imageTwoUrl = 'https://picsum.photos/id/238/1200/800'
      const imageOneTitleText = 'Look at this'
      const imageTwoTitleText = 'Look at this'
      const imageOneDescriptionText =
        'This is a beautiful image of a dog which is very cute and adorable.'
      const imageTwoDescriptionText =
        'This is a beautiful image of a city with a lot of skyscrapers and buildings.'

      const title = new fabric.Textbox(titleText, {
        name: headingTypography.name,
        fontSize: headingTypography.fontSize * 1.25,
        fontWeight: 600,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        width: canvas.getWidth() * 0.8,
        left: canvas.getWidth() * 0.05,
        top: canvas.getHeight() * 0.1,
      })

      fabric.Image.fromURL(
        imageOneUrl,
        (img) => {
          img.set({
            left: canvas.getWidth() * 0.05,
            top:
              title.getBoundingRect().top +
              title.getBoundingRect().height +
              canvas.getHeight() * 0.1,
          })

          img.scaleToHeight(canvas.getHeight() * 0.4)

          canvas.add(img)

          return img
        },
        {
          crossOrigin: 'anonymous',
        }
      )

      fabric.Image.fromURL(
        imageTwoUrl,
        (img) => {
          img.set({
            left: canvas.getWidth() * 0.55,
            top:
              title.getBoundingRect().top +
              title.getBoundingRect().height +
              canvas.getHeight() * 0.1,
          })

          img.scaleToHeight(canvas.getHeight() * 0.4)

          canvas.add(img)

          return img
        },
        {
          crossOrigin: 'anonymous',
        }
      )

      const imageOneTitle = new fabric.Textbox(imageOneTitleText, {
        name: bodyTypography.name,
        fontSize: bodyTypography.fontSize,
        fontWeight: 600,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        fill: '#9b9b9b',
        width: canvas.getWidth() * 0.4,
        left: canvas.getWidth() * 0.05,
        top:
          title.getBoundingRect().top +
          title.getBoundingRect().height +
          canvas.getHeight() * 0.1 +
          canvas.getHeight() * 0.4 +
          10,
      })

      const imageTwoTitle = new fabric.Textbox(imageTwoTitleText, {
        name: bodyTypography.name,
        fontSize: bodyTypography.fontSize,
        fontWeight: 600,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        fill: '#9b9b9b',
        width: canvas.getWidth() * 0.4,
        left: canvas.getWidth() * 0.55,
        top:
          title.getBoundingRect().top +
          title.getBoundingRect().height +
          canvas.getHeight() * 0.1 +
          canvas.getHeight() * 0.4 +
          10,
      })

      const imageOneDescription = new fabric.Textbox(imageOneDescriptionText, {
        name: smallTypography.name,
        fontSize: smallTypography.fontSize,
        fontWeight: 400,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        fill: '#888888',
        width: canvas.getWidth() * 0.4,
        left: canvas.getWidth() * 0.05,
        top:
          imageOneTitle.getBoundingRect().top +
          imageOneTitle.getBoundingRect().height +
          10,
      })

      const imageTwoDescription = new fabric.Textbox(imageTwoDescriptionText, {
        name: smallTypography.name,
        fontSize: smallTypography.fontSize,
        fontWeight: 400,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        fill: '#888888',
        width: canvas.getWidth() * 0.4,
        left: canvas.getWidth() * 0.55,
        top:
          imageTwoTitle.getBoundingRect().top +
          imageTwoTitle.getBoundingRect().height +
          10,
      })

      canvas.add(title)
      canvas.add(imageOneTitle)
      canvas.add(imageTwoTitle)
      canvas.add(imageOneDescription)
      canvas.add(imageTwoDescription)

      canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas))

      canvas.renderAll()
      canvas.fire('object:modified')

      return canvas
    },
  },
  {
    key: 'three-images',
    name: 'Three Images',
    thumbnail: '/images/frame-templates/moraa-slide/three-images.png',
    loadTemplate: (canvas: fabric.Canvas) => {
      canvas.clear()

      // NOTE: Add a background rect to make guides visible to center objects
      loadCenterGuideHelperRect(canvas)

      const titleText = 'Two beautiful images'
      const imageOneUrl = 'https://picsum.photos/id/237/800'
      const imageTwoUrl = 'https://picsum.photos/id/238/800'
      const imageThreeUrl = 'https://picsum.photos/id/242/800'
      const imageOneTitleText = 'Look at this'
      const imageTwoTitleText = 'Look at this'
      const imageThreeTitleText = 'Look at this'
      const imageOneDescriptionText =
        'This is a beautiful image of a dog which is very cute and adorable.'
      const imageTwoDescriptionText =
        'This is a beautiful image of a city with a lot of skyscrapers.'
      const imageThreeDescriptionText =
        'This is a railway track in the industrial area of the city.'

      const title = new fabric.Textbox(titleText, {
        name: headingTypography.name,
        fontSize: headingTypography.fontSize * 1.25,
        fontWeight: 600,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        width: canvas.getWidth() * 0.8,
        left: canvas.getWidth() * 0.05,
        top: canvas.getHeight() * 0.1,
      })

      fabric.Image.fromURL(
        imageOneUrl,
        (img) => {
          img.set({
            left: canvas.getWidth() * 0.05,
            top:
              title.getBoundingRect().top +
              title.getBoundingRect().height +
              canvas.getHeight() * 0.1,
          })

          img.scaleToHeight(canvas.getHeight() * 0.4)

          canvas.add(img)

          return img
        },
        {
          crossOrigin: 'anonymous',
        }
      )

      fabric.Image.fromURL(
        imageTwoUrl,
        (img) => {
          img.set({
            left: canvas.getWidth() * 0.35,
            top:
              title.getBoundingRect().top +
              title.getBoundingRect().height +
              canvas.getHeight() * 0.1,
          })

          img.scaleToHeight(canvas.getHeight() * 0.4)

          canvas.add(img)

          return img
        },
        {
          crossOrigin: 'anonymous',
        }
      )

      fabric.Image.fromURL(
        imageThreeUrl,
        (img) => {
          img.set({
            left: canvas.getWidth() * 0.65,
            top:
              title.getBoundingRect().top +
              title.getBoundingRect().height +
              canvas.getHeight() * 0.1,
          })

          img.scaleToHeight(canvas.getHeight() * 0.4)

          canvas.add(img)

          return img
        },
        {
          crossOrigin: 'anonymous',
        }
      )

      const imageOneTitle = new fabric.Textbox(imageOneTitleText, {
        name: bodyTypography.name,
        fontSize: bodyTypography.fontSize,
        fontWeight: 600,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        width: canvas.getWidth() * 0.275,
        left: canvas.getWidth() * 0.05,
        top:
          title.getBoundingRect().top +
          title.getBoundingRect().height +
          canvas.getHeight() * 0.1 +
          canvas.getHeight() * 0.4 +
          10,
      })

      const imageTwoTitle = new fabric.Textbox(imageTwoTitleText, {
        name: bodyTypography.name,
        fontSize: bodyTypography.fontSize,
        fontWeight: 600,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        width: canvas.getWidth() * 0.275,
        left: canvas.getWidth() * 0.35,
        top:
          title.getBoundingRect().top +
          title.getBoundingRect().height +
          canvas.getHeight() * 0.1 +
          canvas.getHeight() * 0.4 +
          10,
      })

      const imageThreeTitle = new fabric.Textbox(imageThreeTitleText, {
        name: bodyTypography.name,
        fontSize: bodyTypography.fontSize,
        fontWeight: 600,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        width: canvas.getWidth() * 0.275,
        left: canvas.getWidth() * 0.65,
        top:
          title.getBoundingRect().top +
          title.getBoundingRect().height +
          canvas.getHeight() * 0.1 +
          canvas.getHeight() * 0.4 +
          10,
      })

      const imageOneDescription = new fabric.Textbox(imageOneDescriptionText, {
        name: smallTypography.name,
        fontSize: smallTypography.fontSize,
        fontWeight: smallTypography.fontWeight,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        width: canvas.getWidth() * 0.275,
        left: canvas.getWidth() * 0.05,
        top:
          imageOneTitle.getBoundingRect().top +
          imageOneTitle.getBoundingRect().height +
          10,
      })

      const imageTwoDescription = new fabric.Textbox(imageTwoDescriptionText, {
        name: smallTypography.name,
        fontSize: smallTypography.fontSize,
        fontWeight: smallTypography.fontWeight,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        width: canvas.getWidth() * 0.275,
        left: canvas.getWidth() * 0.35,
        top:
          imageTwoTitle.getBoundingRect().top +
          imageTwoTitle.getBoundingRect().height +
          10,
      })

      const imageThreeDescription = new fabric.Textbox(
        imageThreeDescriptionText,
        {
          name: smallTypography.name,
          fontSize: smallTypography.fontSize,
          fontWeight: smallTypography.fontWeight,
          fontFamily: DEFAULT_FONT_FAMILY,
          lineHeight: DEFAULT_LINE_HEIGHT,
          textAlign: 'left',
          width: canvas.getWidth() * 0.275,
          left: canvas.getWidth() * 0.65,
          top:
            imageThreeTitle.getBoundingRect().top +
            imageThreeTitle.getBoundingRect().height +
            10,
        }
      )

      canvas.add(title)
      canvas.add(imageOneTitle)
      canvas.add(imageTwoTitle)
      canvas.add(imageThreeTitle)
      canvas.add(imageOneDescription)
      canvas.add(imageTwoDescription)
      canvas.add(imageThreeDescription)

      canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas))

      canvas.renderAll()
      canvas.fire('object:modified')

      return canvas
    },
  },
  {
    key: 'main-images',
    name: 'Main Images',
    thumbnail: '/images/frame-templates/moraa-slide/main-image.png',
    loadTemplate: (canvas: fabric.Canvas) => {
      canvas.clear()

      // NOTE: Add a background rect to make guides visible to center objects
      loadCenterGuideHelperRect(canvas)

      const headingText = 'Main heading text'
      const subheadingText = 'Subheading text'
      const descriptionText =
        'Ramen freemium conversion incubator buyer creative supply chain gen-z crowdsource. Pitch research & development seed round disruptive analytics. Churn rate freemium business-to-consumer business model canvas MVP.'
      const mainImageUrl = 'https://picsum.photos/id/237/800/900'

      const subheading = new fabric.Textbox(subheadingText, {
        name: subheadingTypography.name,
        fontSize: subheadingTypography.fontSize,
        fontWeight: subheadingTypography.fontWeight,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        fill: '#a6a6a6',
        width: canvas.getWidth() * 0.4,
        left: canvas.getWidth() * 0.05,
        top: canvas.getHeight() * 0.1,
      })

      const heading = new fabric.Textbox(headingText, {
        name: headingTypography.name,
        fontSize: headingTypography.fontSize,
        fontWeight: 600,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        width: canvas.getWidth() * 0.4,
        left: canvas.getWidth() * 0.05,
        top:
          subheading.getBoundingRect().top +
          subheading.getBoundingRect().height +
          10,
      })

      const description = new fabric.Textbox(descriptionText, {
        name: smallTypography.name,
        fontSize: smallTypography.fontSize,
        fontWeight: smallTypography.fontWeight,
        fontFamily: DEFAULT_FONT_FAMILY,
        lineHeight: DEFAULT_LINE_HEIGHT,
        textAlign: 'left',
        width: canvas.getWidth() * 0.4,
        left: canvas.getWidth() * 0.05,
      })

      description.set({
        top: canvas.getHeight() * 0.9 - description.getBoundingRect().height,
      })

      fabric.Image.fromURL(
        mainImageUrl,
        (img) => {
          img.set({
            left: canvas.getWidth() * 0.55,
            top: canvas.getHeight() * 0.1,
          })

          img.scaleToWidth(canvas.getWidth() * 0.4)

          canvas.add(img)

          return img
        },
        {
          crossOrigin: 'anonymous',
        }
      )

      canvas.add(heading)
      canvas.add(subheading)
      canvas.add(description)

      canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas))

      canvas.renderAll()
      canvas.fire('object:modified')

      return canvas
    },
  },
]
