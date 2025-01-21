import { UserPreferences } from '@/types/common'

export const DEFAULT_PAGE_SIZE = 10
export const TITLE_CHARACTER_LIMIT = 300
export const DEFAULT_COLORS = [
  '#FF6900',
  '#FCB900',
  '#7BDCB5',
  '#00D084',
  '#8ED1FC',
  '#0693E3',
  '#EB144C',
  '#F78DA7',
  '#9900EF',
]
export const IMAGE_PLACEHOLDER = '/images/image-placeholder.png'
export const USER_PREFERENCES_LOCAL_STORAGE_KEY = 'moraa-user-preferences'
export const INITIAL_USER_PREFERENCES: UserPreferences = {
  meeting: {
    video: true,
    audio: true,
  },
}
