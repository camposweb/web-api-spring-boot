import { useToast } from '@/hooks/use-toast'
import { atualizarMunicipio } from '@/http/generated/municipio/municipio'
import { useListarUfs } from '@/http/generated/uf/uf'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Switch } from '../ui/switch'

interface EditMunicipioProps {
  codigoMunicipio?: number
  codigoUf?: number
  nomeMunicipio?: string
  statusMunicipio?: number
}

const editMunicipioSchema = z.object({
  codigoMunicipio: z
    .number()
    .min(1, { message: 'Dever conter o codigoMunicipio' }),
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

type EditMunicipioSchema = z.infer<typeof editMunicipioSchema>

export function EditMunicipio({
  codigoMunicipio,
  codigoUf,
  nomeMunicipio,
  statusMunicipio,
}: EditMunicipioProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const formEditMunicipio = useForm<EditMunicipioSchema>({
    resolver: zodResolver(editMunicipioSchema),
    defaultValues: {
      codigoMunicipio,
      codigoUf,
      nome: nomeMunicipio,
      status: statusMunicipio,
    },
  })

  const { data: ufs } = useListarUfs({}, { query: { queryKey: ['ufs'] } })

  const queryClient = useQueryClient()

  const { mutateAsync: atualizarMunicipioFn } = useMutation({
    mutationFn: atualizarMunicipio,
    async onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['municipios'],
      })
    },
  })

  async function onSubmit(data: EditMunicipioSchema) {
    try {
      await atualizarMunicipioFn({
        codigoMunicipio: data.codigoMunicipio,
        codigoUf: Number(data.codigoUf),
        nome: data.nome,
        status: data.status,
      })
      toast({
        description: `Município editado com sucesso`,
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
          <DialogTitle>Editar UF {nomeMunicipio}</DialogTitle>
          <DialogDescription>Painel de edição de UF</DialogDescription>
          <Form {...formEditMunicipio}>
            <form
              onSubmit={formEditMunicipio.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={formEditMunicipio.control}
                name="codigoMunicipio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex text-base">
                      Código Município
                    </FormLabel>
                    <FormControl>
                      <Input disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formEditMunicipio.control}
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
                          {ufs?.data.map((uf) => (
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
                control={formEditMunicipio.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex text-base">
                      Nome Município
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
                control={formEditMunicipio.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex text-base">Status UF</FormLabel>
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
  )
}
