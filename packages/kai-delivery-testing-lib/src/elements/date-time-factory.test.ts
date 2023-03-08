import { describe, test, expect } from 'vitest'
import { createDateTimeElement } from './date-time-factory'

describe('createDateTimeElement', () => {
  test('should have null value when null provided', () => {
    const dateTimeElement = createDateTimeElement({
      name: 'Date & time',
      dateTime: null
    })

    const dateTime = dateTimeElement.value

    expect(dateTime).toBeNull()
  })
})
