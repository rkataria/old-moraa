import { createFileRoute } from '@tanstack/react-router'

import { Sample } from '@/components/common/content-types/TestViewPdf'

export const Route = createFileRoute('/test/')({
  component: () => <TestPage />,
})

export function TestPage() {
  return <Sample />
}
