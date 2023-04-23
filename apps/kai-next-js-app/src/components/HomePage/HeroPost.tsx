import type { PostSummary } from '~/lib/posts'
import { CoverImage } from '~/components/CoverImage'
import { Avatar } from '~/components/Avatar'
import { PostDate } from '~/components/PostDate'
import Link from 'next/link'

interface HeroPostProps {
  post: PostSummary
}

function HeroPost({ post }: HeroPostProps) {
  return (
    <section>
      <div className="mb-8 md:mb-16">
        {post.coverImage && (
          <CoverImage
            title={post.title}
            image={post.coverImage}
            url={post.url}
          />
        )}
      </div>
      <div className="md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8 mb-20 md:mb-28">
        <div>
          <h3 className="mb-4 text-4xl lg:text-6xl leading-tight">
            {post.url ? (
              <Link href={post.url} className="hover:underline">
                {post.title}
              </Link>
            ) : (
              post.title
            )}
          </h3>
          <div className="mb-4 md:mb-0 text-lg">
            <PostDate dateString={post.date} />
          </div>
        </div>

        <div>
          <p className="text-lg leading-relaxed mb-4">{post.excerpt}</p>
          {post.author && (
            <Avatar name={post.author.name} picture={post.author.picture.url} />
          )}
        </div>
      </div>
    </section>
  )
}

export { HeroPost }

export type { HeroPostProps }
