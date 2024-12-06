import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { Metadata } from 'next'
import Bairro from './bairro'

export const metadata: Metadata = {
  title: 'Bairro',
  description: 'Lista de Bairros',
}

export default async function PageBairro() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['bairros'],
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <>
        <Bairro />
      </>
    </HydrationBoundary>
  )
}
