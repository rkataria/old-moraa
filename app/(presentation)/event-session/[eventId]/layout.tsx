import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

export default async function MeetingLayout({ children, params }: any) {
  return <div className="bg-gray-100 h-screen pt-16">{children}</div>
}
