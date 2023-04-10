import type { PostContentItem } from '~/lib/kontent/models'
import { createPostSummary } from '~/lib/posts'

function createHeroPostProps(post: PostContentItem) {
  return {
    post: createPostSummary(post)
  }
}

export { createHeroPostProps }
