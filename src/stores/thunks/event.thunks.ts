import { createAsyncThunk } from '@reduxjs/toolkit'

import { EventService } from '@/services/event.service'
import { EventModel } from '@/types/models'

export const getEventThunk = createAsyncThunk<EventModel, string>(
  'event/getEvent',
  async (eventId: string) => {
    const response = await EventService.getEvent({ eventId })

    return response.event
  }
)
