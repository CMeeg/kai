import { describe, test, expect } from 'vitest'
import type { IContentItem, Elements } from '@kontent-ai/delivery-sdk'
import type { RichTextElementBuilderImage } from '@meeg/kai-delivery-testing-lib'
import {
  contentItemBuilder,
  deliveryClientBuilder
} from '@meeg/kai-delivery-testing-lib'
import { faker } from '@faker-js/faker'
import { createRichTextKastResolver } from '~/rich-text-kast-resolver'
import { kastNodeType } from '~/kast'

type ArticleContentItem = IContentItem<{
  body: Elements.RichTextElement
}>

async function createFixtureContentItem(
  images: RichTextElementBuilderImage[]
): Promise<ArticleContentItem> {
  const contentItem = contentItemBuilder()
    .withSystemData({
      type: 'article'
    })
    .withRichTextElement({
      name: 'Body',
      buildElement(builder) {
        images.forEach((image) => builder.appendImage(image))
      }
    })
    .build()

  const client = deliveryClientBuilder().withResponseData(contentItem).build()

  const response = await client.item<ArticleContentItem>('content').toPromise()

  const { item } = response.data

  return item
}

describe('richTextKastResolver', () => {
  test('should add width and height of images to asset elements', async () => {
    const image: RichTextElementBuilderImage = {
      imageId: faker.datatype.uuid(),
      assetFileName: 'image.png',
      assetWidth: faker.datatype.number({ min: 1, max: 3200 }),
      assetHeight: faker.datatype.number({ min: 1, max: 3200 })
    }

    const contentItem = await createFixtureContentItem([image])

    const resolver = createRichTextKastResolver()

    const actual = await resolver.resolveRichText({
      element: contentItem.elements.body
    })

    const asset =
      actual.children[0].type === kastNodeType.asset ? actual.children[0] : null

    expect(asset).not.toBeNull()
    expect(asset?.data?.width).toEqual(image.assetWidth)
    expect(asset?.data?.height).toEqual(image.assetHeight)
  })
})
