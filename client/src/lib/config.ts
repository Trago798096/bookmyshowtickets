interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Centralized config for environment variables
const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    key: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
  environment: {
    isProd: import.meta.env.PROD || false,
    isDev: !import.meta.env.PROD,
  },
  api: {
    baseUrl: '/api',
  }
};

export default config; 