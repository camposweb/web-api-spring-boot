'use client'
import { useToast } from '@/hooks/use-toast'
import { cadastrarMunicipio } from '@/http/generated/municipio/municipio'
import { useListarUfs } from '@/http/generated/uf/uf'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Switch } from '../ui/switch'
import { Plus } from 'lucide-react'

const saveMunicipioSchema = z.object({
  codigoUf: z.union([
    z.string().min(1, { message: 'Selecione uma UF' }),
    z.number().min(1, { message: 'Selecione uma UF' }),
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

type SaveMunicipioSchema = z.infer<typeof saveMunicipioSchema>

export function SaveMunicipio() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const formSaveMunicipio = useForm<SaveMunicipioSchema>({
    resolver: zodResolver(saveMunicipioSchema),
    defaultValues: {
      codigoUf: '',
      nome: '',
      status: 1,
    },
  })

  const { data: ufs } = useListarUfs({}, { query: { queryKey: ['ufs'] } })

  const queryClient = useQueryClient()

  const { mutateAsync: cadastrarMunicipioFn } = useMutation({
    mutationFn: cadastrarMunicipio,
    async onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['municipios'],
      })
    },
  })

  async function onSubmit(data: SaveMunicipioSchema) {
    try {
      await cadastrarMunicipioFn({
        codigoUf: Number(data.codigoUf),
        nome: data.nome,
        status: data.status,
      })
      toast({
        description: (
          <div>
            <p>
              Município <strong>{data.nome}</strong> cadastrado com sucesso
            </p>
          </div>
        ),
      })
      setIsDialogOpen(false)
      formSaveMunicipio.reset()
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
          <Button className="text-xl">
            <Plus /> Cadastrar Município
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar Município</DialogTitle>
            <DialogDescription>
              Formulário para cadastro de Município
            </DialogDescription>
          </DialogHeader>
          <Form {...formSaveMunicipio}>
            <form
              onSubmit={formSaveMunicipio.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={formSaveMunicipio.control}
                name="codigoUf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex text-base">UF</FormLabel>
                    <FormControl>
                      <Select
                        value={String(field.value)} // Garante que o valor seja uma string para o Select
                        onValueChange={(value) => field.onChange(Number(value))} // Converte o valor de volta para número
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma UF" />
                        </SelectTrigger>
                        <SelectContent sideOffset={5}>
                          {ufs?.data
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            .sort((a: any, b: any) =>
                              a.sigla.localeCompare(b.sigla),
                            ) // Ordena pela sigla em ordem alfabética
                            .map((uf) => (
                              <SelectItem
                                key={uf.codigoUf}
                                value={String(uf.codigoUf)}
                                className="hover:cursor-pointer"
                              >
                                {uf.sigla}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formSaveMunicipio.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex text-base">Nome</FormLabel>
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
                control={formSaveMunicipio.control}
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
                Cadastrar Municipio
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
