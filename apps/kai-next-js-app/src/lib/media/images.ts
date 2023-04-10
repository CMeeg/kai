import type { ElementModels } from '@kontent-ai/delivery-sdk'

interface ImageAsset {
  url: string
  alt: string
  width: number | null
  height: number | null
}

function createImageFromAsset(
  asset: ElementModels.AssetModel
): ImageAsset | null {
  if (!asset.type.startsWith('image/')) {
    return null
  }

  return {
    url: asset.url,
    alt: asset.description ?? '',
    width: asset.width,
    height: asset.height
  }
}

export { createImageFromAsset }

export type { ImageAsset }
