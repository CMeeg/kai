import { describe, test, expect, expectTypeOf } from 'vitest'
import {
  contentItemBuilder,
  deliveryClientBuilder
} from '@meeg/kai-delivery-testing-lib'
import type {
  IContentItem,
  Elements,
  Contracts
} from '@kontent-ai/delivery-sdk'
import { contentItemUrlResolver } from '~/routing'
import type { KaiContentItem } from '~/content-items'
import { contentItemResolver } from '~/content-items'
import { contentItemResponseResolver } from './content-item-response-resolver'
import { kastNodeType } from '@meeg/kai-rich-text'

type ArticleContentItem = IContentItem<{
  name: Elements.TextElement
  content: Elements.RichTextElement
  related_articles: Elements.LinkedItemsElement<ArticleContentItem>
  url_slug: Elements.UrlSlugElement
}>

const contentTypes = {
  article: {
    codename: 'article'
  }
} as const

function createContentItemUrlResolver() {
  return contentItemUrlResolver({
    [contentTypes.article.codename]: {
      template: '/{urlSlug}',
      createUrlParams: (contentItem: ArticleContentItem) => {
        return {
          urlSlug: contentItem.elements.url_slug.value
        }
      }
    }
  })
}

function createContentItemResolver() {
  return contentItemResolver({
    [contentTypes.article.codename]: (
      contentItem: KaiContentItem<ArticleContentItem>
    ) => {
      return {
        name: contentItem.elements.name.value
      }
    }
  })
}

async function fetchContentItem<T extends IContentItem>(
  contentItem: Contracts.IViewContentItemContract
) {
  const client = deliveryClientBuilder().withResponseData(contentItem).build()

  return await client.item<T>('content').toPromise()
}

