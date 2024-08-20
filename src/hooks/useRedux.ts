import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, RootState } from '@/stores/store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useStoreDispatch = useDispatch.withTypes<AppDispatch>()
export const useStoreSelector = useSelector.withTypes<RootState>()
