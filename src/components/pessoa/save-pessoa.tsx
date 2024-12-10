'use client'
import { useState } from 'react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cadastrarPessoa } from '@/http/generated/pessoa/pessoa'
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
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { ScrollArea } from '../ui/scroll-area'
import { useListarMunicipios } from '@/http/generated/municipio/municipio'
import { useListarBairros } from '@/http/generated/bairro/bairro'
import { HousePlus, Trash2, UserPlus } from 'lucide-react'

const savePessoaSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome é obrigatório')
    .regex(/^[a-zA-Zá-úÁ-ÚçÇ\s]+$/, {
      message: 'Campo obrigatório e deve conter apenas letras',
    }),
  sobrenome: z
    .string()
    .min(1, 'Campo obrigatório')
    .regex(/^[a-zA-Zá-úÁ-ÚçÇ\s]+$/, {
      message: 'Campo obrigatório e deve conter apenas letras',
    }),
  idade: z.union(
    [
      z.string().min(1, { message: 'Campo obrigatório' }),
      z
        .number()
        .min(1, { message: 'Campo obrigatório' })
        .nonnegative({ message: 'Idade deve ser maior que zero' }),
    ],
    { message: 'Campo obrigatório' },
  ),

  login: z.string().min(1, 'Campo obrigatório'),
  senha: z.string().min(1, 'Campo obrigatório'),
  status: z.union([z.boolean(), z.number()]).transform((val) => {
    if (typeof val === 'boolean') {
      return val ? 1 : 2
    }
    return val
  }),
  enderecos: z.array(
    z.object({
      codigoMunicipio: z.string().min(1, 'Campo obrigatório'),
      codigoBairro: z.string().min(1, 'Campo obrigatório'),
      nomeRua: z.string().min(1, 'Campo obrigatório'),
      numero: z.string().min(1, 'Campo obrigatório'),
      complemento: z.string(),
      cep: z.string().min(1, 'Campo obrigatório'),
    }),
  ),
})

type SavePessoaSchema = z.infer<typeof savePessoaSchema>

