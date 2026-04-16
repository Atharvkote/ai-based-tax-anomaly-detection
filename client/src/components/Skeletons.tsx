import { Skeleton } from '@/components/ui/skeleton'

export function StatsSkeleton() {
  return (
    <div className="flex gap-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="bg-secondary rounded-[14px] border border-border px-5 py-3 min-w-[80px] flex flex-col items-center">
          <Skeleton className="h-8 w-10 bg-border/50" />
          <Skeleton className="mt-2 h-3 w-14 bg-border/50" />
        </div>
      ))}
    </div>
  )
}

export function ReportCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <Skeleton className="h-4 w-32 bg-border/50" />
      <Skeleton className="mt-4 h-16 w-3/4 bg-border/50" />
      <Skeleton className="mt-4 h-4 w-full bg-border/50" />
      <Skeleton className="mt-2 h-4 w-5/6 bg-border/50" />
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-6 w-48 bg-border/50 mb-6" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
           {Array.from({ length: 8 }).map((_, j) => (
              <Skeleton key={j} className={`h-10 bg-border/50 flex-1 ${j === 0 ? 'max-w-[40px]' : ''}`} />
           ))}
        </div>
      ))}
    </div>
  )
}
