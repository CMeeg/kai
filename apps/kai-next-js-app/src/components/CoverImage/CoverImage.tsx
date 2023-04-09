import cn from 'classnames'
import { Image } from '~/components/Image'
import Link from 'next/link'

interface CoverImageProps {
  title: string
  src: string
  slug?: string
}

function CoverImage({ title, src, slug }: CoverImageProps) {
  const image = (
    <Image
      width={2000}
      height={1000}
      alt={`Cover Image for ${title}`}
      src={src}
      className={cn('shadow-small', {
        'hover:shadow-medium transition-shadow duration-200': slug
      })}
    />
  )
  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  )
}

export { CoverImage }

export type { CoverImageProps }
