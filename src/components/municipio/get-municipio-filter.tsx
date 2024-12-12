import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

const getMunicipioFilterSchema = z.object({
  codigoMunicipio: z.union([z.number(), z.string()]).optional(),
  codigoUF: z.union([z.string(), z.number(), z.undefined()]).optional(),
  nome: z
    .string()
    .optional()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .transform((val: any) => {
      // Se a sigla contiver números, transforma para undefined
      if (/\d/.test(val)) {
        return undefined
      }
      if (!val || typeof val !== 'string') return undefined // Verifica tipo
      const normalizedVal = val.trim().toLowerCase() // Normaliza
      return normalizedVal === '' ? undefined : normalizedVal // Remove strings vazias
      // return val?.trim() === '' ? undefined : val
    }),
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

type GetMunicipioFilterSchema = z.infer<typeof getMunicipioFilterSchema>

export function GetMunicipioFilter() {
  const router = useRouter()

  const formFilterMunicipio = useForm<GetMunicipioFilterSchema>({
    resolver: zodResolver(getMunicipioFilterSchema),
    defaultValues: {
      codigoMunicipio: undefined,
      codigoUF: undefined,
      nome: undefined,
      status: undefined,
    },
  })

  const queryClient = useQueryClient()

  async function onSubmit(data: GetMunicipioFilterSchema) {
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

      await queryClient.setQueryData(['municipios-filters'], normalizeData)
      await queryClient.invalidateQueries({
        queryKey: ['municipios'],
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error)
    }
  }

  function handleClearFilter() {
    formFilterMunicipio.reset()

    router.push('/municipio')

    queryClient.removeQueries({
      queryKey: ['municipios-filters'],
    })

    queryClient.refetchQueries({
      queryKey: ['municipios'],
    })
  }

  return (
    <div className="flex flex-col gap-4 rounded-md border p-4 md:flex-row md:items-center">
      <div className="flex justify-start md:justify-normal">
        <h1 className="justify-start text-base font-bold md:justify-normal">
          Filtros:{' '}
        </h1>
      </div>
      <Form {...formFilterMunicipio}>
        <form
          onSubmit={formFilterMunicipio.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 md:flex-row"
        >
          <FormField
            control={formFilterMunicipio.control}
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
            control={formFilterMunicipio.control}
            name="codigoUF"
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
                    placeholder="codigoUF"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formFilterMunicipio.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''} // Normaliza undefined para string vazia
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === '' ? undefined : e.target.value,
                      )
                    }
                    placeholder="Nome do Municipio"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formFilterMunicipio.control}
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
