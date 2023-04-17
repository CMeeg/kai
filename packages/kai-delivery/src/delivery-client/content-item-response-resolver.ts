import type {
  IDeliveryNetworkResponse,
  IContentItem,
  Responses,
  Contracts,
  IContentItemSystemAttributes
} from '@kontent-ai/delivery-sdk'
import type { ContentItemUrlResolver } from '~/routing'
import {
  KaiContentItem,
  KaiContentItemSystemAttributes
} from './kai-content-item'

type ListContentItemsResponse<T extends IContentItem> =
  IDeliveryNetworkResponse<
    Responses.IListContentItemsResponse<T>,
    Contracts.IListContentItemsContract
  >

type ViewContentItemResponse<T extends IContentItem> = IDeliveryNetworkResponse<
  Responses.IViewContentItemResponse<T>,
  Contracts.IViewContentItemContract
>

function resolveSystemAttributes<T extends IContentItemSystemAttributes>(
  system: KaiContentItemSystemAttributes<T>
) {
  system.kai = { isComponent: system.name === system.id }
}

function resolveContentItem<T extends IContentItem>(
  contentItem: T,
  options: ContentItemResponseResolverOptions
): KaiContentItem<T> {
  const kaiContentItem = contentItem as KaiContentItem<T>

  // TODO: This seems wrong to be forcing the type like this!
  resolveSystemAttributes(
    kaiContentItem.system as KaiContentItemSystemAttributes<
      typeof contentItem.system
    >
  )

  // TODO: elements

  // TODO: Only add URL if it can be resolved (undefined otherwise)?
  kaiContentItem.kai = { url: options.routing.urlResolver.resolve(contentItem) }

  return kaiContentItem
}

function resolveContentItems<T extends IContentItem>(
  contentItems: T[],
  options: ContentItemResponseResolverOptions
): KaiContentItem<T>[] {
  return contentItems.map((contentItem) =>
    resolveContentItem(contentItem, options)
  )
}

function resolveItemResponse<T extends IContentItem>(
  response: ViewContentItemResponse<T>,
  options: ContentItemResponseResolverOptions
): KaiContentItem<T> {
  // TODO: Resolve `response.data.linkedItems`

  return resolveContentItem(response.data.item, options)
}

function resolveItemsResponse<T extends IContentItem>(
  response: ListContentItemsResponse<T>,
  options: ContentItemResponseResolverOptions
): KaiContentItem<T>[] {
  // TODO: Resolve `response.data.linkedItems`

  return resolveContentItems(response.data.items, options)
}

interface ContentItemResponseResolverOptions {
  routing: {
    urlResolver: ContentItemUrlResolver
  }
}

interface ContentItemResponseResolver {
  resolveItem: <T extends IContentItem>(
    response: ViewContentItemResponse<T>
  ) => KaiContentItem<T>
  resolveItems: <T extends IContentItem>(
    response: ListContentItemsResponse<T>
  ) => KaiContentItem<T>[]
}

function contentItemResponseResolver(
  options: ContentItemResponseResolverOptions
): ContentItemResponseResolver {
  return {
    resolveItem: (response) => resolveItemResponse(response, options),
    resolveItems: (response) => resolveItemsResponse(response, options)
  }
}

export { contentItemResponseResolver }
