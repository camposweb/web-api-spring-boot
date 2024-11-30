import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { Metadata } from 'next'
import GetUfs from './getUfs'

export const metadata: Metadata = {
  title: 'Uf',
  description: 'Lista de Ufs',
}

export default async function Uf() {
  const queryClient = new QueryClient()

  /*  await queryClient.prefetchQuery({
    queryKey: ['ufs'],
  })
 */
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <>
        <GetUfs />
      </>
    </HydrationBoundary>
  )
}
