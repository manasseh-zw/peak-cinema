import { Index } from '@upstash/vector'
import type { MovieVectorRecord } from './types'
import { env } from '@/env'

export type MovieMetadata = MovieVectorRecord['metadata']

export const vectorIndex = new Index<MovieMetadata>({
  url: env.UPSTASH_VECTOR_REST_URL,
  token: env.UPSTASH_VECTOR_REST_TOKEN,
})
