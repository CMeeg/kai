import type { Post, PostSummary } from '~/lib/posts'
import { Container } from '~/components/Container'
import { Header } from './Header'
import { PostHeader } from './PostHeader'
import { PostBody } from './PostBody'
import { SectionSeparator } from './SectionSeparator'
import { MoreStories } from '~/components/MoreStories'

interface PostPageProps {
  post: Post
  morePosts: PostSummary[]
}

function PostPage({ post, morePosts }: PostPageProps) {
  return (
    <Container>
      <Header />
      <article className="mb-32">
        <PostHeader
          title={post.title}
          coverImage={post.coverImage}
          date={post.date}
          author={post.author}
        />
        <PostBody content={post.content} />
      </article>
      <SectionSeparator />
      {morePosts.length > 0 && <MoreStories posts={morePosts} />}
    </Container>
  )
}

export { PostPage }

export type { PostPageProps }
