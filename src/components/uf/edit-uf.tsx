'use client'
import { Pencil } from 'lucide-react'
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
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '../ui/input'
import { Switch } from '../ui/switch'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { atualizarUf } from '@/http/generated/uf/uf'
import { toast } from '@/hooks/use-toast'
import { useState } from 'react'

export interface EditUfProps {
  codigoUf?: number
  siglaUf?: string
  nomeUf?: string
  statusUf?: number
}

const editUfSchema = z.object({
  codigo: z.number().min(1, { message: 'Dever conter o codigoUf' }),
  sigla: z.string().regex(/^[a-zA-Z\s]+$/, {
    message: 'Dever conter apenas letras',
  }),
  nome: z.string().regex(/^[a-zA-Zá-úÁ-ÚçÇ\s]+$/, {
    message: 'Dever conter apenas letras',
  }),
  status: z.boolean(),
})

type EditUfSchema = z.infer<typeof editUfSchema>

export function EditUf({ codigoUf, siglaUf, nomeUf, statusUf }: EditUfProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  // const statusString = status
  const statusBoolean =
    statusUf === 1 ? true : statusUf === 2 ? false : undefined

  const form = useForm<EditUfSchema>({
    resolver: zodResolver(editUfSchema),
    defaultValues: {
      codigo: codigoUf,
      sigla: siglaUf,
      nome: nomeUf,
      // statusUf: statusString,
      status: statusBoolean,
    },
  })

  const queryClient = useQueryClient()

  const { mutateAsync: atualizarUfFn } = useMutation({
    mutationFn: atualizarUf,
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
  async function onSubmit(data: any) {
    try {
      data.status = data.status ? 1 : 2
      await atualizarUfFn({
        codigoUf: data.codigo,
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
        <Button title="Editar">
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
