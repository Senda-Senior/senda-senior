import { Card, Skeleton } from '@/design'

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-12">
        <Skeleton variant="line" className="mb-6 h-12 w-48" />

        <Card variant="surface">
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton variant="line" className="h-8 w-40" />
              <Skeleton variant="line" className="h-4 w-96" />
            </div>

            <div className="space-y-3">
              <Skeleton variant="line" className="h-5 w-32" />
              <Skeleton variant="line" className="h-5 w-40" />
              <Skeleton variant="line" className="h-5 w-36" />
            </div>

            <Skeleton variant="line" className="h-11 w-40" />
          </div>
        </Card>
      </div>
    </div>
  )
}
