import { describe, test, expect } from 'vitest'
import { createUrlSlugElement } from './url-slug-factory'

describe('createUrlSlugElement', () => {
  test('should have empty value when null provided', () => {
    const urlSlugElement = createUrlSlugElement({
      name: 'URL slug',
      urlSlug: null
    })

    const urlSlug = urlSlugElement.value

    expect(urlSlug).toEqual('')
  })
})
