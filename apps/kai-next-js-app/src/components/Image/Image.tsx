import NextImage from 'next/image'
import type { ImageProps as NextImageProps } from 'next/image'
import { isKontentAsset } from '~/lib/kontent/assets/image'
import type { KontentImageTransform } from '~/lib/kontent/assets/image'
import KontentImage from '~/components/KontentImage'
import type { KontentImageProps } from '~/components/KontentImage'

const defaultSizes = '100vw'

const defaultStyle = { width: '100%', height: 'auto' }

const defaultTransform: KontentImageTransform = (builder) =>
  builder.withCompression('lossless').withAutomaticFormat()

function Image({
  src,
  sizes,
  style,
  ...props
}: NextImageProps & KontentImageProps) {
  const imageSizes = sizes ? sizes : defaultSizes
  const imageStyle = style ? style : defaultStyle

  if (typeof src === 'string' && isKontentAsset(src)) {
    const transform = props.transform ? props.transform : defaultTransform

    return (
      <KontentImage
        src={src}
        sizes={imageSizes}
        style={imageStyle}
        transform={transform}
        {...props}
      />
    )
  }

  return (
    <NextImage src={src} sizes={imageSizes} style={imageStyle} {...props} />
  )
}

export { Image }
