import type { IContentItem } from '@kontent-ai/delivery-sdk'
import type { KaiContentItem } from './kai-content-item'

type ContentItemTypeResolver = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TIn extends IContentItem<any> | KaiContentItem<TIn>
>(
  contentItem: TIn
) => unknown | null

type ContentItemResolverConfig = Record<string, ContentItemTypeResolver>

interface ContentItemResolver {
  resolve: (contentItem: IContentItem) => ReturnType<ContentItemTypeResolver>
}

function contentItemResolver(
  config: ContentItemResolverConfig
): ContentItemResolver {
  return {
    resolve: (contentItem) => {
      if (!contentItem) {
        // TODO: Is returning null desired - this will "fail silently"
        return null
      }

      // Try to get a resolver for this content type
      const { type } = contentItem.system

      const itemResolver = config[type]

      if (!itemResolver) {
        // TODO: Is returning null desired - this will "fail silently"
        // No resolver found
        return null
      }

      return itemResolver(contentItem)
    }
  }
}

export { contentItemResolver }

export type {
  ContentItemResolver,
  ContentItemResolverConfig,
  ContentItemTypeResolver
}
