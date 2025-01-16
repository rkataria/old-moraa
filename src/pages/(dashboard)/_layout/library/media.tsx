import { createFileRoute } from '@tanstack/react-router'

import { MediaLibrary } from '@/components/common/Library/MediaLibrary'

export const Route = createFileRoute('/(dashboard)/_layout/library/media')({
  component: Page,
})

function Page() {
  return (
    <div>
      <p className="text-2xl font-medium text-black/80">Media</p>
      <MediaLibrary />
    </div>
  )
}
