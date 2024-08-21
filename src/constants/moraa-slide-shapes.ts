import { SHAPE_TYPES } from '@/components/common/content-types/MoraaSlide/ShapePicker/ShapePickerContent'

export const MORAA_SLIDE_SHAPES: {
  [key in SHAPE_TYPES]: { label: string; svg: string }[]
} = {
  Basic: [
    {
      label: 'Rectangle',
      svg: '<svg width="45px" xmlns="http://www.w3.org/2000/svg" fill="#2E1E4A" version="2.0" viewBox="0 0 112.5 112.5" height="45px" style="overflow: visible; stroke-width: 0;"><rect rx="0px" width="112.50" height="112.50"></rect></svg>',
    },
    {
      label: 'Rectangle Rounded',
      svg: '<svg width="45px" xmlns="http://www.w3.org/2000/svg" fill="#2E1E4A" version="2.0" viewBox="0 0 112.5 112.5" height="45px" style="overflow: visible; stroke-width: 0;"><rect rx="14.0625px" width="112.50" height="112.50"></rect></svg>',
    },
    {
      label: 'Circle',
      svg: '<svg width="45px" xmlns="http://www.w3.org/2000/svg" fill="#2E1E4A" version="2.0" viewBox="0 0 112.5 112.5" height="45px" style="overflow: visible; stroke-width: 0;"><circle cx="56.25" cy="56.25" r="56.25"></circle></svg>',
    },
    {
      label: 'Triangle',
      svg: '<svg width="45px" xmlns="http://www.w3.org/2000/svg" fill="#2E1E4A" version="2.0" viewBox="0 0 112.5 112.5" height="45px" style="overflow: visible; stroke-width: 0;"><polygon points="56.25 0 112.5 112.5 0 112.5"></polygon></svg>',
    },
    {
      label: 'Diamond',
      svg: '<svg width="45px" xmlns="http://www.w3.org/2000/svg" fill="#2E1E4A" version="2.0" viewBox="0 0 112.5 112.5" height="45px" style="overflow: visible; stroke-width: 0;"><polygon points="56.25 0 112.5 56.25 56.25 112.5 0 56.25"></polygon></svg>',
    },
    {
      label: 'Star',
      svg: '<svg width="48px" xmlns="http://www.w3.org/2000/svg" fill="#2E1E4A" class="shape-block-svg" id="c8ed2913-cf09-475b-a433-a309e913f519" version="2.0" viewBox="0 0 120 120" height="48px" style="overflow: visible; stroke-width: 0;"><polygon points="119.8572, 44.3180 92.9214, 75.0383 96.9938, 116.0259 60.0000, 99.4132 23.0062, 116.0259 27.0786, 75.0383 0.1428, 44.3180 39.6534, 35.5990 60.0000, 0.0000 80.3466, 35.5990"></polygon></svg>',
    },
    {
      label: 'Rectangle Outlined',
      svg: '<svg width="45px" xmlns="http://www.w3.org/2000/svg" class="shape-block-svg" id="cf3645c9-68a2-4e6e-bff5-7f36d6955fda" version="2.0" viewBox="0 0 112.5 112.5" height="45px" style="overflow: visible; fill: rgba(0, 0, 0, 0); stroke-width: 8; transform: translateZ(0px); stroke: rgba(46, 30, 74, 1)"><defs><clipPath id="99603edc-88a4-4545-bf84-1fb118d00228"><rect data-test-id="svg-rectangle" rx="0px" width="112.50" height="112.50"></rect></clipPath></defs><g clip-path="url(#99603edc-88a4-4545-bf84-1fb118d00228)"><rect data-test-id="svg-rectangle" rx="0px" width="112.50" height="112.50"></rect></g></svg>',
    },
    {
      label: 'Rectangle Rounded Outlined',
      svg: '<svg width="45px" xmlns="http://www.w3.org/2000/svg" class="shape-block-svg" id="deb71b3c-3835-46f1-a242-1da582ac1667" version="2.0" viewBox="0 0 112.5 112.5" height="45px" style="overflow: visible; fill: rgba(0, 0, 0, 0); stroke-width: 8; transform: translateZ(0px); stroke: rgba(46, 30, 74, 1)"><defs><clipPath id="d5d7a34d-7890-41cd-b317-70777c002d13"><rect data-test-id="svg-rectangle" rx="14.0625px" width="112.50" height="112.50"></rect></clipPath></defs><g clip-path="url(#d5d7a34d-7890-41cd-b317-70777c002d13)"><rect data-test-id="svg-rectangle" rx="14.0625px" width="112.50" height="112.50"></rect></g></svg>',
    },
    {
      label: 'Circle Outlined',
      svg: '<svg width="51px" xmlns="http://www.w3.org/2000/svg" class="shape-block-svg" id="78a281a8-4d14-49a3-a9d3-7bb9c35a4cd3" version="2.0" viewBox="0 0 127.5 127.5" height="51px" style="overflow: visible; fill: rgba(0, 0, 0, 0); stroke-width: 8; transform: translateZ(0px); stroke: rgba(46, 30, 74, 1)"><defs><clipPath id="3d6c6a74-b4d7-429e-89bc-0d304de0bf44"><ellipse cx="63.75" cy="63.75" rx="63.75" ry="63.75"></ellipse></clipPath></defs><g clip-path="url(#3d6c6a74-b4d7-429e-89bc-0d304de0bf44)"><ellipse cx="63.75" cy="63.75" rx="63.75" ry="63.75"></ellipse></g></svg>',
    },
    {
      label: 'Triangle Outlined',
      svg: '<svg width="52px" xmlns="http://www.w3.org/2000/svg" class="shape-block-svg" id="4aad5d59-e064-4a0a-9699-ad165f35264f" version="2.0" viewBox="0 0 130 112.5" height="45px" style="overflow: visible; fill: rgba(0, 0, 0, 0); stroke-width: 8; transform: translateZ(0px); stroke: rgba(46, 30, 74, 1)"><defs><clipPath id="c7ecc81e-9fef-42af-a605-122a01461dbc"><polygon points="65.0000, 0.0000 0.0000, 112.5000 130.0000, 112.5000"></polygon></clipPath></defs><g clip-path="url(#c7ecc81e-9fef-42af-a605-122a01461dbc)"><polygon points="65.0000, 0.0000 0.0000, 112.5000 130.0000, 112.5000"></polygon></g></svg>',
    },
    {
      label: 'Diamond Outlined',
      svg: '<svg width="51px" xmlns="http://www.w3.org/2000/svg" class="shape-block-svg" id="881a6d0f-0143-4001-9c67-29288b1d3f0c" version="2.0" viewBox="0 0 127.5 127.5" height="51px" style="overflow: visible; fill: rgba(0, 0, 0, 0); stroke-width: 8; transform: translateZ(0px); stroke: rgba(46, 30, 74, 1)"><defs><clipPath id="5870aac5-68af-44ac-add4-3e37959c58cb"><polygon points="63.7500, 0.0000 0.0000, 63.7500 63.7500, 127.5000 127.5000, 63.7500"></polygon></clipPath></defs><g clip-path="url(#5870aac5-68af-44ac-add4-3e37959c58cb)"><polygon points="63.7500, 0.0000 0.0000, 63.7500 63.7500, 127.5000 127.5000, 63.7500"></polygon></g></svg>',
    },
    {
      label: 'Star Outlined',
      svg: '<svg width="45px" xmlns="http://www.w3.org/2000/svg" class="shape-block-svg" id="b9748192-6b06-46d0-b13b-f36beda5c9a4" version="2.0" viewBox="0 0 112.5 112.5" height="45px" style="overflow: visible; fill: rgba(0, 0, 0, 0); stroke-width: 8; transform: translateZ(0px); stroke: rgba(46, 30, 74, 1)"><defs><clipPath id="2a3f711b-4e3a-4d98-b771-6ee72e015613"><polygon points="112.3661, 41.5481 87.1139, 70.3484 90.9317, 108.7743 56.2500, 93.1999 21.5683, 108.7743 25.3861, 70.3484 0.1339, 41.5481 37.1751, 33.3740 56.2500, 0.0000 75.3249, 33.3740"></polygon></clipPath></defs><g clip-path="url(#2a3f711b-4e3a-4d98-b771-6ee72e015613)"><polygon points="112.3661, 41.5481 87.1139, 70.3484 90.9317, 108.7743 56.2500, 93.1999 21.5683, 108.7743 25.3861, 70.3484 0.1339, 41.5481 37.1751, 33.3740 56.2500, 0.0000 75.3249, 33.3740"></polygon></g></svg>',
    },
  ],
  Lines: [
    {
      label: 'Line 1',
      svg: '<svg width="50px" xmlns="http://www.w3.org/2000/svg" class="shape-block-svg" version="2.0" viewBox="0 0 125 5" height="2px" style="overflow: visible;"><g><g><rect fill="transparent" stroke-width="0" x="0" y="-7.5" height="20" width="125"></rect><line x2="125" y1="2.5" y2="2.5" clip-path="url(#80f7e41b-541a-418f-bac0-b512ca303058)" style="stroke-width: 5;stroke: #2E1E4A"></line><line x2="125" y1="2.5" y2="2.5" stroke="transparent" marker-start="url(#1baa3230-5b62-4651-b1f7-60bfc91c8c56)" marker-end="url(#92a69e3c-694f-4f1d-9d7b-3a087e2547c4)" style="stroke-width: 5;stroke: #2E1E4A;"></line></g></g></svg>',
    },
  ],
  Banners: [],
  Callouts: [],
  'Stars & Bubbles': [],
  'Lines & Dividers': [],
  Clipart: [],
}
