import { Search } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { DetalhamentoPessoaDTO } from '@/http/generated/api.schemas'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'

export function DetailPessoa({
  codigoPessoa,
  nome,
  sobrenome,
  idade,
  login,
  senha,
  status,
  enderecos,
}: DetalhamentoPessoaDTO) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex p-4">
          <Search />
          Detalhamento Pessoa
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhamento Pessoa</DialogTitle>
          <DialogDescription>Detalhamento de Pessoa</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[450px] pl-0 pr-4 pt-0">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold text-black">
                Código Pessoa
              </span>
              <span className="text-sm text-black">{codigoPessoa}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold text-black">Nome</span>
              <span className="text-sm text-black">{nome}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold text-black">Sobrenome</span>
              <span className="text-sm text-black">{sobrenome}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold text-black">Idade</span>
              <span className="text-sm text-black">{idade}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold text-black">Login</span>
              <span className="text-sm text-black">{login}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold text-black">Senha</span>
              <span className="text-sm text-black">{senha}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold text-black">Status</span>
              <span className="text-sm text-black">
                {status === 1 ? (
                  <Badge className="bg-green-500 hover:bg-green-500">
                    ATIVADO
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="hover:bg-red-600">
                    DESATIVADO
                  </Badge>
                )}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold text-black">Endereços</span>
              <span className="text-xs">
                O codigoEndereco está identificando o nome de cada objeto da
                lista de enderecos
              </span>
              {enderecos &&
                enderecos.map((endereco) => (
                  <div
                    className="text-sm text-black"
                    key={endereco.codigoEndereco}
                  >
                    <section className="mb-2 flex flex-col rounded-md border p-2">
                      <span>
                        <strong>Endereco:</strong> {endereco.codigoEndereco}
                      </span>
                      <span>
                        <strong>Rua:</strong> {endereco.nomeRua}
                      </span>
                      <span>
                        <strong>Complemento:</strong> {endereco.complemento}
                      </span>
                      <span>
                        <strong>Numero:</strong> {endereco.numero}
                      </span>
                      <span>
                        <strong>CEP:</strong> {endereco.cep}
                      </span>
                      <section className="mt-2 flex flex-col">
                        <span>
                          <strong>Bairro: </strong>
                        </span>
                        <span>
                          Código Bairro: {endereco.bairro?.codigoBairro}
                        </span>
                        <span>
                          Código Município: {endereco.bairro?.codigoMunicipio}
                        </span>
                        <span>Nome Bairro: {endereco.bairro?.nome}</span>
                        <span>
                          Status Bairro:{' '}
                          {endereco.bairro?.status === 1 ? (
                            <Badge className="bg-green-500 hover:bg-green-500">
                              ATIVADO
                            </Badge>
                          ) : (
                            <Badge
                              variant="destructive"
                              className="hover:bg-red-600"
                            >
                              DESATIVADO
                            </Badge>
                          )}
                        </span>
                      </section>
                      <section className="mt-2 flex flex-col">
                        <span>
                          <strong>Município: </strong>
                        </span>
                        <span>
                          Código Município:{' '}
                          {endereco.municipio?.codigoMunicipio}
                        </span>
                        <span>Código UF: {endereco.municipio?.codigoUF}</span>
                        <span>Nome Município: {endereco.municipio?.nome}</span>
                        <span>
                          Status Município:{' '}
                          {endereco.municipio?.status === 1 ? (
                            <Badge className="bg-green-500 hover:bg-green-500">
                              ATIVADO
                            </Badge>
                          ) : (
                            <Badge
                              variant="destructive"
                              className="hover:bg-red-600"
                            >
                              DESATIVADO
                            </Badge>
                          )}
                        </span>
                      </section>
                      <section className="mt-2 flex flex-col">
                        <span>
                          <strong>UF: </strong>
                        </span>
                        <span>Código UF: {endereco.uf?.codigoUF}</span>
                        <span>Sigla UF: {endereco.uf?.sigla}</span>
                        <span>Nome UF: {endereco.uf?.nome}</span>
                        <span>
                          Status UF:{' '}
                          {endereco.uf?.status === 1 ? (
                            <Badge className="bg-green-500 hover:bg-green-500">
                              ATIVADO
                            </Badge>
                          ) : (
                            <Badge
                              variant="destructive"
                              className="hover:bg-red-600"
                            >
                              DESATIVADO
                            </Badge>
                          )}
                        </span>
                      </section>
                    </section>
                  </div>
                ))}
            </div>
          </div>
        </ScrollArea>
        <DialogClose>
          <Button className="mt-4 w-full text-sm font-bold">Sair</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
