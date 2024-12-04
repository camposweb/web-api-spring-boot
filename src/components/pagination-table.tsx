import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { Button } from './ui/button'
import { Pagination, PaginationContent, PaginationItem } from './ui/pagination'

interface PaginationTable {
  totalPages: number
  currentPage: number
  onPageChange: (pageIndex: number) => Promise<void> | void
  totalItems: number
}

export function PaginationTable({
  totalPages,
  currentPage,
  onPageChange,
  totalItems,
}: PaginationTable) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-black">Total de {totalItems} item(s)</span>

      <div className="flex items-center gap-6">
        <div>
          <span className="text-sm text-black">
            Página {currentPage} de {totalPages}
          </span>
        </div>
        <div className="flex items-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  onClick={() => onPageChange(1)}
                  variant="outline"
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                  <span className="sr-only">Primeira página</span>
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  onClick={() => onPageChange(currentPage - 1)}
                  variant="outline"
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Retornar uma página</span>
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  onClick={() => onPageChange(currentPage + 1)}
                  variant="outline"
                  disabled={totalPages <= currentPage}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Avançar uma página</span>
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  onClick={() => onPageChange(totalPages)}
                  variant="outline"
                  disabled={totalPages <= currentPage}
                >
                  <ChevronsRight className="h-4 w-4" />
                  <span className="sr-only">Última página</span>
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}
