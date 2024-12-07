import { useToast } from '@/hooks/use-toast'
import { atualizarBairro } from '@/http/generated/bairro/bairro'
import { useListarMunicipios } from '@/http/generated/municipio/municipio'
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
import { Pencil } from 'lucide-react'

const editBairroSchema = z.object({
  codigoBairro: z.number().min(1, { message: 'Dever conter o codigoBairro' }),
  codigoMunicipio: z.union([
    z
      .string()
      .min(1, { message: 'Campo obrigatório' })
      .regex(/^[a-zA-Zá-úÁ-ÚçÇ\s]+$/, {
        message: 'Campo obrigatórioa e deve conter apenas letras',
      }),
    z.number(),
  ]),
  nome: z
    .string()
    .min(1, { message: 'Campo obrigatório' })
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

type EditBairroSchema = z.infer<typeof editBairroSchema>

export function EditBairro({
  codigoBairro,
  codigoMunicipio,
  nome,
  status,
}: EditBairroSchema) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const { data: municipios } = useListarMunicipios(
    {},
    { query: { queryKey: ['municipios'] } },
  )

  const nomeMunicipio = municipios?.data.find(
    (m) => m.codigoMunicipio === codigoMunicipio,
  )

  const formEditBairro = useForm<EditBairroSchema>({
    resolver: zodResolver(editBairroSchema),
    defaultValues: {
      codigoBairro,
      codigoMunicipio: nomeMunicipio?.nome,
      nome,
      status,
    },
  })

  const queryClient = useQueryClient()

  const { mutateAsync: atualizarBairroFn } = useMutation({
    mutationFn: atualizarBairro,
    async onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['bairros'],
      })
    },
  })

  async function onSubmit(data: EditBairroSchema) {
    try {
      /* const municipio = municipios?.data.find(
        (m) => m.nome?.toLowerCase() === data?.codigoMunicipio?.toLowerCase(),
      ) */

      const municipio = municipios?.data.find((m) => {
        if (
          typeof data.codigoMunicipio === 'string' &&
          typeof m.nome === 'string'
        ) {
          return m.nome.toLowerCase() === data.codigoMunicipio.toLowerCase()
        }
        return false
      })
      if (!municipio) {
        toast({
          title: 'Erro',
          description: `Município com nome ${data.codigoMunicipio} não existe`,
          variant: 'destructive',
        })
        return
      }

      /* if (!municipio) {
        toast({
          title: 'Erro',
          description: `Município com nome ${data.codigoMunicipio} não existe`,
          variant: 'destructive',
        })
        return
      }
      const normalizedData = {
        ...data,
        // codigoBairro: Number(data.codigoBairro),
        codigoMunicipio: Number(municipio.codigoMunicipio),
        // nome: data.nome,
        // status: data.status,
      }

      toast({
        description: (
          <pre>
            <code>{JSON.stringify(normalizedData, null, 2)}</code>
          </pre>
        ),
      }) */

      const normalizedData = {
        ...data,
        codigoMunicipio: Number(municipio.codigoMunicipio),
      }

      await atualizarBairroFn(normalizedData)
      /* toast({
        description: (
          <pre>
            <code>{JSON.stringify(normalizedData, null, 2)}</code>
          </pre>
        ),
      }) */

      toast({
        description: (
          <div>
            <p>
              Bairro <strong>{data.nome}</strong> cadastrado com sucesso
            </p>
          </div>
        ),
      })

      setIsDialogOpen(false)

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
          description: `${error.response?.data.mensagem.replace(/ com codigoMunicipio \d+/, '')}`,
        })
      }
    }
  }
  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button title="Editar Uf">
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar Bairro</DialogTitle>
            <DialogDescription>
              Formulário para cadastro de Bairro
            </DialogDescription>
          </DialogHeader>
          <Form {...formEditBairro}>
            <form
              onSubmit={formEditBairro.handleSubmit(onSubmit)}
              className="space-y-2"
            >
              <FormField
                control={formEditBairro.control}
                name="codigoBairro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex text-base">
                      Código Bairro
                    </FormLabel>
                    <FormControl>
                      <Input disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formEditBairro.control}
                name="codigoMunicipio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex text-base">
                      Nome Municipio
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Digite o nome do município"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formEditBairro.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex text-base">
                      Nome do Bairro
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Digite o nome do bairro" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formEditBairro.control}
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
        </DialogContent>
      </Dialog>
    </div>
  )
}
