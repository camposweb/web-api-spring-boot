import { useToast } from '@/hooks/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { Trash2 } from 'lucide-react'
import { deletarPessoa } from '@/http/generated/pessoa/pessoa'

export function ConfirmDeletePessoa({ codigo, nome }: ConfirmDeleteProps) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutateAsync: deletarPessoaFn } = useMutation({
    mutationFn: deletarPessoa,
    async onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['pessoas'],
      })
      toast({
        description: (
          <div>
            <p>
              Pessoa <strong>{nome}</strong> deletada com sucesso
            </p>
          </div>
        ),
      })
    },
    async onError(error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: `${error}`,
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
              deletarPessoaFn({ codigoPessoa: codigo })
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
