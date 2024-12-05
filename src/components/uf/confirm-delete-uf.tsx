'use client'
import { useToast } from '@/hooks/use-toast'
import { deletarUf } from '@/http/generated/uf/uf'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
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
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { ToastAction } from '@/components/ui/toast'

export interface ConfirmDeleteProps {
  codigo: number
  nome: string
}

export function ConfirmDeleteUf({ codigo, nome }: ConfirmDeleteProps) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutateAsync: deletarUfFn } = useMutation({
    mutationFn: deletarUf,
    async onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['ufs'],
      })
      toast({
        description: `Uf ${nome} deletado com sucesso`,
        variant: 'default',
        action: (
          <ToastAction altText="Sair" className="">
            Sair
          </ToastAction>
        ),
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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deletarUfFn({ codigoUf: codigo })
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
