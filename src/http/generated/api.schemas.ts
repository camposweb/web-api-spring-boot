/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * Bootcamp Java - Spring Boot
 * API para o Bootcamp Java - Spring Boot | Projeto desenvolvido como desafio final do bootcamp java com spring boot da Squadra
 * OpenAPI spec version: 1.0.0
 */
export type ListarBairrosParams = {
  codigoBairro?: number
  codigoMunicipio?: number
  nome?: string
  status?: number
}

export type ListarMunicipiosParams = {
  codigoMunicipio?: number
  codigoUf?: number
  nome?: string
  status?: number
}

export type ListarPessoasParams = {
  codigoPessoa?: number
  login?: string
  status?: number
}

export type ListarUfsParams = {
  codigoUf?: number
  sigla?: string
  nome?: string
  status?: number
}

export interface DeletarBairroDTO {
  codigoBairro: number
}

export interface DeletarMunicipioDTO {
  codigoMunicipio: number
}

export interface DeletarPessoaDTO {
  codigoPessoa: number
}

export interface DeletarUfDTO {
  codigoUf: number
}

export interface BairroDTO {
  codigoMunicipio: number
  /** @pattern ^[a-zA-ZÀ-ÖØ-öø-ÿÇç ]+$ */
  nome: string
  status: number
}

export interface MunicipioDTO {
  codigoUf: number
  /** @pattern ^[a-zA-ZÀ-ÖØ-öø-ÿÇç ]+$ */
  nome: string
  status: number
}

export interface UfDTO {
  /** @pattern ^[a-zA-ZÀ-ÖØ-öø-ÿÇç ]+$ */
  nome: string
  /** @pattern ^[a-zA-ZÀ-ÖØ-öø-ÿÇç ]+$ */
  sigla: string
  status: number
}

export interface ListaBairroDTO {
  codigoBairro?: number
  codigoMunicipio?: number
  nome?: string
  status?: number
}

export interface AtualizacaoBairroDTO {
  codigoBairro: number
  codigoMunicipio: number
  /** @pattern ^[a-zA-ZÀ-ÖØ-öø-ÿÇç ]+$ */
  nome: string
  status: number
}

export interface ListaMunicipioDTO {
  codigoMunicipio?: number
  codigoUf?: number
  nome?: string
  status?: number
}

export interface AtualizacaoMunicipioDTO {
  codigoMunicipio: number
  codigoUf: number
  /** @pattern ^[a-zA-ZÀ-ÖØ-öø-ÿÇç ]+$ */
  nome: string
  status: number
}

export interface EnderecoDTO {
  cep: string
  codigoBairro: number
  complemento: string
  nomeRua: string
  numero: string
}

export interface PessoaDTO {
  enderecos: EnderecoDTO[]
  /**
   * @minimum 1
   * @maximum 150
   */
  idade: number
  login: string
  /** @pattern ^[a-zA-ZÀ-ÖØ-öø-ÿÇç ]+$ */
  nome: string
  senha: string
  /** @pattern ^[a-zA-ZÀ-ÖØ-öø-ÿÇç ]+$ */
  sobrenome: string
  status: number
}

export interface ListaPessoaDTO {
  codigoPessoa?: number
  enderecos?: EnderecoDTO[]
  idade?: number
  login?: string
  nome?: string
  senha?: string
  sobrenome?: string
  status?: number
}

export interface AtualizacaoEnderecoDTO {
  cep: string
  codigoBairro: number
  codigoEndereco?: number
  codigoPessoa: number
  complemento?: string | undefined
  nomeRua: string
  numero: string
}

export interface AtualizacaoPessoaDTO {
  codigoPessoa: number
  enderecos: AtualizacaoEnderecoDTO[]
  /**
   * @minimum 1
   * @maximum 150
   */
  idade: number | string
  login: string
  /** @pattern ^[a-zA-ZÀ-ÖØ-öø-ÿÇç ]+$ */
  nome: string
  senha: string
  /** @pattern ^[a-zA-ZÀ-ÖØ-öø-ÿÇç ]+$ */
  sobrenome: string
  status: number
}

export interface AtualizacaoUfDTO {
  codigoUf: number
  /** @pattern ^[a-zA-ZÀ-ÖØ-öø-ÿÇç ]+$ */
  nome: string
  /** @pattern ^[a-zA-ZÀ-ÖØ-öø-ÿÇç ]+$ */
  sigla: string
  status: number
}
export interface ListaUfDTO {
  codigoUf?: number
  nome?: string
  sigla?: string
  status?: number
}
export interface DetalhamentoEnderecoDTO {
  bairro?: ListaBairroDTO
  cep?: string
  codigoBairro?: number
  codigoEndereco?: number
  codigoPessoa?: number
  complemento?: string
  municipio?: ListaMunicipioDTO
  nomeRua?: string
  numero?: string
  uf?: ListaUfDTO
}

export interface DetalhamentoPessoaDTO {
  codigoPessoa?: number
  enderecos?: DetalhamentoEnderecoDTO[]
  idade?: number
  login?: string
  nome?: string
  senha?: string
  sobrenome?: string
  status?: number
}
