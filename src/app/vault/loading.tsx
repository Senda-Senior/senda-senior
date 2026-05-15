import { Card, Skeleton } from '@/design'

export default function VaultLoading() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-12">
        <Skeleton variant="line" className="mb-8 h-12 w-48" />

        <div className="mb-8 space-y-4">
          <Skeleton variant="line" className="h-6 w-32" />
          <Skeleton variant="line" className="h-10 w-full" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} variant="muted">
              <div className="flex items-center gap-4">
                <Skeleton variant="circle" className="h-12 w-12 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="line" className="h-5 w-40" />
                  <Skeleton variant="line" className="h-4 w-24" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
