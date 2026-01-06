import { createServerFn } from '@tanstack/react-start'
import { vectorIndex, type MovieMetadata } from './upstash'

export type SearchResult = {
  id: string
  score: number
  metadata: MovieMetadata
}

export const searchMovies = createServerFn({ method: 'GET' })
  .inputValidator((input: { query: string; limit?: number }) => {
    if (!input.query || input.query.trim().length === 0) {
      throw new Error('Query is required')
    }
    if (input.query.length > 500) {
      throw new Error('Query too long (max 500 characters)')
    }
    return {
      query: input.query.trim(),
      limit: Math.min(Math.max(input.limit ?? 10, 1), 20),
    }
  })
  .handler(async ({data}) => {
    const results = await vectorIndex.query({
      data: data.query,
      topK: data.limit,
      includeMetadata: true,
    })

    return results.map((result) => ({
      id: result.id as string,
      score: result.score,
      metadata: result.metadata as MovieMetadata,
    })) as SearchResult[]
  })

