import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { Metadata } from 'next'
import Pessoa from './pessoa'

export const metadata: Metadata = {
  title: 'Pessoa',
  description: 'Lista de Pessoas',
}

export default async function PagePessoa() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['pessoas'],
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <>
        <Pessoa />
      </>
    </HydrationBoundary>
  )
}
