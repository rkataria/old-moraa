import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

export const uploadPDFFile = (fileName: string, file: File) =>
  supabase.storage
    .from('pdf-uploads')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })
    .then((res) => {
      if (res.error) throw res.error

      return res
    })

export const downloadPDFFile = (fileName: string) =>
  supabase.storage
    .from('pdf-uploads')
    .download(fileName)
    .then((res) => {
      if (res.error) throw res.error

      return res
    })

export const deletePDFFile = (fileName: string) =>
  supabase.storage.from('pdf-uploads').remove([fileName])
