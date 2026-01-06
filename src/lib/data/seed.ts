import path from 'node:path'
import { Index } from '@upstash/vector'
import type { MovieVectorRecord } from '../types'
import { env } from '@/env'

const JSON_PATH = path.join(import.meta.dir, 'data.json')
const BATCH_SIZE = 100

const vectorIndex = new Index({
  url: env.UPSTASH_VECTOR_REST_URL,
  token: env.UPSTASH_VECTOR_REST_TOKEN,
})

function progressBar(current: number, total: number, width = 30): string {
  const percent = current / total
  const filled = Math.round(width * percent)
  const empty = width - filled
  const bar = '█'.repeat(filled) + '░'.repeat(empty)
  return `[${bar}] ${Math.round(percent * 100)}%`
}

async function main() {
  console.log('Peak Cinema - Upstash Seeder')
  console.log('━'.repeat(40))

  console.log('Loading movies from data.json...')
  const file = Bun.file(JSON_PATH)

  if (!(await file.exists())) {
    console.error('data.json not found! Run data.ts first:')
    console.error('  bun run src/lib/data/data.ts')
    process.exit(1)
  }

  const movies: Array<MovieVectorRecord> = await file.json()
  console.log(`Loaded ${movies.length.toLocaleString()} movies\n`)

  console.log('Starting upsert to Upstash...')
  const startTime = Date.now()

  let upserted = 0
  const totalBatches = Math.ceil(movies.length / BATCH_SIZE)

  for (let i = 0; i < movies.length; i += BATCH_SIZE) {
    const batch = movies.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1

    const upsertData = batch.map((movie) => ({
      id: movie.id,
      data: movie.data,
      metadata: movie.metadata,
    }))

    await vectorIndex.upsert(upsertData)
    upserted += batch.length

    const progress = progressBar(upserted, movies.length)
    const batchInfo = `Batch ${batchNum}/${totalBatches}`
    process.stdout.write(
      `\r  ${progress} | ${upserted.toLocaleString()}/${movies.length.toLocaleString()} | ${batchInfo}`,
    )
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)

  console.log('\n')
  console.log('━'.repeat(40))
  console.log(
    `Complete! Upserted ${upserted.toLocaleString()} movies in ${elapsed}s`,
  )
}

main().catch((error) => {
  console.error('\nError:', error)
  process.exit(1)
})
