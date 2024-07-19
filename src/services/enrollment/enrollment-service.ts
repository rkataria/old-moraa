/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetEnrollmentsType } from './types'
import { APIService } from '../api-service'

export class EnrollmentService extends APIService {
  static getEnrollments({ eventId, userId }: GetEnrollmentsType = {}) {
    let query = APIService.supabaseClient
      .from('enrollment')
      .select('*')
      .order('created_at', { ascending: true })

    if (eventId) query = query.eq('event_id', eventId)
    if (userId) query = query.eq('user_id', userId)

    return query.then(
      (res: any) => res,
      (error: any) => {
        throw error
      }
    )
  }
}
