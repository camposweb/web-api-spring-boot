'use client'
import { toast } from '@/hooks/use-toast'
import { atualizarUF } from '@/http/generated/uf/uf'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Switch } from '../ui/switch'

export interface EditUfProps {
  codigoUF?: number
  siglaUf?: string
  nomeUf?: string
  statusUf?: number
}

interface EditDataProps {
  codigo: number
  sigla: string
  nome: string
  status: boolean | number
}

const editUfSchema = z.object({
  codigo: z.number().min(1, { message: 'Dever conter o codigoUF' }),
  sigla: z.string().regex(/^[a-zA-Z]{1,3}$/, {
    message: 'Dever conter apenas letras de no máximo 3 caracteres',
  }),
  nome: z.string().regex(/^[a-zA-Zá-úÁ-ÚçÇ\s]+$/, {
    message: 'Dever conter apenas letras',
  }),
  status: z.boolean(),
})

type EditUfSchema = z.infer<typeof editUfSchema>

export function EditUf({ codigoUF, siglaUf, nomeUf, statusUf }: EditUfProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  // const statusString = status
  const statusBoolean =
    statusUf === 1 ? true : statusUf === 2 ? false : undefined

  const form = useForm<EditUfSchema>({
    resolver: zodResolver(editUfSchema),
    defaultValues: {
      codigo: codigoUF,
      sigla: siglaUf,
      nome: nomeUf,
      // statusUf: statusString,
      status: statusBoolean,
    },
  })

  const queryClient = useQueryClient()

  const { mutateAsync: atualizarUFFn } = useMutation({
    mutationFn: atualizarUF,
    async onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['ufs'],
      })
      toast({
        title: 'Sucesso',
        description: 'UF atualizada com sucesso',
      })
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onSubmit(data: EditDataProps) {
    try {
      data.status = data.status ? 1 : 2
      await atualizarUFFn({
        codigoUF: data.codigo,
        sigla: data.sigla,
        nome: data.nome,
        status: data.status,
      })
      setIsDialogOpen(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: `${error.response?.data.mensagem}`,
      })
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button title="Editar Uf">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar UF {nomeUf}</DialogTitle>
          <DialogDescription>Painel de edição de UF</DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="codigo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código UF</FormLabel>
                    <FormControl>
                      <Input disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sigla"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sigla UF</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome UF</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status UF</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="flex data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-600"
                      />
                    </FormControl>
                    <FormDescription>
                      Verde ATIVO = 1 | Vermelho DESATIVADO = 2
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-4 w-full text-sm font-bold">
                Salvar alterações
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
