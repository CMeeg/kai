import NextImage from 'next/image'
import type { ImageProps as NextImageProps } from 'next/image'
import { isKontentAsset } from '~/lib/kontent/assets/image'
import type { KontentImageTransform } from '~/lib/kontent/assets/image'
import { KontentImage } from '~/components/KontentImage'
import type { KontentImageProps } from '~/components/KontentImage'

const defaultSizes = '100vw'

function getSizes(
  sizes: NextImageProps['sizes'],
  fill: NextImageProps['fill']
) {
  if (fill) {
    return undefined
  }

  return sizes ? sizes : defaultSizes
}

const defaultStyle = { width: '100%', height: 'auto' }

function getStyle(
  style: NextImageProps['style'],
  fill: NextImageProps['fill']
) {
  if (fill) {
    return undefined
  }

  return style ? style : defaultStyle
}

const defaultTransform: KontentImageTransform = (builder) =>
  builder.withCompression('lossless').withAutomaticFormat()

function Image({
  src,
  sizes,
  style,
  fill,
  ...props
}: NextImageProps & KontentImageProps) {
  const imageSizes = getSizes(sizes, fill)
  const imageStyle = getStyle(style, fill)

  if (typeof src === 'string' && isKontentAsset(src)) {
    const transform = props.transform ? props.transform : defaultTransform

    return (
      <KontentImage
        src={src}
        sizes={imageSizes}
        style={imageStyle}
        fill={fill}
        transform={transform}
        {...props}
      />
    )
  }

  return (
    <NextImage
      src={src}
      sizes={imageSizes}
      style={imageStyle}
      fill={fill}
      {...props}
    />
  )
}

export { Image }