export function SavePessoa() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const formSavePessoa = useForm<SavePessoaSchema>({
    resolver: zodResolver(savePessoaSchema),
    defaultValues: {
      nome: '',
      sobrenome: '',
      idade: '',
      login: '',
      senha: '',
      status: 1,
      enderecos: [],
    },
  })

  const { data: municipios } = useListarMunicipios(
    {},
    { query: { queryKey: ['municipios'] } },
  )

  const { data: bairros } = useListarBairros(
    {},
    { query: { queryKey: ['bairros'] } },
  )

  const queryClient = useQueryClient()

  const { mutateAsync: cadastrarPessoaFn } = useMutation({
    mutationFn: cadastrarPessoa,
    async onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['pessoas'],
      })
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: formSavePessoa.control,
    name: 'enderecos',
  })

  async function onSubmit(data: SavePessoaSchema) {
    try {
      if (data.enderecos.length < 1) {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Deve cadastrar pelo menos um endereço',
        })
        return
      }

      for (const endereco of data.enderecos) {
        const municipio = municipios?.data.find(
          (m) =>
            m.nome?.toLowerCase() === endereco.codigoMunicipio.toLowerCase(),
        )

        if (!municipio) {
          toast({
            title: 'Erro',
            description: `Município com nome ${endereco.codigoMunicipio} não existe`,
            variant: 'destructive',
          })
          return
        }

        const bairro = bairros?.data.find(
          (b) => b.nome?.toLowerCase() === endereco.codigoBairro.toLowerCase(),
        )

        if (!bairro) {
          toast({
            title: 'Erro',
            description: `Bairro com nome ${endereco.codigoBairro} não existe`,
            variant: 'destructive',
          })
          return
        }
      }

      const normalizedEnderecos = {
        enderecos: data.enderecos.map((endereco) => {
          const bairro = bairros?.data.find(
            (b) =>
              b.nome?.toLowerCase() === endereco.codigoBairro.toLowerCase(),
          )

          return {
            codigoBairro: Number(bairro?.codigoBairro),
            nomeRua: endereco.nomeRua,
            numero: endereco.numero,
            complemento: endereco.complemento,
            cep: endereco.cep,
          }
        }),
      }

      const normalizedData = {
        ...data,
        idade: Number(data.idade),
        enderecos: normalizedEnderecos,
      }

      await cadastrarPessoaFn({
        nome: normalizedData.nome,
        sobrenome: normalizedData.sobrenome,
        idade: normalizedData.idade,
        login: normalizedData.login,
        senha: normalizedData.senha,
        status: normalizedData.status,
        enderecos: normalizedData.enderecos.enderecos,
      })

      toast({
        description: (
          <div>
            <p>
              Pessoa com nome <strong>{normalizedData.nome}</strong> cadastrada
              com sucesso
            </p>
          </div>
        ),
      })

      setIsDialogOpen(false)
      formSavePessoa.reset()
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
          <Button className="text-xl">
            <UserPlus /> Cadastrar Pessoa
          </Button>
        </DialogTrigger>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Cadastrar Pessoa</DialogTitle>
            <DialogDescription>
              Formulário para cadastro de pessoa
            </DialogDescription>
          </DialogHeader>
          <Form {...formSavePessoa}>
            <form
              onSubmit={formSavePessoa.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <Tabs defaultValue="pessoa">
                <TabsList>
                  <TabsTrigger value="pessoa">Dados Pessoa</TabsTrigger>
                  <TabsTrigger value="endereco">Dados Endereço</TabsTrigger>
                </TabsList>
                <TabsContent value="pessoa">
                  <ScrollArea className="h-[450px] pl-0 pr-4 pt-0">
                    <div className="space-y-4 border p-4">
                      <FormField
                        control={formSavePessoa.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex text-base">
                              Nome
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Digite o nome da pessoa"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formSavePessoa.control}
                        name="sobrenome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex text-base">
                              Sobrenome
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Digite o sobrenome da pessoa"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formSavePessoa.control}
                        name="idade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex text-base">
                              Idade
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value ?? ''} // Normaliza undefined para string vazia
                                onChange={(e) => {
                                  const valor = e.target.value
                                  const numero = Number(valor)

                                  // Atualiza somente se for um número ou se o campo estiver vazio
                                  if (valor === '' || !isNaN(numero)) {
                                    field.onChange(
                                      valor === '' ? undefined : numero,
                                    )
                                  }
                                }}
                                placeholder="Digite a idade da pessoa"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formSavePessoa.control}
                        name="login"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex text-base">
                              Login
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Digite o login da pessoa"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formSavePessoa.control}
                        name="senha"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex text-base">
                              Senha
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Digite a senha da pessoa"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formSavePessoa.control}
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
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="endereco">
                  <ScrollArea className="h-[450px] pl-0 pr-4 pt-0">
                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <div key={field.id} className="space-y-2 border p-4">
                          <FormField
                            control={formSavePessoa.control}
                            name={`enderecos.${index}.codigoMunicipio`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Municipio</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Nome do Município"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formSavePessoa.control}
                            name={`enderecos.${index}.codigoBairro`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bairro</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Nome do Bairro"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formSavePessoa.control}
                            name={`enderecos.${index}.nomeRua`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Rua</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Nome da Rua" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formSavePessoa.control}
                            name={`enderecos.${index}.numero`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Número</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Número" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formSavePessoa.control}
                            name={`enderecos.${index}.complemento`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Complemento</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Complemento" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formSavePessoa.control}
                            name={`enderecos.${index}.cep`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CEP</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="CEP" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => remove(index)}
                          >
                            <Trash2 />
                            Remover Endereço
                          </Button>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="default"
                        onClick={() =>
                          append({
                            codigoMunicipio: '',
                            codigoBairro: '',
                            nomeRua: '',
                            numero: '',
                            complemento: '',
                            cep: '',
                          })
                        }
                      >
                        <HousePlus />
                        Adicionar Endereço
                      </Button>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>

              <Button type="submit" className="mt-4 w-full text-sm font-bold">
                Cadastrar Pessoa
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
