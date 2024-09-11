/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'

export class FileConvertService {
  static importPowerpoint({
    file,
    sectionId,
    meetingId,
  }: {
    file: File
    sectionId: string
    meetingId: string
  }) {
    // TODO: This needs to be fixed
    const query = axios
      .create({
        baseURL: import.meta.env.VITE_BACKEND_URL,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .post('/file/convert', {
        file,
        sectionId,
        meetingId,
      })

    return query.then(
      (res: any) => res,
      (error: any) => {
        throw error
      }
    )
  }
}
