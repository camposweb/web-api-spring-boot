import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="flex flex-col space-y-2">
      <div className="animate-pulse">
        <Skeleton className="h-8 w-32" />
      </div>
      <div>
        <Skeleton className="h-8 w-32" />
      </div>
      <div>
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="flex w-full flex-row space-x-9">
        <Skeleton className="h-8 w-7" />

        <Skeleton className="h-8 w-12" />

        <Skeleton className="h-8 w-40" />
      </div>
    </div>
  )
}
