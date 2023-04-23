import Link from 'next/link'
import { Avatar } from '~/components/Avatar'
import { PostDate } from '~/components/PostDate'
import { CoverImage } from '~/components/CoverImage'
import type { PostSummary } from '~/lib/posts'

interface PostPreviewProps {
  post: PostSummary
}

function PostPreview({ post }: PostPreviewProps) {
  return (
    <div>
      {post.coverImage && (
        <div className="mb-5">
          <CoverImage
            url={post.url}
            title={post.title}
            image={post.coverImage}
          />
        </div>
      )}
      <h3 className="text-3xl mb-3 leading-snug">
        {post.url ? (
          <Link href={post.url} className="hover:underline">
            {post.title}
          </Link>
        ) : (
          post.title
        )}
      </h3>
      <div className="text-lg mb-4">
        <PostDate dateString={post.date} />
      </div>
      <p className="text-lg leading-relaxed mb-4">{post.excerpt}</p>
      {post.author && (
        <Avatar name={post.author.name} picture={post.author.picture.url} />
      )}
    </div>
  )
}

export { PostPreview }

export type { PostPreviewProps }
