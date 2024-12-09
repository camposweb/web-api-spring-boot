import { Search } from 'lucide-react'
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
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const getPessoaSchema = z.object({
  login: z.string().optional(),
  codigoPessoa: z.union([z.number(), z.string()]).optional(),
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

type GetPessoaSchema = z.infer<typeof getPessoaSchema>

export function GetPessoaFilter() {
  const router = useRouter()

  const formFilterPessoa = useForm<GetPessoaSchema>({
    resolver: zodResolver(getPessoaSchema),
    defaultValues: {
      login: undefined,
      codigoPessoa: undefined,
      status: undefined,
    },
  })

  const queryClient = useQueryClient()

  async function onSubmit(data: GetPessoaSchema) {
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

      await queryClient.setQueryData(['pessoas-filters'], normalizeData)
      await queryClient.invalidateQueries({
        queryKey: ['pessoas'],
      })
    } catch (error) {
      console.log(error)
    }
  }

  function handleClearFilter() {
    formFilterPessoa.reset()

    router.push('/pessoa')

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
      <Form {...formFilterPessoa}>
        <form
          onSubmit={formFilterPessoa.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 md:flex-row"
        >
          <FormField
            control={formFilterPessoa.control}
            name="login"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="login" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formFilterPessoa.control}
            name="codigoPessoa"
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
                    placeholder="codigoPessoa"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formFilterPessoa.control}
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
