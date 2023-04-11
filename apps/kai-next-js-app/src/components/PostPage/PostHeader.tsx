import { Avatar } from '~/components/Avatar'
import { PostDate } from '~/components/PostDate'
import { CoverImage } from '~/components/CoverImage'
import { PostTitle } from './PostTitle'
import type { Author } from '~/lib/posts'
import { ImageAsset } from '~/lib/media'

interface PostHeaderProps {
  title: string
  coverImage: ImageAsset | null
  date: string | null
  author: Author | null
}

function PostHeader({ title, coverImage, date, author }: PostHeaderProps) {
  return (
    <>
      <PostTitle title={title} />
      {author && (
        <div className="hidden md:block md:mb-12">
          <Avatar name={author.name} picture={author.picture.url} />
        </div>
      )}
      {coverImage && (
        <div className="mb-8 md:mb-16 -mx-5 sm:mx-0">
          <CoverImage title={title} image={coverImage} />
        </div>
      )}
      <div className="max-w-2xl mx-auto">
        {author && (
          <div className="block md:hidden mb-6">
            <Avatar name={author.name} picture={author.picture.url} />
          </div>
        )}
        <div className="mb-6 text-lg">
          <PostDate dateString={date} />
        </div>
      </div>
    </>
  )
}

export { PostHeader }

export type { PostHeaderProps }
