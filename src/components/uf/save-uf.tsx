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
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cadastrarUf } from '@/http/generated/uf/uf'
import { toast } from '@/hooks/use-toast'
import { useState } from 'react'

const saveUfSchema = z.object({
  sigla: z.string().regex(/^[a-zA-Z\s]+$/, {
    message: 'Dever conter apenas letras',
  }),
  nome: z.string().regex(/^[a-zA-Zá-úÁ-ÚçÇ\s]+$/, {
    message: 'Dever conter apenas letras',
  }),
  status: z.boolean(),
})

type SaveUfSchema = z.infer<typeof saveUfSchema>

export function SaveUf() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const formSaveUf = useForm<SaveUfSchema>({
    resolver: zodResolver(saveUfSchema),
    defaultValues: {
      sigla: '',
      nome: '',
      status: true,
    },
  })

  const queryClient = useQueryClient()

  const { mutateAsync: cadastrarUfFn } = useMutation({
    mutationFn: cadastrarUf,
    async onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['ufs'],
      })
      toast({
        description: 'UF cadastrado com sucesso',
      })
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onSubmit(data: any) {
    try {
      data.status = data.status ? 1 : 2
      await cadastrarUfFn({
        sigla: data.sigla,
        nome: data.nome,
        status: data.status,
      })
      // formSaveUf.reset()
      setIsDialogOpen(false)
      formSaveUf.reset()

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
        <Button className="text-xl">Cadastrar UF</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar UF</DialogTitle>
          <DialogDescription>Cadastro</DialogDescription>
          <Form {...formSaveUf}>
            <form onSubmit={formSaveUf.handleSubmit(onSubmit)}>
              <FormField
                control={formSaveUf.control}
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
                control={formSaveUf.control}
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
                control={formSaveUf.control}
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
