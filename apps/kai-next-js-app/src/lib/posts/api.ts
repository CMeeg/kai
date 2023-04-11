import { DeliveryClient } from '@kontent-ai/delivery-sdk'
import { contentTypes } from '~/lib/kontent/models'
import type { PostContentItem } from '~/lib/kontent/models'

function createAllPostsQuery(deliveryClient: DeliveryClient) {
  return deliveryClient
    .items<PostContentItem>()
    .type(contentTypes.post.codename)
    .orderByDescending(`elements.${contentTypes.post.elements.date.codename}`)
}

export { createAllPostsQuery }
