import { ImageUrlTransformationBuilder } from '@kontent-ai/delivery-sdk'
import { ImageLoaderProps } from 'next/image'

// TODO: Could just check for `*.kc-usercontent.com`
const assetDomains = [
  'assets-au-01.kc-usercontent.com',
  'preview-assets-au-01.kc-usercontent.com',
  'assets-eu-01.kc-usercontent.com',
  'preview-assets-eu-01.kc-usercontent.com',
  'assets-us-01.kc-usercontent.com',
  'preview-assets-us-01.kc-usercontent.com'
]

// TODO: Move to some kind of "base library"?
function isKontentAsset(assetUrl: string, customAssetDomains?: string[]) {
  try {
    const url = new URL(assetUrl)

    if (assetDomains.includes(url.hostname)) {
      return true
    }

    return customAssetDomains?.includes(url.hostname) ?? false
  } catch {
    return false
  }
}

type KontentImageTransform = (
  builder: ImageUrlTransformationBuilder
) => ImageUrlTransformationBuilder

type KontentImageLoaderProps = ImageLoaderProps & {
  transform?: KontentImageTransform
}

// TODO: Move to a "Next.js" library
function kontentImageLoader({
  src,
  width,
  quality,
  transform
}: KontentImageLoaderProps) {
  let imageUrlBuilder = new ImageUrlTransformationBuilder(src).withWidth(width)

  if (quality) {
    imageUrlBuilder = imageUrlBuilder.withQuality(quality)
  }

  if (transform) {
    imageUrlBuilder = transform(imageUrlBuilder)
  }

  return imageUrlBuilder.getUrl()
}

export { isKontentAsset, kontentImageLoader }

export type { KontentImageTransform, KontentImageLoaderProps }
