import cn from 'classnames'
import Link from 'next/link'
import { Image } from '~/components/Image'
import type { ImageAsset } from '~/lib/media'

interface CoverImageProps {
  title: string
  image: ImageAsset
  url?: string | null
}

function CoverImage({ title, image, url }: CoverImageProps) {
  const imageComponent = (
    <Image
      width={2000}
      height={1000}
      alt={image.alt}
      src={image.url}
      className={cn('shadow-small', {
        'hover:shadow-medium transition-shadow duration-200': url
      })}
    />
  )
  return (
    <div className="sm:mx-0">
      {url ? (
        <Link href={url} aria-label={title}>
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
