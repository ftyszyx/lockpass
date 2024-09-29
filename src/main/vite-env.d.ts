/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly GOOGLE_CLIENT_SECRET: string
  readonly ALIYUN_CLIENT_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
