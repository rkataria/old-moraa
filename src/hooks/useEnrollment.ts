import { useStoreSelector } from './useRedux'

export const useEnrollment = () => {
  const enrollmentQuery = useStoreSelector(
    (store) => store.event.currentEvent.liveSessionState.enrollment
  )

  return {
    enrollment: enrollmentQuery.data,
    isSuccess: enrollmentQuery.isSuccess,
    isLoading: enrollmentQuery.isLoading,
    error: enrollmentQuery.error,
    isError: enrollmentQuery.isError,
  }
}
