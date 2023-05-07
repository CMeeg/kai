import { describe, test, expect } from 'vitest'
import { createPortableTextResolver } from './portable-text-resolver'
import { readFixtureData, createFixtureContentItem } from './_fixtures'

describe('portableTextResolver', async () => {
  test('should parse "empty" value to portable text', async () => {
    const data = await readFixtureData('empty-value')
    const contentItem = await createFixtureContentItem(data.input)

    const portableText = await createPortableTextResolver().resolveRichText({
      element: contentItem.elements.body
    })

    expect(portableText).toEqual(data.output)
  })

  test('should parse block elements to portable text', async () => {
    const data = await readFixtureData('blocks')
    const contentItem = await createFixtureContentItem(data.input)

    const portableText = await createPortableTextResolver().resolveRichText({
      element: contentItem.elements.body
    })

    expect(portableText).toEqual(data.output)
  })

  test('should parse inline elements to portable text', async () => {
    const data = await readFixtureData('inline')
    const contentItem = await createFixtureContentItem(data.input)

    const portableText = await createPortableTextResolver().resolveRichText({
      element: contentItem.elements.body
    })

    expect(portableText).toEqual(data.output)
  })

  // TODO: Links

  // TODO: Lists

  // TODO: Assets

  // TODO: Tables

  // TODO: Content items

  // TODO: Components
})
