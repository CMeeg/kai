import cn from 'classnames'
import Link from 'next/link'
import { Image } from '~/components/Image'
import type { ImageAsset } from '~/lib/media'

interface CoverImageProps {
  title: string
  image: ImageAsset
  slug?: string
}

function CoverImage({ title, image, slug }: CoverImageProps) {
  const imageComponent = (
    <Image
      width={2000}
      height={1000}
      alt={image.alt}
      src={image.url}
      className={cn('shadow-small', {
        'hover:shadow-medium transition-shadow duration-200': slug
      })}
    />
  )
  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title}>
          {imageComponent}
        </Link>
      ) : (
        imageComponent
      )}
    </div>
  )
}

export { CoverImage }

export type { CoverImageProps }
