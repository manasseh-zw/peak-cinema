#!/usr/bin/env bun
/**
 * Parses data.csv and generates data.json with stable IDs.
 * Run: bun run src/lib/data/data.ts
 */

import { parse } from 'csv-parse'
import { createReadStream, writeFileSync } from 'fs'
import path from 'path'
import type { RawMovieCsvRow, MovieVectorRecord } from '../types'

const CSV_PATH = path.join(import.meta.dir, 'data.csv')
const JSON_PATH = path.join(import.meta.dir, 'data.json')

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50)
}

async function parseCSV(): Promise<MovieVectorRecord[]> {
  console.log('Peak Cinema - CSV Parser')
  console.log('━'.repeat(40))
  console.log(`Reading from: ${CSV_PATH}`)

  const records: MovieVectorRecord[] = []

  const parser = createReadStream(CSV_PATH).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true, // Handle rows with inconsistent column counts
      relax_quotes: true, // Handle malformed quotes
    }),
  )

  for await (const row of parser as AsyncIterable<RawMovieCsvRow>) {
    // Skip rows with empty overview (nothing to embed)
    if (!row.Overview?.trim()) continue

    // Create a stable ID based on title + release date
    const id = `movie-${slugify(row.Title)}-${row.Release_Date}`

    const record: MovieVectorRecord = {
      id,
      data: row.Overview,
      metadata: {
        title: row.Title,
        releaseDate: row.Release_Date,
        genres: row.Genre ? row.Genre.split(',').map((g) => g.trim()) : [],
        posterUrl: row.Poster_Url,
        popularity: parseFloat(row.Popularity) || undefined,
        voteCount: parseInt(row.Vote_Count) || undefined,
        voteAverage: parseFloat(row.Vote_Average) || undefined,
        originalLanguage: row.Original_Language,
      },
    }
    records.push(record)

    if (records.length % 1000 === 0) {
      console.log(`  Parsed ${records.length.toLocaleString()} movies...`)
    }
  }

  return records
}

async function main() {
  try {
    const records = await parseCSV()

    console.log(`\nWriting ${records.length.toLocaleString()} records to JSON...`)
    writeFileSync(JSON_PATH, JSON.stringify(records, null, 2))

    const stats = {
      totalRecords: records.length,
      fileSizeMB: (Buffer.byteLength(JSON.stringify(records)) / 1024 / 1024).toFixed(2),
    }

    console.log('\nComplete!')
    console.log(`  Records: ${stats.totalRecords.toLocaleString()}`)
    console.log(`  Output:  ${JSON_PATH}`)
    console.log(`  Size:    ${stats.fileSizeMB} MB`)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()
