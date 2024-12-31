import { ReactNode } from 'react'

import { Card, Skeleton } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'

import { PreviewCard } from './PreviewCard'

import { ReflectionService } from '@/services/reflection.service'

export function Responses({
  frameId,
  placeholder,
}: {
  frameId: string
  placeholder: ReactNode
}) {
  const reflectionResponseQuery = useQuery({
    queryKey: ['frame-response-reflection', frameId],
    queryFn: () => ReflectionService.getResponses(frameId),
    enabled: !!frameId,
    refetchOnWindowFocus: false,
  })
  const responses = reflectionResponseQuery?.data?.responses || []

  if (reflectionResponseQuery.isLoading) {
    return (
      <Card className="w-[200px] space-y-5 p-4" radius="lg">
        <Skeleton className="rounded-lg">
          <div className="h-24 rounded-lg bg-default-300" />
        </Skeleton>
        <div className="space-y-3">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-3 w-3/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-3 w-4/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-3 w-2/5 rounded-lg bg-default-300" />
          </Skeleton>
        </div>
      </Card>
    )
  }

  if (responses.length === 0) {
    return placeholder
  }

  return (
    <div className="mt-8">
      <p className="text-gray-600 mb-4">
        {responses.length} responses captured during live session
      </p>
      <div className="w-full grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {responses.map((frameResponse: any) => (
          <PreviewCard
            key={frameResponse.id}
            isAnonymous={frameResponse.response?.anonymous}
            username={frameResponse.response.username}
            reflection={frameResponse.response.reflection}
            reactions={frameResponse.reaction}
          />
        ))}
      </div>
    </div>
  )
}
