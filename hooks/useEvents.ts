import { useEffect, useState } from "react"
import { useAuth } from "./useAuth"
import { createClient } from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { EventService } from "@/services/event.service"

export const useEvents = () => {
  const { currentUser } = useAuth()

  const { data, error, isFetching, isLoading, isError } = useQuery({
    queryKey: ["events"],
    queryFn: EventService.getEvents,
    enabled: !!currentUser?.id,
  })

  return {
    events: data,
    isLoading: isLoading,
    isFetching: isFetching,
    error,
    isError,
  }
}
