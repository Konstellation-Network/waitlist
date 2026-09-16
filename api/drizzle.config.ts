import { defineConfig } from 'drizzle-kit';

// Load ./.env when present (Node >= 20.12 built-in, no dotenv dependency).
try {
  process.loadEnvFile('.env');
} catch {
  // .env is optional — DATABASE_URL may already be in the environment.
}

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error('DATABASE_URL is not set');
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: { url },
});
