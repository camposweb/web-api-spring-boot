'use client'
import { ConfirmDelete } from '@/components/uf/confirm-delete'
import { EditUf } from '@/components/uf/edit-uf'
import { SaveUf } from '@/components/uf/save-uf'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useListarUfs } from '@/http/generated/uf/uf'

export default function GetUfs() {
  /*  const { data: ufss } = useQuery({
    queryKey: ['ufs'],
    queryFn: () => listarUfs(),
  }) */

  const { data: ufs } = useListarUfs({}, { query: { queryKey: ['ufs'] } })

  return (
    <div>
      <h1 className="text-2xl text-black">Info Uf</h1>
      <SaveUf />

      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead className="w-30">Código</TableHead>
            <TableHead>Sigla</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ufs &&
            ufs.data.map((uf) => (
              <TableRow key={uf.codigoUf}>
                <TableCell className="items-center justify-center">
                  {uf.codigoUf}
                </TableCell>
                <TableCell>{uf.sigla}</TableCell>
                <TableCell>{uf.nome}</TableCell>
                <TableCell>
                  {uf.status === 1 ? (
                    <Badge className="bg-green-500 hover:bg-green-500">
                      ATIVADO
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="hover:bg-red-600">
                      DESATIVADO
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="flex justify-end gap-4 text-left">
                  <EditUf
                    codigoUf={uf.codigoUf}
                    siglaUf={uf.sigla}
                    nomeUf={uf.nome}
                    statusUf={uf.status}
                  />
                  <ConfirmDelete
                    codigo={uf.codigoUf as number}
                    nome={uf.nome as string}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}
