import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Search } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'

const getBairroFilterSchema = z.object({
  codigoBairro: z.union([z.number(), z.string()]).optional(),
  codigoMunicipio: z.union([z.number(), z.string()]).optional(),
  nome: z.string().optional(),
  status: z
    .union([z.boolean(), z.number()])
    .transform((val) => {
      if (typeof val === 'boolean') {
        return val ? 1 : 2
      }
      return val
    })
    .optional(),
})

type GetBairroFilterSchema = z.infer<typeof getBairroFilterSchema>

export function GetBairroFilter() {
  const router = useRouter()

  const formFilterBairro = useForm<GetBairroFilterSchema>({
    resolver: zodResolver(getBairroFilterSchema),
    defaultValues: {
      codigoBairro: undefined,
      codigoMunicipio: undefined,
      nome: undefined,
      status: undefined,
    },
  })

  const queryClient = useQueryClient()

  async function onSubmit(data: GetBairroFilterSchema) {
    try {
      const query = new URLSearchParams()
      // Adiciona apenas os filtros com valores definidos
      Object.entries(data).forEach(([key, value]) => {
        if (value && value !== 'all') {
          query.append(key, String(value)) // Converte o valor para string
        }
      })
      router.push(`?${query.toString()}`)

      const normalizeData = {
        ...data,
      }

      await queryClient.setQueryData(['bairros-filters'], normalizeData)
      await queryClient.invalidateQueries({
        queryKey: ['bairros'],
      })
    } catch (error) {
      console.log(error)
    }
  }

  function handleClearFilter() {
    formFilterBairro.reset()

    router.push('/bairro')

    queryClient.removeQueries({
      queryKey: ['bairros-filters'],
    })

    queryClient.refetchQueries({
      queryKey: ['bairros'],
    })
  }

  return (
    <div className="flex flex-col gap-4 rounded-md border p-4 md:flex-row md:items-center">
      <div className="flex justify-start md:justify-normal">
        <h1 className="justify-start text-base font-bold md:justify-normal">
          Filtros:{' '}
        </h1>
      </div>
      <Form {...formFilterBairro}>
        <form
          onSubmit={formFilterBairro.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 md:flex-row"
        >
          <FormField
            control={formFilterBairro.control}
            name="codigoBairro"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''} // Normaliza undefined para string vazia
                    onChange={(e) => {
                      const valor = e.target.value
                      const numero = Number(valor)

                      // Atualiza somente se for um número ou se o campo estiver vazio
                      if (valor === '' || !isNaN(numero)) {
                        field.onChange(valor === '' ? undefined : numero)
                      }
                    }}
                    placeholder="codigoBairro"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formFilterBairro.control}
            name="codigoMunicipio"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''} // Normaliza undefined para string vazia
                    onChange={(e) => {
                      const valor = e.target.value
                      const numero = Number(valor)

                      // Atualiza somente se for um número ou se o campo estiver vazio
                      if (valor === '' || !isNaN(numero)) {
                        field.onChange(valor === '' ? undefined : numero)
                      }
                    }}
                    placeholder="codigoMunicipio"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formFilterBairro.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="nome" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formFilterBairro.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormControl className="flex w-5">
                  <Select
                    {...field}
                    value={
                      field.value === undefined ? 'all' : String(field.value)
                    } // Usando "none" para representar undefined
                    onValueChange={(value) =>
                      field.onChange(
                        value === 'all' ? undefined : value === 'true',
                      )
                    } // Converte "none" de volta para undefined// Converte "" para undefined e "true"/"false" para booleano
                  >
                    <SelectTrigger className="md:w-44">
                      <SelectValue placeholder="status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="hover:cursor-pointer">
                        <Badge variant="outline">TODOS</Badge>
                      </SelectItem>
                      <SelectItem value="true" className="hover:cursor-pointer">
                        <Badge className="bg-green-500 hover:bg-green-500">
                          ATIVADO
                        </Badge>
                      </SelectItem>
                      <SelectItem
                        value="false"
                        className="hover:cursor-pointer"
                      >
                        <Badge
                          variant="destructive"
                          className="hover:bg-red-600"
                        >
                          DESATIVADO
                        </Badge>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="default" className="text-base">
            <Search /> Aplicar filtro
          </Button>
          <Button
            type="reset"
            onClick={handleClearFilter}
            variant="secondary"
            className="text-base"
          >
            Limpar filtro
          </Button>
        </form>
      </Form>
    </div>
  )
}
