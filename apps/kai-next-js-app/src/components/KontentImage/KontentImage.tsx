import NextImage from 'next/image'
import type { ImageProps as NextImageProps, ImageLoader } from 'next/image'
import { kontentImageLoader } from '~/lib/kontent/assets/image'
import type { KontentImageTransform } from '~/lib/kontent/assets/image'

type KontentImageProps = NextImageProps & { transform?: KontentImageTransform }

function KontentImage({ transform, ...props }: KontentImageProps) {
  const loader: ImageLoader = ({ src, width, quality }) =>
    kontentImageLoader({ src, width, quality, transform })

  return <NextImage loader={loader} {...props} />
}

export { KontentImage }

export type { KontentImageProps }
