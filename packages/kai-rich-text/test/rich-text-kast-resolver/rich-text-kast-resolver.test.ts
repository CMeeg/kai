import { describe, test, expect } from 'vitest'
import type { IContentItem, Elements } from '@kontent-ai/delivery-sdk'
import type {
  RichTextElementBuilder,
  RichTextElementBuilderImage
} from '@meeg/kai-delivery-testing-lib'
import {
  contentItemBuilder,
  deliveryClientBuilder,
  createInternalLinkHtml,
  createComponentHtml
} from '@meeg/kai-delivery-testing-lib'
import { faker } from '@faker-js/faker'
import { createRichTextKastResolver } from '~/rich-text-kast-resolver'
import { kastLinkType, kastNodeType } from '~/kast'

type ArticleContentItem = IContentItem<{
  body: Elements.RichTextElement
}>

type ProductContentItem = IContentItem<{
  name: Elements.TextElement
  url_slug: Elements.UrlSlugElement
}>

async function createFixtureData(
  buildElement: (builder: RichTextElementBuilder) => void
) {
  const contentItem = contentItemBuilder()
    .withSystemData({
      type: 'article'
    })
    .withRichTextElement({
      name: 'Body',
      buildElement
    })
    .build()

  const client = deliveryClientBuilder().withResponseData(contentItem).build()

  const response = await client.item<ArticleContentItem>('content').toPromise()

  return response.data
}

describe('richTextKastResolver', () => {
  test('should add width and height of images to asset elements', async () => {
    const image: RichTextElementBuilderImage = {
      imageId: faker.datatype.uuid(),
      assetFileName: 'image.png',
      assetWidth: faker.datatype.number({ min: 1, max: 3200 }),
      assetHeight: faker.datatype.number({ min: 1, max: 3200 })
    }

    const data = await createFixtureData((builder) => {
      builder.appendImage(image)
    })

    const resolver = createRichTextKastResolver()

    const kast = await resolver.resolveRichText({
      element: data.item.elements.body
    })

    const actual =
      kast.children[0].type === kastNodeType.asset ? kast.children[0] : null

    expect(actual).not.toBeNull()
    expect(actual?.data?.width).toEqual(image.assetWidth)
    expect(actual?.data?.height).toEqual(image.assetHeight)
  })

  test('should resolve URL of assets', async () => {
    const image: RichTextElementBuilderImage = {
      imageId: faker.datatype.uuid(),
      assetFileName: 'image.png',
      assetWidth: faker.datatype.number({ min: 1, max: 3200 }),
      assetHeight: faker.datatype.number({ min: 1, max: 3200 })
    }

    const data = await createFixtureData((builder) => {
      builder.appendImage(image)
    })

    const createUrl = (assetUrl: string) => {
      const url = new URL(assetUrl)
      url.hostname = 'test.com'
      return url.toString()
    }

    const resolver = createRichTextKastResolver({
      assetUrlResolver: createUrl
    })

    const kast = await resolver.resolveRichText({
      element: data.item.elements.body
    })

    const expected = createUrl(data.item.elements.body.images[0].url)

    const actual =
      kast.children[0].type === kastNodeType.asset ? kast.children[0] : null

    expect(actual).not.toBeNull()
    expect(actual?.data?.url).toEqual(expected)
  })

  test('should resolve URL of internal link', async () => {
    const itemId = faker.datatype.uuid()
    const type = 'product'
    const codename = 'test-product'
    const urlSlug = 'test-url-slug'

    const contentItem = contentItemBuilder()
      .withSystemData({ id: itemId, type, codename })
      .withTextElement({ name: 'Name', text: 'Test' })
      .withUrlSlugElement({ name: 'URL slug', urlSlug })
      .build()

    const data = await createFixtureData((builder) => {
      builder
        .appendHtml(
          `<p>This is some content containing an ${createInternalLinkHtml(
            contentItem,
            'internal link'
          )}.</p>`,
          [contentItem]
        )
        // Content items used in Rich text links aren't automatically included in linked items
        .appendLinkedItem(contentItem)
    })

    const createUrl = (slug: string) => `/${slug}`

    const resolver = createRichTextKastResolver({
      contentItemUrlResolver: (item) =>
        item.system.type === type
          ? createUrl((item as ProductContentItem).elements.url_slug.value)
          : null
    })

    const kast = await resolver.resolveRichText({
      element: data.item.elements.body,
      linkedItems: data.linkedItems
    })

    const expected = createUrl(urlSlug)

    const paragraph =
      kast.children[0].type === kastNodeType.paragraph ? kast.children[0] : null

    const link =
      paragraph?.children[1].type === kastNodeType.link
        ? paragraph?.children[1]
        : null

    const actual =
      link?.data.type === kastLinkType.internal ? link.data.itemUrl : null

    expect(actual).toBeTypeOf('string')
    expect(actual).toEqual(expected)
  })

  test('should resolve component item data', async () => {
    const itemId = faker.datatype.uuid()
    const type = 'product'
    const codename = 'test-product'
    const urlSlug = 'test-url-slug'

    const contentItem = contentItemBuilder()
      .withSystemData({ id: itemId, type, codename })
      .withTextElement({ name: 'Name', text: 'Test' })
      .withUrlSlugElement({ name: 'URL slug', urlSlug })
      .build()

    const data = await createFixtureData((builder) => {
      builder
        .appendHtml(createComponentHtml(codename))
        .appendLinkedItem(contentItem)
    })

    const createComponentItem = (contentItem: ProductContentItem) => ({
      name: contentItem.elements.name.value,
      urlSlug: contentItem.elements.url_slug.value
    })

    const resolver = createRichTextKastResolver({
      componentItemResolver: (contentItem) => {
        return contentItem.system.type === type
          ? createComponentItem(contentItem as ProductContentItem)
          : null
      }
    })

    const kast = await resolver.resolveRichText({
      element: data.item.elements.body,
      linkedItems: data.linkedItems
    })

    const expected = createComponentItem(
      Object.values(data.linkedItems)[0] as ProductContentItem
    )

    const component =
      kast.children[0].type === kastNodeType.component ? kast.children[0] : null

    const actual = component?.data?.item

    expect(actual).toStrictEqual(expected)
  })
})
