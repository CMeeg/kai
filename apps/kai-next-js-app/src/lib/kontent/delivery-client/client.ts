import { DeliveryClient } from '@kontent-ai/delivery-sdk'
import type { IDeliveryClientConfig } from '@kontent-ai/delivery-sdk'

function createDeliveryClient(preview = false) {
  const config: IDeliveryClientConfig = {
    projectId: process.env.PRIVATE_KONTENT_PROJECT_ID ?? ''
  }

  if (preview) {
    config.previewApiKey = process.env.PRIVATE_KONTENT_PREVIEW_API_KEY
    config.defaultQueryConfig = {
      usePreviewMode: true
    }
  }

  return new DeliveryClient(config)
}

export { createDeliveryClient }