describe('contentItemResponseResolver', () => {
  test('should return `KaiContentItem<T>` given a content item of type `T`', async () => {
    const response = await fetchContentItem<ArticleContentItem>(
      contentItemBuilder()
        .withSystemData({
          type: contentTypes.article.codename
        })
        .withUrlSlugElement({
          name: 'URL slug',
          urlSlug: 'article'
        })
        .build()
    )

    const contentItem = response.data.item

    const kaiContentItem = await contentItemResponseResolver().resolveItem(
      response
    )

    expectTypeOf(kaiContentItem).toMatchTypeOf<
      KaiContentItem<typeof contentItem>
    >()
  })

  test('should resolve URL of content item when `contentItemUrlResolver` provided', async () => {
    const contentItemUrlResolver = createContentItemUrlResolver()

    const response = await fetchContentItem<ArticleContentItem>(
      contentItemBuilder()
        .withSystemData({
          type: contentTypes.article.codename
        })
        .withUrlSlugElement({
          name: 'URL slug',
          urlSlug: 'article'
        })
        .build()
    )

    const contentItem = response.data.item
    const expected = contentItemUrlResolver.resolve(contentItem)

    const kaiContentItem = await contentItemResponseResolver({
      contentItemUrlResolver
    }).resolveItem(response)

    const actual = kaiContentItem.kai?.url

    expect(actual).toEqual(expected)
  })

  test('should resolve URL of linked items when `contentItemUrlResolver` provided', async () => {
    const contentItemUrlResolver = createContentItemUrlResolver()

    const linkedContentItem = contentItemBuilder()
      .withSystemData({
        type: contentTypes.article.codename
      })
      .withUrlSlugElement({
        name: 'URL slug',
        urlSlug: 'related-article'
      })
      .build()

    const response = await fetchContentItem<ArticleContentItem>(
      contentItemBuilder()
        .withSystemData({
          type: contentTypes.article.codename
        })
        .withLinkedItemsElement({
          name: 'Related articles',
          items: [linkedContentItem]
        })
        .withUrlSlugElement({
          name: 'URL slug',
          urlSlug: 'article'
        })
        .build()
    )

    const contentItem = response.data.item
    const linkedItem = contentItem.elements.related_articles.linkedItems[0]
    const expected = contentItemUrlResolver.resolve(linkedItem)

    const kaiContentItem = await contentItemResponseResolver({
      contentItemUrlResolver
    }).resolveItem(response)

    const kaiLinkedItem =
      kaiContentItem.elements.related_articles.linkedItems[0]

    const actual = kaiLinkedItem.kai?.url

    expect(actual).toEqual(expected)
  })

  test('should resolve component items in Rich Text elements when `contentItemUrlResolver` provided', async () => {
    const contentItemResolver = createContentItemResolver()

    const componentItem = contentItemBuilder()
      .withSystemData({
        type: contentTypes.article.codename
      })
      .withTextElement({
        name: 'Name',
        text: 'Component article'
      })
      .withRichTextElement({
        name: 'Content',
        buildElement(builder) {
          builder.appendHtml('<p>This is a component article.</p>')
        }
      })
      .withUrlSlugElement({
        name: 'URL slug',
        urlSlug: 'component-article'
      })
      .buildAsComponent()

    const response = await fetchContentItem<ArticleContentItem>(
      contentItemBuilder()
        .withSystemData({
          type: contentTypes.article.codename
        })
        .withTextElement({
          name: 'Name',
          text: 'Article'
        })
        .withRichTextElement({
          name: 'Content',
          buildElement(builder) {
            builder.appendComponent(componentItem)
          }
        })
        .withUrlSlugElement({
          name: 'URL slug',
          urlSlug: 'article'
        })
        .build()
    )

    const linkedItem =
      response.data.linkedItems[componentItem.item.system.codename]
    const expected = contentItemResolver.resolve(linkedItem)

    const kaiContentItem = await contentItemResponseResolver({
      contentItemResolver
    }).resolveItem(response)

    const contentComponent =
      kaiContentItem.elements.content.kai?.kast.children[0]

    let actual
    if (contentComponent?.type === kastNodeType.component) {
      actual = contentComponent.data?.item
    }

    expect(actual).toEqual(expected)
  })

  test.skip('scratchpad', async () => {
    const contentType = 'article'

    const itemUrlResolver = contentItemUrlResolver({
      [contentType]: {
        template: '/{urlSlug}',
        createUrlParams: (contentItem: ArticleContentItem) => {
          return {
            urlSlug: contentItem.elements.url_slug.value
          }
        }
      }
    })

    const responseResolver = contentItemResponseResolver({
      contentItemUrlResolver: itemUrlResolver
    })

    const linkedContentItem = contentItemBuilder()
      .withSystemData({
        type: contentType
      })
      .withRichTextElement({
        name: 'Content',
        buildElement(builder) {
          builder.appendHtml('<p>Test</p>')
        }
      })
      .withUrlSlugElement({
        name: 'URL slug',
        urlSlug: 'related-article'
      })
      .build()

    const response = await fetchContentItem<ArticleContentItem>(
      contentItemBuilder()
        .withSystemData({
          type: contentType
        })
        .withRichTextElement({
          name: 'Content',
          buildElement(builder) {
            builder.appendHtml('<p>Test</p>')
          }
        })
        .withLinkedItemsElement({
          name: 'Related articles',
          items: [linkedContentItem]
        })
        .withUrlSlugElement({
          name: 'URL slug',
          urlSlug: 'article'
        })
        .build()
    )

    const contentItem = await responseResolver.resolveItem(response)

    // TODO: Item(s) should be of type KaiContentItem and have a resolvedUrl key and system.isComponent
    contentItem?.kai?.url
    contentItem?.system.kai?.isComponent

    // TODO: Linked items should also be of type KaiContentItem
    contentItem?.elements.related_articles.linkedItems[0].kai?.url

    // TODO: Rich text elements should have kast
    contentItem?.elements.content.kai?.kast

    //const resolvedUrl = urlResolver.resolve(page)

    //expect(resolvedUrl).toEqual(url)
  })
})
