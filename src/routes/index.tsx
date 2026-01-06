import { useState, useCallback } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { SearchInput } from '@/components/search/SearchInput'
import { SearchResults } from '@/components/search/SearchResults'
import { MovieModal } from '@/components/movie/MovieModal'
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
      const data = await searchMovies({ data: { query, limit: 20 } })
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

  return (
    <main className="min-h-screen bg-black grain-overlay">
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

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Title with gradient */}
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="bg-linear-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
              Search by Vibes
            </span>
          </h1>

          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Discover movies that match your mood. Describe what you're feeling and let AI find the perfect watch.
          </p>

          {/* Search Input */}
          <div className="pt-4">
            <SearchInput onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <SearchResults
            results={results}
            isLoading={isLoading}
            hasSearched={hasSearched}
            onMovieClick={handleMovieClick}
          />
        </div>
      </section>

      {/* Movie Modal */}
      <MovieModal
        movie={selectedMovie}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </main>
  )
}
