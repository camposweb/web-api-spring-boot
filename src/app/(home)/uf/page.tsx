import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { Metadata } from 'next'
import Uf from './uf'

export const metadata: Metadata = {
  title: 'Uf',
  description: 'Lista de Ufs',
}

export default async function PageUf() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['ufs'],
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <>
        <Uf />
      </>
    </HydrationBoundary>
  )
}
