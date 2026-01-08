import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import type { SearchResult } from '@/lib/search'
import { SearchInput } from '@/components/search/SearchInput'
import { MovieModal } from '@/components/movie/MovieModal'
import { MoviePoster } from '@/components/movie/MoviePoster'
import { searchMovies } from '@/lib/search'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const [query, setQuery] = useState('')
  const [selectedMovie, setSelectedMovie] = useState<SearchResult | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const {
    data: results,
    isPending,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchMovies({ data: { query, limit: 10 } }),
    enabled: !!query,
    staleTime: 1000 * 60 * 10,
    placeholderData: (previousData) => previousData,
  })

  const hasSearched = !!query
  const isLoading = isPending && hasSearched
  const showResults = hasSearched && (!!results || isLoading)

  const handleMovieClick = (movie: SearchResult) => {
    setSelectedMovie(movie)
    setModalOpen(true)
  }

  return (
    <main className="h-screen overflow-hidden bg-black grain-overlay flex flex-col">
      <svg className="absolute w-0 h-0">
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.6"
            stitchTiles="stitch"
          />
        </filter>
      </svg>

      {/* Search Section - Animated position */}
      <section
        className={`w-full px-4 shrink-0 transition-[padding-top,padding-bottom] duration-[400ms] ease-out ${
          showResults ? 'pt-6 pb-6' : 'pt-[39vh] pb-8'
        }`}
      >
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Fancy italic text - Hidden when results showing */}
          {!showResults && (
            <p className="text-white/70 font-lora text-xl md:text-2xl animate-fade-in-down">
              vibe search any movie
              <span className="block md:inline italic md:not-italic text-primary text-base md:text-2xl mt-1 md:mt-0">
                {' '}(well... about 10k movies)
              </span>
            </p>
          )}

          {/* Search Input */}
          <SearchInput onSearch={setQuery} isLoading={isFetching} />

          {/* No results - only show when done loading and truly empty */}
          {hasSearched &&
            !isPending &&
            !isFetching &&
            results?.length === 0 &&
            !isError && (
              <p className="text-muted-foreground text-sm">
                No movies found. Try a different vibe!
              </p>
            )}
            {isError && (
               <p className="text-red-400 text-sm">
                 Something went wrong. Please try again.
               </p>
            )}
        </div>
      </section>

      {/* Results Grid - 5 columns with skeleton loaders */}
      {showResults && (
        <section
          className="flex-1 px-6 pb-4 overflow-y-auto scrollbar-hide animate-fade-in-up"
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
              {/* Show skeleton loaders on first search */}
              {isLoading
                ? Array.from({ length: 10 }).map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="aspect-2/3 bg-white/5 animate-pulse animate-fade-in"
                      style={{
                        animationDelay: `${index * 0.03}s`,
                        animationFillMode: 'both',
                      }}
                    />
                  ))
                : results?.map((movie, index) => (
                    <div
                      key={movie.id}
                      className="animate-fade-in-scale"
                      style={{
                        animationDelay: `${index * 0.03}s`,
                        animationFillMode: 'both',
                      }}
                    >
                      <MoviePoster
                        movie={movie}
                        onClick={() => handleMovieClick(movie)}
                        className="w-full"
                      />
                    </div>
                  ))}
            </div>
          </div>
        </section>
      )}

      {/* Movie Modal */}
      <MovieModal
        movie={selectedMovie}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </main>
  )
}
