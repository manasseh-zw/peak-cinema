import { useCallback, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'motion/react'
import type {SearchResult} from '@/lib/search';
import { SearchInput } from '@/components/search/SearchInput'
import { MovieModal } from '@/components/movie/MovieModal'
import { MoviePoster } from '@/components/movie/MoviePoster'
import {  searchMovies } from '@/lib/search'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const [results, setResults] = useState<Array<SearchResult>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFirstSearch, setIsFirstSearch] = useState(true)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<SearchResult | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setResults([])
        setHasSearched(false)
        setIsFirstSearch(true)
        return
      }

      // Only show loading state on first search (no existing results)
      const showLoadingState = results.length === 0
      if (showLoadingState) {
        setIsLoading(true)
      }
      setHasSearched(true)
      setIsFirstSearch(false)

      try {
        const data = await searchMovies({ data: { query, limit: 10 } })
        setResults(data)
      } catch (error) {
        console.error('Search error:', error)
        // Don't clear results on error - keep stale data
      } finally {
        setIsLoading(false)
      }
    },
    [results.length],
  )

  const handleMovieClick = (movie: SearchResult) => {
    setSelectedMovie(movie)
    setModalOpen(true)
  }

  const showResults = hasSearched && (results.length > 0 || isLoading)

  return (
    <main className="h-screen overflow-hidden bg-black grain-overlay flex flex-col">
      {/* Grain filter SVG */}
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
      <motion.section
        className="w-full px-4 shrink-0"
        initial={false}
        animate={{
          paddingTop: showResults ? '1.5rem' : '39vh',
          paddingBottom: showResults ? '1.5rem' : '2rem',
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Fancy italic text - Hidden when results showing */}
          <AnimatePresence>
            {!showResults && (
              <motion.p
                className="text-white/70 font-lora text-xl md:text-2xl"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
              >
                vibe search any movie
                <span className="block md:inline italic md:not-italic text-primary text-base md:text-2xl mt-1 md:mt-0">
                  {' '}(well... about 10k movies)
                </span>
              </motion.p>
            )}
          </AnimatePresence>

          {/* Search Input */}
          <SearchInput onSearch={handleSearch} isLoading={isLoading} />

          {/* No results - only show when done loading and truly empty */}
          {hasSearched &&
            !isLoading &&
            results.length === 0 &&
            !isFirstSearch && (
              <p className="text-muted-foreground text-sm">
                No movies found. Try a different vibe!
              </p>
            )}
        </div>
      </motion.section>

      {/* Results Grid - 5 columns with skeleton loaders */}
      {showResults && (
        <motion.section
          className="flex-1 px-6 pb-4 overflow-y-auto scrollbar-hide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
              {/* Show skeleton loaders on first search */}
              {isLoading && results.length === 0
                ? Array.from({ length: 10 }).map((_, index) => (
                    <motion.div
                      key={`skeleton-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className="aspect-2/3 bg-white/5 animate-pulse"
                    />
                  ))
                : results.map((movie, index) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                    >
                      <MoviePoster
                        movie={movie}
                        onClick={() => handleMovieClick(movie)}
                        className="w-full"
                      />
                    </motion.div>
                  ))}
            </div>
          </div>
        </motion.section>
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
