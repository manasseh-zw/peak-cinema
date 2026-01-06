import { useState, useCallback } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { SearchInput } from '@/components/search/SearchInput'
import { MovieModal } from '@/components/movie/MovieModal'
import { MoviePoster } from '@/components/movie/MoviePoster'
import { searchMovies, type SearchResult } from '@/lib/search'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<SearchResult | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([])
      setHasSearched(false)
      return
    }

    setIsLoading(true)
    setHasSearched(true)

    try {
      const data = await searchMovies({ data: { query, limit: 10 } })
      setResults(data)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleMovieClick = (movie: SearchResult) => {
    setSelectedMovie(movie)
    setModalOpen(true)
  }

  const showResults = hasSearched && results.length > 0

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
        className="w-full px-4 flex-shrink-0"
        initial={false}
        animate={{
          paddingTop: showResults ? '1.5rem' : '30vh',
          paddingBottom: showResults ? '1rem' : '2rem',
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Fancy italic text */}
          <motion.p
            className="text-white/80 font-extralight font-serif italic text-xl md:text-3xl"
            animate={{ 
              opacity: showResults ? 0.5 : 1,
              scale: showResults ? 0.9 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            Vibe search any movie
          </motion.p>

          {/* Search Input */}
          <SearchInput onSearch={handleSearch} isLoading={isLoading} />

          {/* Loading indicator */}
          {isLoading && (
            <p className="text-muted-foreground text-sm animate-pulse">
              Finding movies...
            </p>
          )}

          {/* No results */}
          {hasSearched && !isLoading && results.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No movies found. Try a different vibe!
            </p>
          )}
        </div>
      </motion.section>

      {/* Results Grid - 5 columns, 2 rows visible, scrollable */}
      {showResults && (
        <motion.section
          className="flex-1 px-6 pb-4 overflow-y-auto scrollbar-hide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-5 gap-3">
              {results.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
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
