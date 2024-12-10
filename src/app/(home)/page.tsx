import { Github } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="w-full gap-4 rounded-md bg-secondary p-4">
      <h1 className="text-xl">
        👋 <strong>Olá, me chamo Leandro Campos</strong>, irei explicar a
        proposta do desenvolvimento desta aplicação chamada{' '}
        <strong>Web SpringBoot</strong>
      </h1>
      <p className="mt-4">
        Este projeto foi desenvolvido a partir do desafio final do{' '}
        <strong>Bootcamp Java - Spring Boot</strong> realizado pela empresa
        Squadra
      </p>
      <p className="mt-4">
        A proposta do desafio final foi desenvolver uma API em JAVA com Spring
        Boot Web com JPA, que permita a criação, leitura, atualização e exclusão
        de dados.
      </p>
      <p className="mt-4">
        Como algo adicional e no qual também o professor incentivou a
        desenvolver o Front End, como tenho um bom conhecimento com e front end
        topei o desafio.
      </p>
      <p className="mt-4">
        O projeto Front End foi desenvolvido com as seguintes tecnologias:
        NextJS 14, React Query para gereciamento de estado, ZOD para validação
        de formulários e Shadcn/ui para desenvolver os componentes com um visual
        pré-definido ajudando no desenvimento mais eficiente da aplicação.
      </p>
      <h3 className="mt-4 font-semibold">
        Para conhecer de forma mais profunda o projeto segue o link do
        respositório :
      </h3>
      <div className="flex flex-row gap-4">
        <Link
          href={'https://github.com/camposweb/api-spring-boot'}
          target="_blank"
          className="flex w-52 items-center justify-center rounded-md border border-black p-1 transition hover:bg-black hover:text-white"
        >
          Respositório back-end
        </Link>
        <Link
          href={''}
          target="_blank"
          className="flex w-52 items-center justify-center rounded-md border border-black p-1 transition hover:bg-black hover:text-white"
        >
          Respositório front-end
        </Link>
      </div>
      <h3 className="mt-4 font-semibold">Contato:</h3>
      <Link
        href={'https://www.linkedin.com/in/camposdev/'}
        target="_blank"
        className="flex w-52 items-center justify-center rounded-md border border-black p-1 transition hover:bg-black hover:text-white"
      >
        Linkedin
      </Link>
    </div>
  )
}
