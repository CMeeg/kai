import type { PostContentItem } from '~/lib/kontent/models'
import type { HomePageProps } from './HomePage'
import type { HeroPostProps } from './HeroPost'
import { createHeroPostProps } from './HeroPost.mapping'

type HomePageContentProps = HomePageProps

function createHomePageContentProps(
  posts: PostContentItem[]
): HomePageContentProps {
  const heroPost = createHeroPostProps(posts[0])

  // TODO: Map when this component exists
  // const morePosts = posts.length > 1
  //   ? posts.slice(1).map(post => createPostProps(post))
  //   : []

  return {
    heroPost
  }
}

export { createHomePageContentProps }

export type { HomePageContentProps }
