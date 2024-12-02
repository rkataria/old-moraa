import { useLocalStorage } from '@uidotdev/usehooks'

import {
  INITIAL_USER_PREFERENCES,
  USER_PREFERENCES_LOCAL_STORAGE_KEY,
} from '@/constants/common'
import { UserPreferences } from '@/types/common'

export function useUserPreferences() {
  const [userPreferences, setUserPreferences] =
    useLocalStorage<UserPreferences>(
      USER_PREFERENCES_LOCAL_STORAGE_KEY,
      INITIAL_USER_PREFERENCES
    )

  const userPreferencesMeetingVideo = (value: boolean) => {
    setUserPreferences((prev) => ({
      ...prev,
      meeting: { ...(prev?.meeting || {}), video: value },
    }))
  }

  const userPreferencesMeetingAudio = (value: boolean) => {
    setUserPreferences((prev) => ({
      ...prev,
      meeting: { ...(prev?.meeting || {}), audio: value },
    }))
  }

  const userPreferencesPdf = (payload: {
    frameId: string
    data: {
      position?: number
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      config?: any
    }
  }) => {
    setUserPreferences((prev) => {
      const previousPdfPreferences = prev?.pdf || {}

      const currentFramePreferences =
        previousPdfPreferences[payload.frameId] || {}

      const updatedFramePreferences = {
        position: payload.data.position ?? currentFramePreferences.position,
        config: payload.data.config ?? currentFramePreferences.config,
      }

      return {
        ...prev,
        pdf: {
          ...previousPdfPreferences,
          [payload.frameId]: updatedFramePreferences,
        },
      }
    })
  }

  return {
    userPreferences,
    setUserPreferences,
    userPreferencesMeetingVideo,
    userPreferencesMeetingAudio,
    userPreferencesPdf,
  }
}
