import { describe, test, expect } from 'vitest'
import { faker } from '@faker-js/faker'
import { richTextElementBuilder } from './rich-text-builder'
import { createInternalLinkHtml } from './rich-text-html-factory'
import { richTextEmptyValue } from './rich-text-factory'
import { contentItemBuilder } from '../content-item-builder'

describe('createRichTextElementBuilder', () => {
  test('should have empty value when cleared', () => {
    const richTextElement = richTextElementBuilder().clear().build('Test')

    expect(richTextElement.value).toEqual(richTextEmptyValue)
  })

  test('should have html value when appended', () => {
    const html = '<p>Test test test</p>'

    const richTextElement = richTextElementBuilder()
      .appendHtml(html)
      .build('Test')

    expect(richTextElement.value).toEqual(html)
  })

  test('should have image when appended', () => {
    const imageId = faker.datatype.uuid()
    const assetFileName = 'image.png'

    const richTextElement = richTextElementBuilder()
      .appendImage({
        imageId,
        assetFileName
      })
      .build('Test')

    const assetFileNameMatcher = expect.stringContaining(assetFileName)

    expect(richTextElement.images[imageId].url).toEqual(assetFileNameMatcher)
    expect(richTextElement.value).toEqual(assetFileNameMatcher)
  })

  test('should have linked item when appended', () => {
    const contentItem = contentItemBuilder()
      .withTextElement({ name: 'Text', text: 'Testing' })
      .build()

    const richTextElement = richTextElementBuilder()
      .appendLinkedItem(contentItem)
      .build('Rich text')

    const itemCodename = contentItem.item.system.codename

    expect(richTextElement.modular_content).toContain(itemCodename)
    expect(richTextElement.value).toEqual(expect.stringContaining(itemCodename))
  })

  test('should have component when appended', () => {
    const contentItem = contentItemBuilder()
      .withTextElement({ name: 'Text', text: 'Testing' })
      .buildAsComponent()

    const richTextElement = richTextElementBuilder()
      .appendComponent(contentItem)
      .build('Rich text')

    const itemCodename = contentItem.item.system.codename

    expect(richTextElement.modular_content).toContain(itemCodename)
    expect(richTextElement.value).toEqual(expect.stringContaining(itemCodename))
  })

  test('should have link when appended', () => {
    const itemId = faker.datatype.uuid()
    const urlSlug = 'test-url-slug'

    const contentItem = contentItemBuilder()
      .withSystemData({ id: itemId })
      .withTextElement({ name: 'Text', text: 'Testing' })
      .withUrlSlugElement({ name: 'URL slug', urlSlug })
      .build()

    const richTextElement = richTextElementBuilder()
      .appendHtml(
        `<p>This is some content containing an ${createInternalLinkHtml(
          contentItem,
          'internal link'
        )}.</p>`,
        [contentItem]
      )
      .build('Rich text')

    expect(richTextElement.links[itemId].url_slug).toContain(urlSlug)
  })

  test('should throw when link appended with no URL slug', () => {
    const contentItem = contentItemBuilder()
      .withTextElement({ name: 'Text', text: 'Testing' })
      .build()

    const richTextBuilder = richTextElementBuilder()

    expect(() =>
      richTextBuilder.appendHtml(
        `<p>This is some content containing an ${createInternalLinkHtml(
          contentItem,
          'internal link'
        )}.</p>`,
        [contentItem]
      )
    ).toThrow()
  })
})
