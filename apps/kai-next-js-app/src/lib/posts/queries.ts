import { DeliveryClient } from '@kontent-ai/delivery-sdk'
import { contentTypes } from '~/lib/kontent/models'
import type { PostContentItem } from '~/lib/kontent/models'

function createAllPostsQuery(deliveryClient: DeliveryClient) {
  return deliveryClient
    .items<PostContentItem>()
    .type(contentTypes.post.codename)
    .orderByDescending(`elements.${contentTypes.post.elements.date.codename}`)
}

function createPostsWithSlugQuery(
  deliveryClient: DeliveryClient,
  slug: string
) {
  return deliveryClient
    .items<PostContentItem>()
    .type(contentTypes.post.codename)
    .equalsFilter(`elements.${contentTypes.post.elements.slug.codename}`, slug)
}

function createMorePostsForSlugQuery(
  deliveryClient: DeliveryClient,
  slug: string
) {
  return createAllPostsQuery(deliveryClient)
    .notEqualsFilter(
      `elements.${contentTypes.post.elements.slug.codename}`,
      slug
    )
    .limitParameter(2)
}

function createAllPostsSlugsQuery(deliveryClient: DeliveryClient) {
  return createAllPostsQuery(deliveryClient).elementsParameter([
    contentTypes.post.elements.slug.codename
  ])
}

export {
  createAllPostsQuery,
  createPostsWithSlugQuery,
  createMorePostsForSlugQuery,
  createAllPostsSlugsQuery
}
