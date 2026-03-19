import { Skeleton } from '@/components/ui/skeleton'

export function StatsSkeleton() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} style={{ background: 'var(--bg-elevated)', borderRadius: '0.875rem', border: '1px solid var(--border)', padding: '0.75rem 1.25rem', minWidth: 80 }}>
          <Skeleton className="h-8 w-10 rounded-md" />
          <Skeleton className="mt-2 h-3 w-16 rounded-md" />
        </div>
      ))}
    </div>
  )
}

export function ReportCardSkeleton() {
  return (
    <div style={{ background: 'var(--bg-surface)', borderRadius: '1.25rem', border: '1px solid var(--border)', padding: '1.5rem' }}>
      <Skeleton className="h-4 w-32 rounded-md" />
      <Skeleton className="mt-4 h-16 w-48 rounded-md" />
      <Skeleton className="mt-2 h-3 w-56 rounded-md" />
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div style={{ padding: '1.25rem 1.5rem' }}>
      <Skeleton className="h-5 w-44 rounded-md" />
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="mt-3 h-10 w-full rounded-md" />
      ))}
    </div>
  )
}
