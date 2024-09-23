/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'

export class FileConvertService {
  static importPowerpoint({
    file,
    sectionId,
    meetingId,
    uploaderFrameId,
    outputType = 'png',
  }: {
    file: File
    sectionId: string
    meetingId: string
    uploaderFrameId: string
    outputType?: 'png' | 'svg'
  }) {
    // TODO: This needs to be fixed
    const query = axios
      .create({
        baseURL: import.meta.env.VITE_BACKEND_URL,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .post(outputType === 'png' ? '/convert/ppt-png' : '/convert/ppt-svg', {
        file,
        sectionId,
        meetingId,
        uploaderFrameId,
      })

    return query.then(
      (res: any) => res,
      (error: any) => {
        throw error
      }
    )
  }
}
