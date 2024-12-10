import { toast } from '@/hooks/use-toast'
import { cadastrarUf } from '@/http/generated/uf/uf'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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

const saveUfSchema = z.object({
  sigla: z
    .string()
    .min(2, {
      message: 'Sigla deve ter pelo menos 2 caracteres',
    })
    .max(3, {
      message: 'Sigla deve ter no máximo 3 caracteres',
    })
    .regex(/^[a-zA-Z]/, {
      message: 'Campo obrigatórioa e deve conter apenas letras sem acentos',
    }),
  nome: z
    .string()
    .min(2, {
      message: 'Sigla deve ter pelo menos 2 caracteres',
    })
    .regex(/^[a-zA-Zá-úÁ-ÚçÇ\s]+$/, {
      message: 'Campo obrigatórioa e deve conter apenas letras',
    }),
  status: z.union([z.boolean(), z.number()]).transform((val) => {
    if (typeof val === 'boolean') {
      return val ? 1 : 2
    }
    return val
  }),
})

type SaveUfSchema = z.infer<typeof saveUfSchema>

export function SaveUf() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const formSaveUf = useForm<SaveUfSchema>({
    resolver: zodResolver(saveUfSchema),
    defaultValues: {
      sigla: '',
      nome: '',
      status: 1,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async onError() {},
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onSubmit(data: SaveUfSchema) {
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
      if (Array.isArray(error.response?.data)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mensagem = error.response?.data.map((e: any) => (
          <p key={e.mensagem}>{e.mensagem}</p>
        ))

        toast({
          variant: 'destructive',
          title: 'Erro',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          description: mensagem,
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          description: `${error.response?.data.mensagem}`,
        })
      }
    }
  }

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="text-xl">Cadastrar UF</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex">Cadastrar UF</DialogTitle>
            <DialogDescription className="flex">Cadastro</DialogDescription>
            <Form {...formSaveUf}>
              <form
                onSubmit={formSaveUf.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={formSaveUf.control}
                  name="sigla"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex">Sigla UF</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Digite a sigla" />
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
                      <FormLabel className="flex">Nome UF</FormLabel>
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
                      <FormLabel className="flex">Status UF</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value === 1} // Converte para boolean (true se ativo)
                          onCheckedChange={(checked) =>
                            field.onChange(checked ? 1 : 2)
                          } // Atualiza com 1 ou 2
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
    </div>
  )
}
