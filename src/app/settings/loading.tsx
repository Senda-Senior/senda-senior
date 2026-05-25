import { Card, Skeleton } from '@/design'

export default function SettingsLoading() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-12">
        <Skeleton variant="line" className="mb-6 h-12 w-48" />

        <div className="grid gap-8 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} variant="surface">
              <div className="space-y-6">
                <Skeleton variant="line" className="h-8 w-32" />
                <Skeleton variant="line" className="h-4 w-full" />
                <div className="space-y-3">
                  <Skeleton variant="line" className="h-5 w-40" />
                  <Skeleton variant="line" className="h-5 w-48" />
                  <Skeleton variant="line" className="h-5 w-36" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Skeleton variant="line" className="h-11 w-40" />
        </div>
      </div>
    </div>
  )
}
