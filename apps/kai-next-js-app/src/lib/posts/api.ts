import { DeliveryClient } from '@kontent-ai/delivery-sdk'
import { contentTypes } from '~/lib/kontent/models'
import type { PostContentItem } from '~/lib/kontent/models'
import { fetchContentItems } from '~/lib/kontent/delivery-client'

async function getPosts(deliveryClient: DeliveryClient) {
  const query = deliveryClient
    .items<PostContentItem>()
    .type(contentTypes.post.codename)
    .orderByDescending(`elements.${contentTypes.post.elements.date.codename}`)

  return await fetchContentItems(query)
}

function createPostsApi(deliveryClient: DeliveryClient) {
  return {
    getPosts: async () => await getPosts(deliveryClient)
  }
}

export { createPostsApi }
