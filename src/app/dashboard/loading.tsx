import { Card, Skeleton } from '@/design'

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-12">
        <Skeleton variant="line" className="mb-6 h-12 w-64" />

        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} variant="surface">
              <div className="space-y-4">
                <Skeleton variant="line" className="h-6 w-40" />
                <Skeleton variant="line" className="h-4 w-full" />
                <Skeleton variant="line" className="h-4 w-3/4" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
