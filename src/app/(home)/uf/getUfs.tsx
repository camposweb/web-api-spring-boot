'use client'
import { ConfirmDelete } from '@/components/confirm-delete'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useListarUfs } from '@/http/generated/uf/uf'
import { Pencil } from 'lucide-react'

export default function GetUfs() {
  const { data: ufs } = useListarUfs()

  return (
    <div>
      <h1 className="text-2xl text-black">Info Uf</h1>

      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead className="w-30">Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ufs?.data.map((uf) => (
            <TableRow key={uf.codigoUf}>
              <TableCell className="items-center justify-center">
                {uf.codigoUf}
              </TableCell>
              <TableCell>{uf.nome}</TableCell>
              <TableCell>{uf.status}</TableCell>
              <TableCell className="flex justify-end gap-4 text-left">
                <Button title="Editar">
                  <Pencil className="h-4 w-4" />
                </Button>
                <ConfirmDelete codigoUf={uf.codigoUf} nome={uf.nome} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
