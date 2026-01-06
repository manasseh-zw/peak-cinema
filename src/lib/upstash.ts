import { Index } from '@upstash/vector'
import { env } from '@/env'
import type { MovieVectorRecord } from './types'

export type MovieMetadata = MovieVectorRecord['metadata']

export const vectorIndex = new Index<MovieMetadata>({
  url: env.UPSTASH_VECTOR_REST_URL,
  token: env.UPSTASH_VECTOR_REST_TOKEN,
})
