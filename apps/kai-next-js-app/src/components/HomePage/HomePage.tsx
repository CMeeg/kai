import { Container } from '~/components/Container'
import { Intro } from './Intro'
import { HeroPost } from './HeroPost'
import type { HeroPostProps } from './HeroPost'
import { MoreStories } from '~/components/MoreStories'
import type { MoreStoriesProps } from '~/components/MoreStories'

interface HomePageProps {
  heroPost: HeroPostProps
  morePosts: MoreStoriesProps
}

function HomePage({ heroPost, morePosts }: HomePageProps) {
  return (
    <>
      <Container>
        <Intro />
        <HeroPost post={heroPost.post} />
        {morePosts.posts.length > 0 && <MoreStories posts={morePosts.posts} />}
      </Container>
    </>
  )
}

export { HomePage }

export type { HomePageProps }
