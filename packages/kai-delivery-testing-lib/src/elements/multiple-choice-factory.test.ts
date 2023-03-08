import { describe, test, expect } from 'vitest'
import { createMultipleChoiceElement } from './multiple-choice-factory'

describe('createMultipleChoiceElement', () => {
  test('should have empty value when no options provided', () => {
    const multipleChoiceElement = createMultipleChoiceElement({
      name: 'Multiple choice',
      options: []
    })

    const options = multipleChoiceElement.value

    expect(options).toHaveLength(0)
  })
})
