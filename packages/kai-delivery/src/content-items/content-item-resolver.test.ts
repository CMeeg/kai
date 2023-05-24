import { describe, test, expect } from 'vitest'
import {
  contentItemBuilder,
  deliveryClientBuilder
} from '@meeg/kai-delivery-testing-lib'
import type {
  IContentItem,
  Elements,
  Contracts
} from '@kontent-ai/delivery-sdk'
import { contentItemResolver } from './content-item-resolver'
import type {
  ContentItemResolverConfig,
  ContentItemTypeResolver
} from './content-item-resolver'

type HomepageContentItem = IContentItem<{
  name: Elements.TextElement
}>

async function fetchContentItem<T extends IContentItem>(
  contentItem: Contracts.IViewContentItemContract
) {
  const client = deliveryClientBuilder().withResponseData(contentItem).build()

  return await client.item<T>('content').toPromise()
}

describe('contentItemResolver', () => {
  test('should resolve content item when resolver is provided for matching content type', async () => {
    const contentType = 'homepage'
    const text = 'Homepage'

    interface HomepageModel {
      name: string
    }

    const homepageResolver: ContentItemTypeResolver = (
      contentItem: HomepageContentItem
    ): HomepageModel => {
      return {
        name: contentItem.elements.name.value
      }
    }

    const config: ContentItemResolverConfig = {
      [contentType]: homepageResolver
    }

    const resolver = contentItemResolver(config)

    const response = await fetchContentItem<HomepageContentItem>(
      contentItemBuilder()
        .withSystemData({
          type: contentType
        })
        .withTextElement({
          name: 'Name',
          text
        })
        .build()
    )

    const homepage = response.data.item

    const mappedItem = resolver.resolve(homepage) as HomepageModel

    expect(mappedItem.name).toEqual(text)
  })
})
