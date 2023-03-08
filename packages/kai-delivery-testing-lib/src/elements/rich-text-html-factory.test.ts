import { describe, test, expect } from 'vitest'
import { faker } from '@faker-js/faker'
import { createInternalLinkHtml } from './rich-text-html-factory'
import { contentItemBuilder } from '../content-item-builder'

describe('createInternalLink', () => {
  test('should have itemId and text', () => {
    const itemId = faker.datatype.uuid()
    const text = 'Internal link'

    const contentItem = contentItemBuilder()
      .withSystemData({ id: itemId })
      .build()

    const internalLink = createInternalLinkHtml(contentItem, text)

    expect(internalLink).toEqual(expect.stringContaining(itemId))
    expect(internalLink).toEqual(expect.stringContaining(text))
  })
})
