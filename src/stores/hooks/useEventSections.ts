import { useSelector } from 'react-redux'

import { RootState } from '../store'

import { FrameModel, SectionModel } from '@/types/models'

type PopulatedSectionSelector = Array<
  Omit<SectionModel, 'frames'> & {
    frames: Array<FrameModel>
  }
>

export const useEventSelector = () =>
  useSelector<RootState, PopulatedSectionSelector>((state) =>
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
              frames,
            }
          })
          .filter(Boolean) || []
      : []
  )

export const useEventLoadingSelector = () =>
  useSelector<RootState, boolean>(
    (state) =>
      state.event.currentEvent.meetingState.meeting.isLoading ||
      state.event.currentEvent.sectionState.section.isLoading ||
      state.event.currentEvent.frameState.frame.isLoading
  )
