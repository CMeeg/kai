import type { IContentItem, Elements } from '@kontent-ai/delivery-sdk'
import {
  contentItemBuilder,
  deliveryClientBuilder
} from '@meeg/kai-delivery-testing-lib'

type ArticleContentItem = IContentItem<{
  body: Elements.RichTextElement
}>

async function createFixtureContentItem(
  html: string
): Promise<ArticleContentItem> {
  const contentItem = contentItemBuilder()
    .withSystemData({
      type: 'article'
    })
    .withRichTextElement({
      name: 'Body',
      buildElement(builder) {
        builder.appendHtml(html)
      }
    })
    .build()

  const client = deliveryClientBuilder().withResponseData(contentItem).build()

  const response = await client.item<ArticleContentItem>('content').toPromise()

  const { item } = response.data

  return item
}

export { createFixtureContentItem }
