import type { PostContentItem } from '~/lib/kontent/models'
import { createPostSummary } from '~/lib/posts'
import type { MoreStoriesProps } from './MoreStories'

function createMoreStoriesProps(posts: PostContentItem[]): MoreStoriesProps {
  return {
    posts: posts.map((post) => createPostSummary(post))
  }
}

export { createMoreStoriesProps }
