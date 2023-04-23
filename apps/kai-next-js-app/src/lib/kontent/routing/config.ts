import type { ContentItemUrlResolverConfig } from '@meeg/kai-delivery'
import { PostContentItem, contentTypes } from '~/lib/kontent/models'

const routeConfig: ContentItemUrlResolverConfig = {
  [contentTypes.home.codename]: {
    template: '/'
  },
  [contentTypes.post.codename]: {
    template: '/posts/{slug}',
    // TODO: Make this generic?
    createUrlParams: (contentItem: PostContentItem) => ({
      slug: contentItem.elements.slug.value
    })
  }
}

export { routeConfig }
