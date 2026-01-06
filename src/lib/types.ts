export type MovieVectorRecord = {
  id: string

  data: string

  metadata: {
    title: string
    releaseDate: string
    genres: Array<string>
    posterUrl: string

    popularity?: number
    voteCount?: number
    voteAverage?: number
    originalLanguage?: string
  }
}

export type RawMovieCsvRow = {
  Release_Date: string
  Title: string
  Overview: string
  Popularity: string
  Vote_Count: string
  Vote_Average: string
  Original_Language: string
  Genre: string
  Poster_Url: string
}

export type ParsedMovie = {
  releaseDate: string // ISO date
  title: string
  overview: string
  popularity: number
  voteCount: number
  voteAverage: number
  originalLanguage: string
  genres: Array<string>
  posterUrl: string
}
