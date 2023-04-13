import { DeliveryClient } from '@kontent-ai/delivery-sdk'
import type { HomeContentItem } from '~/lib/kontent/models'

function createHomeQuery(deliveryClient: DeliveryClient) {
  return deliveryClient.item<HomeContentItem>('home')
}

export { createHomeQuery }
