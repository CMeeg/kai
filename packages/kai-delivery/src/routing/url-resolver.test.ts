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
import { contentItemUrlResolver } from './url-resolver'

type HomepageContentItem = IContentItem<{
  name: Elements.TextElement
}>

type PageContentItem = IContentItem<{
  name: Elements.TextElement
  articles: Elements.LinkedItemsElement
  url_slug: Elements.UrlSlugElement
}>

type ArticleContentItem = IContentItem<{
  name: Elements.TextElement
  url_slug: Elements.UrlSlugElement
}>

async function fetchContentItem<T extends IContentItem>(
  contentItem: Contracts.IViewContentItemContract
) {
  const client = deliveryClientBuilder().withResponseData(contentItem).build()

  return await client.item<T>('content').toPromise()
}

describe('contentItemUrlResolver', () => {
  test('should resolve template when no params given', async () => {
    // Create a URL resolver

    const contentType = 'homepage'
    const url = '/'

    const urlResolver = contentItemUrlResolver({
      [contentType]: {
        template: '/'
      }
    })

    // "Fetch" a content item that we can resolve the URL of

    const response = await fetchContentItem<HomepageContentItem>(
      contentItemBuilder()
        .withSystemData({
          type: contentType
        })
        .build()
    )

    // Resolve the URL of the content item and assert it is what we are expecting

    const homepage = response.data.item
    const resolvedUrl = urlResolver.resolve(homepage)

    expect(resolvedUrl).toEqual(url)
  })

  test('should resolve template when params given', async () => {
    // Create a URL resolver

    const contentType = 'page'
    const urlSlug = 'my-page'
    const url = `/${urlSlug}`

    const urlResolver = contentItemUrlResolver({
      [contentType]: {
        template: '/{urlSlug}',
        createUrlParams: (contentItem: PageContentItem) => {
          return {
            urlSlug: contentItem.elements.url_slug.value
          }
        }
      }
    })

    // "Fetch" a content item that we can resolve the URL of

    const response = await fetchContentItem<PageContentItem>(
      contentItemBuilder()
        .withSystemData({
          type: contentType
        })
        .withUrlSlugElement({
          name: 'URL slug',
          urlSlug
        })
        .build()
    )

    // Resolve the URL of the content item and assert it is what we are expecting

    const page = response.data.item
    const resolvedUrl = urlResolver.resolve(page)

    expect(resolvedUrl).toEqual(url)
  })

  test('should return null when params are null', async () => {
    // Create a URL resolver

    const contentType = 'page'
    const urlSlug = 'my-page'

    const urlResolver = contentItemUrlResolver({
      [contentType]: {
        template: '/{urlSlug}',
        createUrlParams: () => {
          return null
        }
      }
    })

    // "Fetch" a content item that we can resolve the URL of

    const response = await fetchContentItem<PageContentItem>(
      contentItemBuilder()
        .withSystemData({
          type: contentType
        })
        .withUrlSlugElement({
          name: 'URL slug',
          urlSlug
        })
        .build()
    )

    // Resolve the URL of the content item and assert it is what we are expecting

    const page = response.data.item
    const resolvedUrl = urlResolver.resolve(page)

    expect(resolvedUrl).toBeNull()
  })

  test('should resolve linked content item', async () => {
    // Create a URL resolver

    const itemContentType = 'page'
    const linkedItemContentType = 'article'
    const urlSlug = 'my-article'
    const url = `/articles/${urlSlug}`

    const urlResolver = contentItemUrlResolver({
      [itemContentType]: {
        resolve: (contentItem: PageContentItem) =>
          contentItem.elements.articles?.linkedItems?.[0]
      },
      [linkedItemContentType]: {
        template: '/articles/{urlSlug}',
        createUrlParams: (contentItem: ArticleContentItem) => {
          return {
            urlSlug: contentItem.elements.url_slug.value
          }
        }
      }
    })

    // Create a content item that can be added to a linked items element

    const linkedContentItem = contentItemBuilder()
      .withSystemData({
        type: linkedItemContentType
      })
      .withUrlSlugElement({
        name: 'URL slug',
        urlSlug
      })
      .build()

    // "Fetch" a content item that includes the linked item

    const response = await fetchContentItem<PageContentItem>(
      contentItemBuilder()
        .withSystemData({
          type: itemContentType
        })
        .withLinkedItemsElement({
          name: 'Articles',
          items: [linkedContentItem]
        })
        .build()
    )

    // Resolve the URL of the content item and assert it is what we are expecting

    const page = response.data.item
    const resolvedUrl = urlResolver.resolve(page)

    expect(resolvedUrl).toEqual(url)
  })

  test('should return null when linked content item not present', async () => {
    // Create a URL resolver

    const itemContentType = 'page'
    const linkedItemContentType = 'article'

    const urlResolver = contentItemUrlResolver({
      [itemContentType]: {
        resolve: (contentItem: PageContentItem) =>
          contentItem.elements.articles?.linkedItems?.[0]
      },
      [linkedItemContentType]: {
        template: '/articles/{urlSlug}',
        createUrlParams: (contentItem: ArticleContentItem) => {
          return {
            urlSlug: contentItem.elements.url_slug.value
          }
        }
      }
    })

    // "Fetch" a content item that has no linked items

    const response = await fetchContentItem<PageContentItem>(
      contentItemBuilder()
        .withSystemData({
          type: itemContentType
        })
        .withLinkedItemsElement({
          name: 'Articles',
          items: []
        })
        .build()
    )

    // Resolve the URL of the content item and assert it is what we are expecting

    const page = response.data.item
    const resolvedUrl = urlResolver.resolve(page)

    expect(resolvedUrl).toBeNull()
  })

  test('should return null when content type entry not found', async () => {
    // Create a URL resolver

    const itemContentType = 'page'
    const otherContentType = 'home'

    const urlResolver = contentItemUrlResolver({
      [otherContentType]: {
        template: '/'
      }
    })

    // "Fetch" a content item that has no URL resolver

    const response = await fetchContentItem<PageContentItem>(
      contentItemBuilder()
        .withSystemData({
          type: itemContentType
        })
        .build()
    )

    // Resolve the URL of the content item and assert it is what we are expecting

    const page = response.data.item
    const resolvedUrl = urlResolver.resolve(page)

    expect(resolvedUrl).toBeNull()
  })

  test('should throw with malformed options', async () => {
    // Create a URL resolver with malformed options

    const contentType = 'home'

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const urlResolver = contentItemUrlResolver({
      [contentType]: {
        tmpl: '/'
      } as any
    })
    /* eslint-enable @typescript-eslint/no-explicit-any */

    // "Fetch" a content item to resolve

    const response = await fetchContentItem<HomepageContentItem>(
      contentItemBuilder()
        .withSystemData({
          type: contentType
        })
        .build()
    )

    // Resolve the URL of the content item and assert it throws an error

    const page = response.data.item

    expect(() => urlResolver.resolve(page)).toThrow()
  })
})
