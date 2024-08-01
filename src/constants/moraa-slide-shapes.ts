import { SHAPE_TYPES } from '@/components/common/content-types/MoraaSlide/ShapePicker/ShapePickerContent'

export const MORAA_SLIDE_SHAPES: {
  [key in SHAPE_TYPES]: { label: string; svg: string }[]
} = {
  Basic: [
    {
      label: 'Rectangle',
      svg: '<svg width="45px" xmlns="http://www.w3.org/2000/svg" fill="currentColor" version="2.0" viewBox="0 0 112.5 112.5" height="45px" style="overflow: visible; stroke-width: 0;"><rect rx="0px" width="112.50" height="112.50"></rect></svg>',
    },
    {
      label: 'Rectangle Rounded',
      svg: '<svg width="45px" xmlns="http://www.w3.org/2000/svg" fill="currentColor" version="2.0" viewBox="0 0 112.5 112.5" height="45px" style="overflow: visible; stroke-width: 0;"><rect rx="14.0625px" width="112.50" height="112.50"></rect></svg>',
    },
    {
      label: 'Circle',
      svg: '<svg width="45px" xmlns="http://www.w3.org/2000/svg" fill="currentColor" version="2.0" viewBox="0 0 112.5 112.5" height="45px" style="overflow: visible; stroke-width: 0;"><circle cx="56.25" cy="56.25" r="56.25"></circle></svg>',
    },
    {
      label: 'Triangle',
      svg: '<svg width="45px" xmlns="http://www.w3.org/2000/svg" fill="currentColor" version="2.0" viewBox="0 0 112.5 112.5" height="45px" style="overflow: visible; stroke-width: 0;"><polygon points="56.25 0 112.5 112.5 0 112.5"></polygon></svg>',
    },
    {
      label: 'Diamond',
      svg: '<svg width="45px" xmlns="http://www.w3.org/2000/svg" fill="currentColor" version="2.0" viewBox="0 0 112.5 112.5" height="45px" style="overflow: visible; stroke-width: 0;"><polygon points="56.25 0 112.5 56.25 56.25 112.5 0 56.25"></polygon></svg>',
    },
  ],
  Arrows: [],
  Banners: [],
  Callouts: [],
  'Stars & Bubbles': [],
  'Lines & Dividers': [],
  Clipart: [],
}
