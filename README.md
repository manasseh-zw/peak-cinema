# Peak Cinema

A semantic movie search engine that lets you find movies by describing the vibe you're looking for. Built with React, TanStack Start, and Upstash Vector for AI-powered semantic search.

## Features

- Semantic search using natural language queries
- Real-time search with debounced input
- Responsive grid layout with movie posters
- Movie details modal with metadata display
- Dark theme with grain texture overlay

## Tech Stack

- React 19 with TanStack Start
- Upstash Vector for semantic search embeddings
- Motion for animations
- Tailwind CSS v4 for styling
- Bun as runtime and package manager

## Installation

1. Clone the repository:

```bash
git clone https://github.com/manasseh-zw/peak-cinema.git
cd peak-cinema
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables (see Upstash Setup below)

4. Run the development server:

```bash
bun run dev
```

## Upstash Setup

This project uses Upstash Vector for semantic movie search. You need to create an Upstash Vector index and seed it with movie data.

### Create Vector Index

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Vector index
3. Select an embedding model (the project uses the default text embedding)
4. Copy your REST URL and REST Token

### Environment Variables

Create a `.env.local` file in the root directory:

```
UPSTASH_VECTOR_REST_URL=your_vector_rest_url
UPSTASH_VECTOR_REST_TOKEN=your_vector_rest_token
```

### Seed the Database

The project includes movie data and a seeding script:

1. Parse movie data (if needed):

```bash
bun run data:parse
```

2. Seed the vector database:

```bash
bun run data:seed
```

This will upload movie embeddings to your Upstash Vector index.

## Project Structure

```
src/
  components/
    movie/          # MovieModal, MoviePoster
    search/         # SearchInput
    ui/             # Reusable UI components
  lib/
    data/           # Data parsing and seeding scripts
    search.ts       # Search server function
    upstash.ts      # Upstash client configuration
  routes/
    index.tsx       # Main search page
    __root.tsx      # Root layout
```

## Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run data:parse` - Parse CSV movie data to JSON
- `bun run data:seed` - Seed Upstash Vector with movie embeddings
- `bun run test:search` - Test search functionality

## License

MIT
