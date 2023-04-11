import type { PostSummary } from '~/lib/posts'
import { Container } from '~/components/Container'
import { Intro } from './Intro'
import { HeroPost } from './HeroPost'
import { MoreStories } from '~/components/MoreStories'

interface HomePageProps {
  posts: PostSummary[]
}

function HomePage({ posts }: HomePageProps) {
  const heroPost = posts[0]
  const morePosts = posts.length > 1 ? posts.slice(1) : []

  return (
    <Container>
      <Intro />
      <HeroPost post={heroPost} />
      {morePosts.length > 0 && <MoreStories posts={morePosts} />}
    </Container>
  )
}

export { HomePage }

export type { HomePageProps }
