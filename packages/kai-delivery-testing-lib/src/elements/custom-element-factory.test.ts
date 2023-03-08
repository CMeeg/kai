import { describe, test, expect } from 'vitest'
import { createCustomElement } from './custom-element-factory'

describe('createCustomElement', () => {
  test('should have null value when null provided', () => {
    const customElement = createCustomElement({ name: 'Custom', value: null })

    const value = customElement.value

    expect(value).toBeNull()
  })
})
