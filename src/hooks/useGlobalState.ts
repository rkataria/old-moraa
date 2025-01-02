import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useGlobalState<T>(key: Array<string>, defaultValue?: T) {
  const queryClient = useQueryClient()
  // eslint-disable-next-line rulesdir/invalid-query-variable-name
  const { data } = useQuery({
    queryKey: key,
    queryFn: () => defaultValue,
    enabled: defaultValue !== undefined,
    refetchOnWindowFocus: false,
    // initialData: defaultValue,
    // staleTime: Infinity,
  })
  // eslint-disable-next-line rulesdir/invalid-query-variable-name
  const mutation = useMutation({
    mutationFn: async (newData: T) => newData,
    onMutate: async (newData: T) => {
      const queryKey = key
      await queryClient.cancelQueries({ queryKey })
      // const previousData = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, () => newData)
    },
  })

  const setData = (newData: T) => {
    mutation.mutate(newData)
  }

  return [data, setData] as const
}
