import { describe, test, expect } from 'vitest'
import { createLinkedItemsElement } from './linked-items-factory'

describe('createLinkedItemsElement', () => {
  test('should have empty value when no items provided', () => {
    const linkedItemsElement = createLinkedItemsElement({
      name: 'Linked items',
      items: []
    })

    const options = linkedItemsElement.value

    expect(options).toHaveLength(0)
  })
})
