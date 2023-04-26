export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PRIVATE_KONTENT_ENV_ID?: string
      PRIVATE_KONTENT_PREVIEW_API_KEY?: string
      PRIVATE_KONTENT_PREVIEW_SECRET?: string
      PRIVATE_KONTENT_MANAGEMENT_API_KEY?: string
    }
  }
}
