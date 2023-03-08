import { describe, test, expect } from 'vitest'
import { createTextElement } from './text-factory'

describe('createTextElement', () => {
  test('should have empty value when null provided', () => {
    const textElement = createTextElement({ name: 'Text', text: null })

    const text = textElement.value

    expect(text).toEqual('')
  })
})
