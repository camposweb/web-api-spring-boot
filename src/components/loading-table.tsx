import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function LoadingTable() {
  return (
    <div className="overflow-hidden rounded-md border border-gray-300">
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-black">
              <Skeleton className="h-4 w-24 animate-pulse" />
            </TableHead>
            <TableHead className="font-bold text-black">
              <Skeleton className="h-4 w-20 animate-pulse" />
            </TableHead>
            <TableHead className="font-bold text-black">
              <Skeleton className="h-4 w-32 animate-pulse" />
            </TableHead>
            <TableHead className="font-bold text-black">
              <Skeleton className="h-4 w-16 animate-pulse" />
            </TableHead>
            <TableHead className="font-bold text-black">
              <Skeleton className="h-4 w-28 animate-pulse" />
            </TableHead>
            <TableHead className="font-bold text-black">
              <Skeleton className="h-4 w-20 animate-pulse" />
            </TableHead>
            <TableHead className="font-bold text-black">
              <Skeleton className="h-4 w-16 animate-pulse" />
            </TableHead>
            <TableHead className="text-right font-bold text-black">
              <Skeleton className="h-4 w-24 animate-pulse" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: 8 }).map((_, colIndex) => (
                <TableCell
                  key={colIndex}
                  className="items-center justify-center"
                >
                  <Skeleton className="h-4 w-full animate-pulse" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
