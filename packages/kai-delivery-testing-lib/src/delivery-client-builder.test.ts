import { describe, test, expect } from 'vitest'
import type { IContentItem, Elements } from '@kontent-ai/delivery-sdk'
import { contentItemBuilder } from './content-item-builder'
import { deliveryClientBuilder } from './delivery-client-builder'

type TestContentItem = IContentItem<{
  name: Elements.TextElement
}>

describe('createDeliveryClientBuilder', () => {
  test('should build delivery client with expected response data', async () => {
    const text = 'Test content item'

    const contentItem = contentItemBuilder()
      .withTextElement({ name: 'Name', text })
      .build()

    const client = deliveryClientBuilder().withResponseData(contentItem).build()

    const response = await client.item<TestContentItem>('codename').toPromise()

    const { item } = response.data

    expect(item.elements.name.value).toEqual(text)
  })
})
