import { IFrame, ISection } from '@/types/frame.type'

export type FrameStatusType = 'PUBLISHED' | 'DRAFT' | null

export const getFilteredFramesByStatus = ({
  frames,
  status,
}: {
  frames: IFrame[]
  status: FrameStatusType
}) =>
  frames.filter((frame) => {
    if (!status) return true

    return frame.status === status
  })

export const eventTypes = [
  {
    label: 'Live Workshop',
    iconUrl: '/images/workshop.png',
    key: 'workshop',

    description: 'Showcase your unique skills and insights',
  },

  {
    label: 'Blended Course',
    iconUrl: '/images/certificate.png',
    key: 'course',

    description:
      'Combine interactive online modules with dynamic face-to-face sessions',
  },
  {
    label: 'Webinar',
    iconUrl: '/images/mentor.png',
    key: 'webinar',

    description: 'Empower others by sharing your valuable knowledge and skills',
  },
]

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'success'
    case 'SCHEDULED':
      return 'warning'
    case 'PUBLISHED':
      return 'success'
    default:
      return 'default'
  }
}

export const eventTableColumns = [
  {
    key: 'name',
    label: 'NAME',
    sortable: true,
  },
  {
    key: 'full_name',
    label: 'EDUCATOR',
    sortable: true,
  },
  {
    key: 'start_date',
    label: 'STARTS ON',
    sortable: true,
  },
  {
    key: 'end_date',
    label: 'ENDS AT',
    sortable: true,
  },
  {
    key: 'status',
    label: 'STATUS',
    sortable: true,
  },
  { key: 'actions', label: 'ACTIONS' },
]

export const PatternStyles = {
  Waves: 'waves',
  'Micobial Mat': 'microbial-mat',
  Cross: 'cross',
  Plus: 'plus',
  Circle12: 'circle12',
  Zigzag: 'zigzag',
  Polka: 'polka',
}

export type PatternKeys = keyof typeof PatternStyles

export const getFirstFrame = (sections: ISection[]) =>
  sections?.find((section) => section.frames.length > 0)?.frames[0] || null
