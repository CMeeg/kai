import type { MetaProps } from './Meta'
import type { HasSeoMetadataContentItem } from '~/lib/kontent/models'
import { contentTypes } from '~/lib/kontent/models'
import { createImageFromAsset } from '~/lib/media'

function createOpenGraphProps(
  contentItem: HasSeoMetadataContentItem
): MetaProps['openGraph'] {
  const type =
    contentItem.system.type === contentTypes.post.codename
      ? 'article'
      : 'website'

  const title =
    contentItem.elements.seo_metadata__og_title.value ||
    contentItem.elements.seo_metadata__title.value

  const description =
    contentItem.elements.seo_metadata__og_description.value ||
    contentItem.elements.seo_metadata__description.value ||
    null

  const imageAsset = createImageFromAsset(
    contentItem.elements.seo_metadata__og_image.value[0]
  )

  const openGraph: MetaProps['openGraph'] = { type, title, description }

  if (imageAsset) {
    openGraph.image = imageAsset.url
  }

  return openGraph
}

function createMetaProps(contentItem: HasSeoMetadataContentItem): MetaProps {
  // TODO: Add canonical URL and og:url
  return {
    title: contentItem.elements.seo_metadata__title.value,
    description: contentItem.elements.seo_metadata__description.value || null,
    openGraph: createOpenGraphProps(contentItem)
  }
}

export { createMetaProps }
