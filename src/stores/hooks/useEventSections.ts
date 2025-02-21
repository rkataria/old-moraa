/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from 'react-redux'

import { RootState } from '../store'

import { FrameModel, SectionModel } from '@/types/models'
import { FrameType } from '@/utils/frame-picker.util'

type PopulatedSectionSelector = Array<
  Omit<SectionModel, 'frames'> & {
    frames: Array<FrameModel>
  }
>

export const useEventSelector = () => {
  const sections = useSelector<RootState, PopulatedSectionSelector>((state) =>
    state.event.currentEvent.meetingState.meeting.isSuccess &&
    state.event.currentEvent.sectionState.section.isSuccess &&
    state.event.currentEvent.frameState.frame.isSuccess
      ? state.event.currentEvent.meetingState.meeting.data?.sections
          ?.map((sectionId) => {
            const section =
              state.event.currentEvent.sectionState.section.data!.find(
                (sec) => sectionId === sec.id
              ) as SectionModel

            const frames = section?.frames
              ?.map(
                (frameId) =>
                  state.event.currentEvent.frameState.frame.data!.find(
                    (frame) => frame.id === frameId
                  ) as FrameModel
              )
              .filter(Boolean) as Array<FrameModel>

            return {
              ...section,
              frames: orderFramesByParent(frames),
            }
          })
          .filter(Boolean) || []
      : []
  )

  return {
    sections: sections?.filter((s) => s.id), // Adding this logic to filter recently deleted section
  }
}

const orderFramesByParent = (frames: Array<FrameModel>) => {
  const orderedFrames: Array<FrameModel> = []

  frames?.forEach((frame: any) => {
    if (frame.type === FrameType.BREAKOUT || frame.content?.breakoutFrameId) {
      // Order activity frames based on breakout frame
      if (frame.type === FrameType.BREAKOUT) {
        orderedFrames.push(frame)
      }
    } else {
      orderedFrames.push(frame)
    }
  })

  return orderedFrames
}

export const useEventLoadingSelector = () =>
  useSelector<RootState, boolean>(
    (state) =>
      state.event.currentEvent.meetingState.meeting.isLoading ||
      state.event.currentEvent.sectionState.section.isLoading ||
      state.event.currentEvent.frameState.frame.isLoading
  )
