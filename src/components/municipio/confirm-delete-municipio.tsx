import { Trash2 } from 'lucide-react'
import { ConfirmDeleteProps } from '../types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { deletarMunicipio } from '@/http/generated/municipio/municipio'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function ConfirmDeleteMunicipio({ codigo, nome }: ConfirmDeleteProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: deletarMunicipioFn } = useMutation({
    mutationFn: deletarMunicipio,
    async onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['municipios'],
      })
    },
  })
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button title="Deletar Uf" variant="destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza que deseja deletar {nome}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não tem volta
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deletarMunicipioFn({ codigoMunicipio: codigo })
            }}
            className="bg-red-600 hover:bg-red-600/80"
          >
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
