import { createAsyncThunk } from '@reduxjs/toolkit'

import { EventService } from '@/services/event.service'
import { EventModel } from '@/types/models'

export const getEventThunk = createAsyncThunk<EventModel, string>(
  'event/getEvent',
  async (eventId: string) => {
    console.log('getEvent')

    const response = await EventService.getEvent({ eventId })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.event as any
  }
)
