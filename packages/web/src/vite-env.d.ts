/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_AZURE_STORAGE_ACCOUNT: string;
  readonly VITE_AZURE_STORAGE_CONTAINER: string;
  readonly VITE_AZURE_STORAGE_SAS_TOKEN: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_URL: string;
  readonly VITE_API_URL: string;
  readonly VITE_ENABLE_SOCIAL_AUTH: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_DEBUG: string;
  readonly VITE_PATHFINITY_URL: string;
  readonly VITE_PATHFINITY_SSO_ENABLED: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
