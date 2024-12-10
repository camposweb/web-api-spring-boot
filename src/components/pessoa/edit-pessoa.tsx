'use client'
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { HousePlus, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
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
import { ScrollArea } from '../ui/scroll-area'
import { Switch } from '../ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { useListarMunicipios } from '@/http/generated/municipio/municipio'
import { useListarBairros } from '@/http/generated/bairro/bairro'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { atualizarPessoa } from '@/http/generated/pessoa/pessoa'

const enderecoSchema = z.object({
  codigoMunicipio: z.string().min(1, 'Campo obrigatório'),
  codigoBairro: z.string().min(1, 'Campo obrigatório'),
  nomeRua: z.string().min(1, 'Campo obrigatório'),
  numero: z.string().min(1, 'Campo obrigatório'),
  complemento: z.string().max(20, { message: 'Até 20 caracteres' }),
  cep: z.string().min(1, 'Campo obrigatório'),
})

const atualizarEndereco = z.object({
  codigoEndereco: z
    .number()
    .min(1, { message: 'Dever conter o codigoEndereco' }),
  codigoPessoa: z.number().min(1, 'Deve conter o codigoPessoa'),
  codigoBairro: z.number().min(1, { message: 'Dever conter o codigoBairro' }),
  nomeRua: z.string().min(1, 'Campo obrigatório'),
  numero: z.string().min(1, 'Campo obrigatório'),
  complemento: z.string().max(20, { message: 'Até 20 caracteres' }),
  cep: z.string().min(1, 'Campo obrigatório'),
})

const editPessoaSchema = z.object({
  codigoPessoa: z.number().min(1, 'Deve conter o codigoPessoa'),
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
  enderecos: z.object({
    atualizarEndereco: z.array(atualizarEndereco),
    novoEndereco: z.array(enderecoSchema),
  }),
})

type EditPessoaSchema = z.infer<typeof editPessoaSchema>

export function EditPessoa({
  codigoPessoa,
  nome,
  sobrenome,
  idade,
  login,
  senha,
  status,
  enderecos,
}: EditPessoaSchema) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const formEditPessoa = useForm<EditPessoaSchema>({
    resolver: zodResolver(editPessoaSchema),
    defaultValues: {
      codigoPessoa,
      nome,
      sobrenome,
      idade,
      login,
      senha,
      status,
      enderecos: {
        atualizarEndereco: Array.isArray(enderecos) ? enderecos : [],
        novoEndereco: [],
      },
    },
  })

  const { fields: atualizarEndereco, remove: removeEndereco } = useFieldArray({
    control: formEditPessoa.control,
    name: 'enderecos.atualizarEndereco',
  })

  const {
    fields: novoEndereco,
    append: appendNovoEndereco,
    remove: removeNovoEndereco,
  } = useFieldArray({
    control: formEditPessoa.control,
    name: 'enderecos.novoEndereco',
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

  const { mutateAsync: atualizarPessoaFn } = useMutation({
    mutationFn: atualizarPessoa,
    async onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['pessoas'],
      })
      queryClient.refetchQueries({
        queryKey: ['pessoas'],
      })
    },
  })

  async function onSubmit(data: EditPessoaSchema) {
    try {
      if (data.enderecos.atualizarEndereco.length < 1) {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Deve cadastrar pelo menos um endereço',
        })
        return
      }
      for (const endereco of data.enderecos.novoEndereco) {
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

      const normalizedNovoEndereco = {
        novoEndereco: data.enderecos.novoEndereco.map((endereco) => {
          const bairro = bairros?.data.find(
            (b) =>
              b.nome?.toLowerCase() === endereco.codigoBairro.toLowerCase(),
          )

          return {
            codigoPessoa: Number(data.codigoPessoa),
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
        enderecos: [
          ...data.enderecos.atualizarEndereco,
          ...normalizedNovoEndereco.novoEndereco,
        ],
      }

      await atualizarPessoaFn(normalizedData)

      toast({
        description: (
          <div>
            <p>
              Pessoa <strong>{data.nome}</strong> atualizado com sucesso
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
          description: `${error.response?.data.mensagem}`,
        })
      }
    }
  }

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button title="Editar Pessoa">
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Editar Pessoa</DialogTitle>
            <DialogDescription>Formulário para editar pessoa</DialogDescription>
          </DialogHeader>
          <Form {...formEditPessoa}>
            <form
              onSubmit={formEditPessoa.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <Tabs defaultValue="pessoa">
                <TabsList>
                  <TabsTrigger value="pessoa" className="text-base">
                    Dados Pessoa
                  </TabsTrigger>
                  <TabsTrigger value="endereco" className="text-base">
                    Dados Endereço
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="pessoa">
                  <ScrollArea className="h-[450px] pl-0 pr-4 pt-0">
                    <div className="space-y-4 border p-4">
                      <FormField
                        control={formEditPessoa.control}
                        name="codigoPessoa"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex text-base">
                              Código Pessoa
                            </FormLabel>
                            <FormControl>
                              <Input
                                disabled
                                {...field}
                                placeholder="Digite o nome da pessoa"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formEditPessoa.control}
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
                        control={formEditPessoa.control}
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
                        control={formEditPessoa.control}
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
                        control={formEditPessoa.control}
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
                        control={formEditPessoa.control}
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
                        control={formEditPessoa.control}
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
                      {atualizarEndereco.map((field, index) => (
                        <div key={field.id} className="space-y-2 border p-4">
                          <FormField
                            control={formEditPessoa.control}
                            name={`enderecos.atualizarEndereco.${index}.codigoEndereco`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Código Endereço</FormLabel>
                                <FormControl>
                                  <Input {...field} disabled />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formEditPessoa.control}
                            name={`enderecos.atualizarEndereco.${index}.codigoPessoa`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Código Pessoa</FormLabel>
                                <FormControl>
                                  <Input {...field} disabled />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formEditPessoa.control}
                            name={`enderecos.atualizarEndereco.${index}.codigoBairro`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Código Bairro</FormLabel>
                                <FormControl>
                                  <Input {...field} disabled />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formEditPessoa.control}
                            name={`enderecos.atualizarEndereco.${index}.nomeRua`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Rua</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formEditPessoa.control}
                            name={`enderecos.atualizarEndereco.${index}.complemento`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Complemento</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formEditPessoa.control}
                            name={`enderecos.atualizarEndereco.${index}.numero`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Número</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formEditPessoa.control}
                            name={`enderecos.atualizarEndereco.${index}.cep`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CEP</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => removeEndereco(index)}
                          >
                            <Trash2 />
                            Remover Endereço
                          </Button>
                        </div>
                      ))}
                      {novoEndereco.map((field, index) => (
                        <div key={field.id} className="space-y-2 border p-4">
                          <FormField
                            control={formEditPessoa.control}
                            name={`enderecos.novoEndereco.${index}.codigoMunicipio`}
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
                            control={formEditPessoa.control}
                            name={`enderecos.novoEndereco.${index}.codigoBairro`}
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
                            control={formEditPessoa.control}
                            name={`enderecos.novoEndereco.${index}.nomeRua`}
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
                            control={formEditPessoa.control}
                            name={`enderecos.novoEndereco.${index}.numero`}
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
                            control={formEditPessoa.control}
                            name={`enderecos.novoEndereco.${index}.complemento`}
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
                            control={formEditPessoa.control}
                            name={`enderecos.novoEndereco.${index}.cep`}
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
                            onClick={() => removeNovoEndereco(index)}
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
                          appendNovoEndereco({
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
                Atualizar Pessoa
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
