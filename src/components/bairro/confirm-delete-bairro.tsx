import { useToast } from '@/hooks/use-toast'
import { deletarBairro } from '@/http/generated/bairro/bairro'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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

interface ErrorProps {
  response: {
    data: {
      mensagem: string
    }
  }
}

export function ConfirmDeleteBairro({ codigo, nome }: ConfirmDeleteProps) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutateAsync: deletarBairroFn } = useMutation({
    mutationFn: deletarBairro,
    async onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['bairros'],
      })
      toast({
        description: (
          <div>
            <p>
              Bairro <strong>{nome}</strong> deletado com sucesso
            </p>
          </div>
        ),
      })
    },
    async onError(error: ErrorProps) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: `${error.response.data.mensagem}`,
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
              deletarBairroFn({ codigoBairro: codigo })
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
