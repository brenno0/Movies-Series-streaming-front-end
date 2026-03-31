import { defineConfig } from '@kubb/core'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginReactQuery } from '@kubb/plugin-react-query'
import { pluginTs } from '@kubb/plugin-ts'

export default defineConfig({
  name: 'nbflixapi',
  root: '.',
  input: {
    path: 'http://localhost:3333/docs/json',
  },
  output: {
    path: './src/gen',
  },
  plugins: [
    pluginOas(),
    pluginTs(),
    pluginReactQuery({
      output: {
        path: './hooks',
      },
      client: {
        dataReturnType: 'full',
        importPath: '../lib/kubb-api-client.ts',
      },
      query: {
        importPath: '@tanstack/react-query',
      },
      suspense: {},
    }),
  ],
})
