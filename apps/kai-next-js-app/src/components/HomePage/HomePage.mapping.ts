import type { PostContentItem } from '~/lib/kontent/models'
import type { HomePageProps } from './HomePage'
import { createHeroPostProps } from './HeroPost.mapping'
import { createMoreStoriesProps } from '~/components/MoreStories/MoreStories.mapping'

function createHomePageProps(posts: PostContentItem[]): HomePageProps {
  const heroPost = createHeroPostProps(posts[0])

  const morePosts = createMoreStoriesProps(
    posts.length > 1 ? posts.slice(1) : []
  )

  return {
    heroPost,
    morePosts
  }
}

export { createHomePageProps }
