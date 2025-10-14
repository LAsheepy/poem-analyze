/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_AI_SERVICE_URL: string
  readonly VITE_AI_API_KEY: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_DEV_SERVER_PORT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}