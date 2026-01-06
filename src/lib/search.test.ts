import {  vectorIndex } from './upstash'
import type {MovieMetadata} from './upstash';

const testQueries = [
  'action movie with explosions',
  'romantic comedy',
  'sci-fi space adventure',
  'horror scary thriller',
  'animated family film',
]

async function runSearchTest() {
  console.log('🎬 Peak Cinema Search Test\n')
  console.log('='.repeat(50))

  for (const query of testQueries) {
    console.log(`\n🔍 Query: "${query}"`)
    console.log('-'.repeat(40))

    try {
      const results = await vectorIndex.query({
        data: query,
        topK: 3,
        includeMetadata: true,
      })

      if (results.length === 0) {
        console.log('   No results found')
        continue
      }

      results.forEach((result, index) => {
        const metadata = result.metadata as MovieMetadata
        console.log(
          `${index + 1}. ${metadata.title} (${metadata.releaseDate?.slice(0, 4) ?? 'N/A'})`,
        )
        console.log(`Score: ${result.score.toFixed(4)}`)
        console.log(`Genres: ${metadata.genres?.join(', ') ?? 'N/A'}`)
      })
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : error}`)
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('✅ Search test completed!')
}

runSearchTest().catch(console.error)
