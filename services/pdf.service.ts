import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const supabase = createClientComponentClient()

export const uploadPDFFile = (fileName: string, file: File) => {
  return supabase.storage.from("pdf-uploads").upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  })
}

export const downloadPDFFile = (fileName: string) => {
  return supabase.storage.from("pdf-uploads").download(fileName)
}

export const deletePDFFile = (fileName: string) => {
  return supabase.storage.from("pdf-uploads").remove([fileName])
}
