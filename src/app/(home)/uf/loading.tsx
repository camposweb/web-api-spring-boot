import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="flex animate-pulse flex-col space-y-2 p-4">
      <div className="">
        <Skeleton className="h-8 w-32" />
      </div>
      <div>
        <Skeleton className="h-8 w-48" />
      </div>
      <div>
        <Skeleton className="h-14 w-full" />
      </div>
      <div className="">
        <Skeleton className="h-80 w-full" />
      </div>
    </div>
  )
}
