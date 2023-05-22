import type {
  IDeliveryNetworkResponse,
  IContentItem,
  Responses,
  Contracts,
  IContentItemsContainer,
  IContentItemElements
} from '@kontent-ai/delivery-sdk'
import { ElementType } from '@kontent-ai/delivery-sdk'
import type { AssetUrlResolver, ContentItemUrlResolver } from '~/routing'
import type {
  KaiContentItem,
  KaiContentItemSystemAttributes,
  KaiRichTextElement
} from './kai-content-item'
import { KaiContentItemElements } from './kai-content-item'
import { createRichTextKastResolver } from '@meeg/kai-rich-text'

type ListContentItemsResponse<T extends IContentItem> =
  IDeliveryNetworkResponse<
    Responses.IListContentItemsResponse<T>,
    Contracts.IListContentItemsContract
  >

type ViewContentItemResponse<T extends IContentItem> = IDeliveryNetworkResponse<
  Responses.IViewContentItemResponse<T>,
  Contracts.IViewContentItemContract
>

function resolveSystem(system: KaiContentItemSystemAttributes): void {
  if (typeof system.kai !== 'undefined') {
    return
  }

  system.kai = { isComponent: system.name === system.id }
}

function resolveContentItemUrl<T extends IContentItem>(
  contentItem: T,
  urlResolver: ContentItemUrlResolver
) {
  const kaiContentItem = contentItem as KaiContentItem<T>

  if (typeof kaiContentItem.kai?.url !== 'undefined') {
    return kaiContentItem.kai.url
  }

  return urlResolver.resolve(contentItem)
}

function createContentItemUrlResolver(
  options?: ContentItemResponseResolverOptions
) {
  const resolver = options?.routing?.contentItemUrlResolver

  if (!resolver) {
    return undefined
  }

  return (contentItem: IContentItem) =>
    resolveContentItemUrl(contentItem, resolver)
}

async function resolveElements<T extends IContentItemElements>(
  elements: KaiContentItemElements<T>,
  linkedItems: IContentItemsContainer,
  options?: ContentItemResponseResolverOptions
): Promise<void> {
  const elementsValues = Object.values(elements)

  for (let i = 0; i < elementsValues.length; i++) {
    const element = elementsValues[i]

    if (element.type === ElementType.RichText) {
      const richTextElement = element as KaiRichTextElement

      if (typeof richTextElement.kai?.kast !== 'undefined') {
        continue
      }

      const resolver = createRichTextKastResolver({
        assetUrlResolver: options?.routing?.assetUrlResolver,
        contentItemUrlResolver: createContentItemUrlResolver(options)
        // TODO: componentItemResolver
      })

      richTextElement.kai = {
        kast: await resolver.resolveRichText({
          element: richTextElement,
          linkedItems
        })
      }
    }
  }
}

async function resolveContentItem<T extends IContentItem>(
  contentItem: T,
  linkedItems: IContentItemsContainer,
  options?: ContentItemResponseResolverOptions
): Promise<KaiContentItem<T>> {
  const kaiContentItem = contentItem as KaiContentItem<T>

  resolveSystem(
    // TODO: This seems wrong to be forcing the type like this!
    kaiContentItem.system as KaiContentItemSystemAttributes
  )

  await resolveElements(
    // TODO: This seems wrong to be forcing the type like this!
    kaiContentItem.elements as KaiContentItemElements<
      typeof contentItem.elements
    >,
    linkedItems,
    options
  )

  if (
    typeof kaiContentItem.kai?.url === 'undefined' &&
    options?.routing?.contentItemUrlResolver
  ) {
    kaiContentItem.kai = {
      url: options.routing.contentItemUrlResolver.resolve(contentItem)
    }
  }

  return kaiContentItem
}

async function resolveContentItems<T extends IContentItem>(
  contentItems: T[],
  linkedItems: IContentItemsContainer,
  options?: ContentItemResponseResolverOptions
): Promise<KaiContentItem<T>[]> {
  const kaiContentItems: Promise<KaiContentItem<T>>[] = []

  for (let i = 0; i < contentItems.length; i++) {
    const contentItem = contentItems[i]

    kaiContentItems.push(resolveContentItem(contentItem, linkedItems, options))
  }

  return await Promise.all(kaiContentItems)
}

async function resolveLinkedItems(
  linkedItems: IContentItemsContainer,
  options?: ContentItemResponseResolverOptions
) {
  // TODO: Mutation is convenient and easy, but doesn't feel "right"
  const codenames = Object.keys(linkedItems)

  for (let i = 0; i < codenames.length; i++) {
    const linkedItem = linkedItems[codenames[i]]

    await resolveContentItem(linkedItem, linkedItems, options)
  }
}

async function resolveItemResponse<T extends IContentItem>(
  response: ViewContentItemResponse<T>,
  options?: ContentItemResponseResolverOptions
): Promise<KaiContentItem<T>> {
  await resolveLinkedItems(response.data.linkedItems, options)

  return await resolveContentItem(
    response.data.item,
    response.data.linkedItems,
    options
  )
}

async function resolveItemsResponse<T extends IContentItem>(
  response: ListContentItemsResponse<T>,
  options?: ContentItemResponseResolverOptions
): Promise<KaiContentItem<T>[]> {
  await resolveLinkedItems(response.data.linkedItems, options)

  return await resolveContentItems(
    response.data.items,
    response.data.linkedItems,
    options
  )
}

interface ContentItemResponseResolverOptions {
  routing?: {
    contentItemUrlResolver?: ContentItemUrlResolver
    assetUrlResolver?: AssetUrlResolver
  }
}

interface ContentItemResponseResolver {
  resolveItem: <T extends IContentItem>(
    response: ViewContentItemResponse<T>
  ) => Promise<KaiContentItem<T>>
  resolveItems: <T extends IContentItem>(
    response: ListContentItemsResponse<T>
  ) => Promise<KaiContentItem<T>[]>
}

function contentItemResponseResolver(
  options?: ContentItemResponseResolverOptions
): ContentItemResponseResolver {
  return {
    resolveItem: async (response) =>
      await resolveItemResponse(response, options),
    resolveItems: async (response) =>
      await resolveItemsResponse(response, options)
  }
}

export { contentItemResponseResolver }
