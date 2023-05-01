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
import { contentItemResponseResolver } from './content-item-response-resolver'
import type { KaiContentItem } from './kai-content-item'

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

function createUrlResolver() {
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

async function fetchContentItem<T extends IContentItem>(
  contentItem: Contracts.IViewContentItemContract
) {
  const client = deliveryClientBuilder().withResponseData(contentItem).build()

  return await client.item<T>('content').toPromise()
}

describe('contentItemResponseResolver', () => {
  test('should return `KaiContentItem<TContentItem>` given a content item of type `TContentItem`', async () => {
    const urlResolver = createUrlResolver()

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

    const kaiContentItem = contentItemResponseResolver({
      routing: {
        urlResolver
      }
    }).resolveItem(response)

    expectTypeOf(kaiContentItem).toMatchTypeOf<
      KaiContentItem<typeof contentItem>
    >()
  })

  test('should resolve URL given `urlResolver`', async () => {
    const urlResolver = createUrlResolver()

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
    const resolvedUrl = urlResolver.resolve(contentItem)

    const kaiContentItem = contentItemResponseResolver({
      routing: {
        urlResolver
      }
    }).resolveItem(response)

    expect(kaiContentItem.kai.url).toEqual(resolvedUrl)
  })

  test('should resolve URL of linked items given `urlResolver`', async () => {
    const urlResolver = createUrlResolver()

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
    const resolvedUrl = urlResolver.resolve(linkedItem)

    const kaiContentItem = contentItemResponseResolver({
      routing: {
        urlResolver
      }
    }).resolveItem(response)

    const kaiLinkedItem =
      kaiContentItem.elements.related_articles.linkedItems[0]

    expect(kaiLinkedItem.kai.url).toEqual(resolvedUrl)
  })

  test.skip('scratchpad', async () => {
    const contentType = 'article'

    const urlResolver = contentItemUrlResolver({
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
      routing: {
        urlResolver
      }
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

    const contentItem = responseResolver.resolveItem(response)

    // TODO: Item(s) should be of type KaiContentItem and have a resolvedUrl key and system.isComponent
    contentItem?.kai.url
    contentItem?.system.kai.isComponent

    // TODO: Linked items should also be of type KaiContentItem
    contentItem?.elements.related_articles.linkedItems[0].kai.url

    // TODO: Rich text elements should have portable text
    contentItem?.elements.content.kai.portableText

    //const resolvedUrl = urlResolver.resolve(page)

    //expect(resolvedUrl).toEqual(url)
  })
})