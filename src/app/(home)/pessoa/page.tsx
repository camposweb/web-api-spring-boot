import { getListarUfsQueryKey } from '@/http/generated/uf/uf'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import GetUfs from '../uf/getUfs'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pessoa',
  description: 'Lista de Ufs',
}

export default async function Pessoa() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: getListarUfsQueryKey(),
    queryFn: GetUfs,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* <GetUfs /> */}
    </HydrationBoundary>
  )
}
