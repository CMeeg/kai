import { Container } from '~/components/Container'
import { Intro } from './Intro'
import { HeroPost } from './HeroPost'
import type { HeroPostProps } from './HeroPost'

interface HomePageProps {
  heroPost: HeroPostProps
}

function HomePage({ heroPost }: HomePageProps) {
  return (
    <>
      <Container>
        <Intro />
        <HeroPost post={heroPost.post} />
      </Container>
    </>
  )
}

export { HomePage }

export type { HomePageProps }
