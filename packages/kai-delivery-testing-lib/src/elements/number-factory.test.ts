import { describe, test, expect } from 'vitest'
import { createNumberElement } from './number-factory'

describe('createNumberElement', () => {
  test('should have null value when null provided', () => {
    const numberElement = createNumberElement({ name: 'Number', number: null })

    const number = numberElement.value

    expect(number).toBeNull()
  })
})
