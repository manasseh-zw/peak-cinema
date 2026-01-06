import { MovieCard } from './MovieCard'
import type { SearchResult } from '@/lib/search'

interface SearchResultsProps {
  results: SearchResult[]
  isLoading?: boolean
  hasSearched?: boolean
  onMovieClick?: (movie: SearchResult) => void
}

export function SearchResults({
  results,
  isLoading = false,
  hasSearched = false,
  onMovieClick,
}: SearchResultsProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="aspect-2/3 rounded-lg bg-card/30 animate-pulse"
          />
        ))}
      </div>
    )
  }

  // Empty state - no search yet
  if (!hasSearched) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg">Start typing to search movies by vibes</p>
        <p className="text-sm mt-2">
          Try something like "cozy romantic comedy" or "intense sci-fi thriller"
        </p>
      </div>
    )
  }

  // No results
  if (results.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg">No movies found</p>
        <p className="text-sm mt-2">Try a different search term</p>
      </div>
    )
  }

  // Results grid
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {results.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onClick={() => onMovieClick?.(movie)}
        />
      ))}
    </div>
  )
}
