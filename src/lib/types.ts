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
