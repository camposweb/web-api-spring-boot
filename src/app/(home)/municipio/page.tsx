import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { Metadata } from 'next'
import Municipio from './municipio'

export const metadata: Metadata = {
  title: 'Município',
  description: 'Lista de municípios',
}

export default async function PageMunicipio() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['municipios'],
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <>
        <Municipio />
      </>
    </HydrationBoundary>
  )
}
