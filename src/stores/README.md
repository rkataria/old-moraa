## Redux Toolkit Example: Todo Application

This example demonstrates how to manage state and side effects in a Todo application using Redux Toolkit, including how to handle asynchronous thunks, local storage integration, and middleware for side effects.

### 1. Setting Up Thunks

**Thunks** are functions that handle asynchronous operations. In this example, we have two thunks:

- **`getTodosThunk`**: Fetches a list of todos from a simulated API.
- **`createTodoThunk`**: Simulates creating a new todo.

```javascript
const getTodosThunk = createAsyncThunk('todos/getTodos', async () => {
  const response = await new Promise<Array<string>>((resolve) => {
    setTimeout(() => resolve(['Buy groceries', 'Walk the dog']), 1000)
  })
  return response
})

const createTodoThunk = createAsyncThunk('todos/createTodo', async (newTodo: string) => {
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000))
  return newTodo
})
```

### 2. Some important utility function before moving ahead

#### buildThunkState

**`buildThunkState`** simplifies the management of the different states of a thunk (pending, fulfilled, rejected). Without `buildThunkState`, you'd need to manually handle and update the state for each thunk, leading to repetitive code. This function helps reduce that repetition by providing a standardized structure.

```javascript
export type ThunkState<T, E = any> = {
  data: T | null
  error: E | null
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
}

export const buildThunkState = <T, E = any>(
  initialData?: T
): ThunkState<T, E> => ({
  data: initialData || null,
  error: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
})
```

#### attachThunkToBuilder

**`attachThunkToBuilder`** is used to handle thunk state changes within the slice's `extraReducers`. It abstracts away the repetitive code for managing thunk states, making your slice definitions cleaner. Without this function, you'd need to manually write the state handling logic for each thunk in every slice.

```javascript
type AttachThunkToBuilder<State, ThunkFunction> = {
  builder: ActionReducerMapBuilder<State>
  thunk: ThunkFunction
  getThunkState: (state: Draft<State>) => Draft<ThunkState<any>>
}

export const attachThunkToBuilder = <
  State,
  ThunkFunction extends AsyncThunk<any, any, any>,
>({
  builder,
  thunk,
  getThunkState,
}: AttachThunkToBuilder<State, ThunkFunction>) => {
  builder
    .addCase(thunk.pending, (state) => {
      getThunkState(state).isLoading = true
      getThunkState(state).isError = false
      getThunkState(state).isSuccess = false
      getThunkState(state).error = null
      getThunkState(state).data = null
    })
    .addCase(thunk.fulfilled, (state, action) => {
      getThunkState(state).isLoading = false
      getThunkState(state).isError = false
      getThunkState(state).isSuccess = true
      getThunkState(state).error = null
      getThunkState(state).data = action.payload
    })
    .addCase(thunk.rejected, (state, action) => {
      getThunkState(state).isLoading = false
      getThunkState(state).isError = true
      getThunkState(state).isSuccess = false
      getThunkState(state).error = action.error
      getThunkState(state).data = null
    })

  return builder
}
```

#### attachOnStoreInitListener

**`attachOnStoreInitListener`** sets up a listener that executes a given effect when the store is initialized. This is useful for initializing state from local storage.

```javascript
const initializeStoreAction = createAction('store/initialize')

export const attachOnStoreInitListener = (
  effect: ListenerEffect<UnknownAction, RootState, AppDispatch>
) =>
  attachStoreListener({
    actionCreator: initializeStoreAction,
    effect,
  })
```

#### attachStoreListener

**`attachStoreListener`** is used to handle side effects when specific actions are dispatched. In this case, it updates local storage whenever a new todo is created.

```javascript
export const listenerMiddleware = createListenerMiddleware()

type AppStartListening = TypedStartListening<RootState, AppDispatch>
type AppStopListening = TypedStopListening<RootState, AppDispatch>

export const attachStoreListener = listenerMiddleware.startListening as AppStartListening
export const detachStoreListener = listenerMiddleware.stopListening as AppStopListening
```

### 3. Defining the Redux Slice

The **Redux slice** for the Todo application manages the state for todos and the new todo input. It handles the actions for setting and resetting the new todo, and integrates the thunks using `attachThunkToBuilder`.

```javascript
type TodoState = {
  todos: ThunkState<Array<string>>
  newTodo: string
}

const initialState: TodoState = {
  todos: buildThunkState<Array<string>>([]),
  newTodo: '',
}

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    setNewTodo: (state, action) => {
      state.newTodo = action.payload
    },
    resetNewTodo: (state) => {
      state.newTodo = ''
    },
  },
  extraReducers: (builder) => {
    attachThunkToBuilder({
      builder,
      thunk: getTodosThunk,
      getThunkState: (state) => state.todos,
    })
    attachThunkToBuilder({
      builder,
      thunk: createTodoThunk,
      getThunkState: (state) => state.todos,
    })
  },
})

attachOnStoreInitListener(async (_, { dispatch }) => {
  const localStorageNewTodo = localStorage.getItem('newTodo')
  if (localStorageNewTodo !== null) {
    dispatch(setNewTodo(localStorageNewTodo))
  }
})

attachStoreListener({
  actionCreator: todoSlice.actions.setNewTodo,
  effect: (action) => {
    localStorage.setItem('newTodo', action.payload)
  },
})

const { setNewTodo, resetNewTodo } = todoSlice.actions
const todoReducer = todoSlice.reducer
```

### Conclusion

This example showcases how to manage a todo application's state and side effects using Redux Toolkit. By leveraging utility functions and middleware, you can handle asynchronous actions and side effects in a clean, maintainable way.
