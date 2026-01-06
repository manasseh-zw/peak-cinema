function getEnvVar(key: string, required: boolean = true): string {
  const value = process.env[key]

  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }

  return value ?? ''
}

export const env = {
  get UPSTASH_VECTOR_REST_URL() {
    return getEnvVar('UPSTASH_VECTOR_REST_URL')
  },
  get UPSTASH_VECTOR_REST_TOKEN() {
    return getEnvVar('UPSTASH_VECTOR_REST_TOKEN')
  },

  get NODE_ENV() {
    return getEnvVar('NODE_ENV', false) || 'development'
  },

  get isDev() {
    return this.NODE_ENV === 'development'
  },
  get isProd() {
    return this.NODE_ENV === 'production'
  },
} as const

export function validateEnv(): void {
  const required = [
    'UPSTASH_VECTOR_REST_URL',
    'UPSTASH_VECTOR_REST_TOKEN',
  ] as const

  const missing: Array<string> = []

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key)
    }
  }

  if (missing.length > 0) {
    console.error('Missing required environment variables:\n')
    missing.forEach((key) => console.error(`   - ${key}`))
    console.error('\n   Please add them to your .env.local file.\n')
    throw new Error(`Missing environment variables: ${missing.join(', ')}`)
  }
}

// Type for external use
export type Env = typeof env
