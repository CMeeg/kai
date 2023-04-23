import type { KaiContentItem } from '@meeg/kai-delivery'
import type { MetaProps } from '~/components/Meta'
import type { HasSeoMetadataContentItem } from '~/lib/kontent/models'
import { contentTypes } from '~/lib/kontent/models'
import { createImageFromAsset } from '~/lib/media'

function createOpenGraphProps(
  contentItem: KaiContentItem<HasSeoMetadataContentItem>
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

  if (contentItem.kai?.url) {
    openGraph.url = contentItem.kai.url
  }

  return openGraph
}

function createMetaProps(
  contentItem: KaiContentItem<HasSeoMetadataContentItem>
): MetaProps {
  return {
    title: contentItem.elements.seo_metadata__title.value,
    description: contentItem.elements.seo_metadata__description.value || null,
    canonical: contentItem.kai.url || null,
    openGraph: createOpenGraphProps(contentItem)
  }
}

export { createMetaProps }
