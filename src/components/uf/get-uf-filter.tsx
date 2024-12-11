'use client'
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

interface GetUfFilterProps {
  codigo?: number
  sigla?: string
  nome?: string
  status?: boolean | number | 'all'
}

const getUfFilterSchema = z.object({
  codigoUf: z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .optional()
    .transform((val) => {
      if (
        val === '' ||
        val === null ||
        val === undefined ||
        isNaN(Number(val))
      ) {
        return undefined // Retorna undefined para strings inválidas, nulas ou vazias
      }
      return typeof val === 'string' ? Number(val) : val // Converte strings numéricas para números
    }),

  sigla: z
    .string()
    .max(3, { message: 'Deve ter no máximo 3 caracteres' })
    .optional()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .transform((val: any) => {
      // Se a sigla contiver números, transforma para undefined
      if (/\d/.test(val)) {
        return undefined
      }
      return val?.trim() === '' ? undefined : val
    }),
  nome: z
    .string()
    .optional()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .transform((val: any) => {
      // Se a sigla contiver números, transforma para undefined
      if (/\d/.test(val)) {
        return undefined
      }
      return val?.trim() === '' ? undefined : val
    }),
  status: z.union([z.boolean(), z.literal('all')]).optional(),
})

type GetUfFilterSchema = z.infer<typeof getUfFilterSchema>

export function GetUfFilter() {
  const router = useRouter()
  // const searchParams = useSearchParams()

  const formFilter = useForm<GetUfFilterSchema>({
    resolver: zodResolver(getUfFilterSchema),
    defaultValues: {
      codigoUf: undefined,
      sigla: '',
      nome: '',
      status: 'all',
    },
  })

  const queryClient = useQueryClient()

  async function onSubmit(data: GetUfFilterProps) {
    try {
      if (data.status === 'all') {
        data.status = undefined
      }
      if (data.status === true) {
        data.status = 1
      }
      if (data.status === false) {
        data.status = 2
      }
      const query = new URLSearchParams()

      // Adiciona apenas os filtros com valores definidos
      Object.entries(data).forEach(([key, value]) => {
        if (value && value !== 'all') query.append(key, value)
      })

      router.push(`?${query.toString()}`)

      // Normaliza os campos para garantir que null seja transformado em undefined
      const normalizedData = {
        ...data,
        codigo: data.codigo ?? undefined, // Transforma null em undefined
        sigla: data.sigla ?? undefined, // Transforma null ou '' em undefined
        nome: data.nome ?? undefined, // Transforma null ou '' em undefined
      }

      await queryClient.setQueryData(['ufs-filters'], normalizedData)
      await queryClient.invalidateQueries({
        queryKey: ['ufs'],
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error)
    }
  }

  function handleClearFilter() {
    formFilter.reset({
      codigoUf: undefined, // Força o valor inicial para códigoUF
      sigla: '',
      nome: '',
      status: 'all',
    })

    router.push('/uf')

    queryClient.removeQueries({
      queryKey: ['ufs-filters'],
    })

    queryClient.refetchQueries({
      queryKey: ['ufs'],
    })
  }

  return (
    <div className="flex flex-col gap-4 rounded-md border p-4 md:flex-row md:items-center">
      <div className="flex justify-start md:justify-normal">
        <h1 className="justify-start text-base font-bold md:justify-normal">
          Filtros:{' '}
        </h1>
      </div>
      <Form {...formFilter}>
        <form
          onSubmit={formFilter.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 md:flex-row"
        >
          <FormField
            control={formFilter.control}
            name="codigoUf"
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
                    placeholder="codigoUf"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formFilter.control}
            name="sigla"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''} // Normaliza undefined para string vazia
                    onChange={(e) => {
                      const input = e.target.value
                      const ultimaEntrada = input.slice(-1) // Verifica o último caractere inserido
                      if (/[^a-zA-ZÀ-ÿ\s]/.test(ultimaEntrada)) {
                        // Se não for letra ou espaço, não atualiza o estado
                        e.preventDefault()
                        return
                      }
                      field.onChange(input === '' ? undefined : input) // Atualiza o estado se o caractere for válido
                    }}
                    placeholder="sigla"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formFilter.control}
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
                    placeholder="nome"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formFilter.control}
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
