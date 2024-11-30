import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    input: 'http://146.235.29.16:8080/v3/api-docs',
    output: {
      target: './src/http/generated/api.ts',
      httpClient: 'axios',
      client: 'react-query',
      mode: 'tags-split',
      baseUrl: 'http://146.235.29.16:8080/',
    },
  },
})
