import type { PostContentItem } from '~/lib/kontent/models'
import type { HomePageProps } from '~/components/HomePage'
import { createPostSummary } from '~/lib/posts'

function createHomePageProps(posts: PostContentItem[]): HomePageProps {
  return {
    posts: posts.map((post) => createPostSummary(post))
  }
}

export { createHomePageProps }
