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
  codigoUF?: number
  nome?: string
  status?: number
}

export type ListarPessoasParams = {
  codigoPessoa?: number
  login?: string
  status?: number
}

export type ListarUfsParams = {
  codigoUF?: number
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

export interface DeletarUFDTO {
  codigoUF: number
}

export interface BairroDTO {
  codigoMunicipio: number
  nome: string
  status: number
}

export interface MunicipioDTO {
  codigoUF: number
  /** @pattern ^[a-zA-ZÀ-ÖØ-öø-ÿÇç ]+$ */
  nome: string
  status: number
}

export interface Ufdto {
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
  nome: string
  status: number
}

export interface ListaMunicipioDTO {
  codigoMunicipio?: number
  codigoUF?: number
  nome?: string
  status?: number
}

export interface AtualizacaoMunicipioDTO {
  codigoMunicipio: number
  codigoUF: number
  /** @pattern ^[a-zA-ZÀ-ÖØ-öø-ÿÇç ]+$ */
  nome: string
  status: number
}

export interface EnderecoDTO {
  cep: string
  codigoBairro: number
  complemento?: string | null
  nomeRua: string
  numero: string
}

export interface PessoaDTO {
  enderecos: EnderecoDTO[]
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
  complemento?: string | null
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

export interface ListaUFDTO {
  codigoUF?: number
  nome?: string
  sigla?: string
  status?: number
}

export interface AtualizacaoUFDTO {
  codigoUF: number
  /** @pattern ^[a-zA-ZÀ-ÖØ-öø-ÿÇç ]+$ */
  nome: string
  /** @pattern ^[a-zA-ZÀ-ÖØ-öø-ÿÇç ]+$ */
  sigla: string
  status: number
}

export interface DetalhamentoEnderecoDTO {
  bairro?: ListaBairroDTO
  cep?: string
  codigoBairro?: number
  codigoEndereco?: number
  codigoPessoa?: number
  complemento?: string | null
  municipio?: ListaMunicipioDTO
  nomeRua?: string
  numero?: string
  uf?: ListaUFDTO
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
