import { describe, test, expect } from 'vitest'
import { createRichTextElement, richTextEmptyValue } from './rich-text-factory'

describe('createRichTextElement', () => {
  test('should have empty value when no html provided', () => {
    const richTextElement = createRichTextElement({
      name: 'Test',
      html: '',
      images: {},
      links: {},
      modularContent: []
    })

    expect(richTextElement.value).toEqual(richTextEmptyValue)
  })
})
