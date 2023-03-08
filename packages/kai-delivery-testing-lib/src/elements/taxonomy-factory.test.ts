import { describe, test, expect } from 'vitest'
import { createTaxonomyElement } from './taxonomy-factory'

describe('createTaxonomyElement', () => {
  test('should have empty value when no terms provided', () => {
    const taxonomyElement = createTaxonomyElement({
      name: 'Taxonomy',
      terms: [],
      group: 'taxonomy_group'
    })

    const terms = taxonomyElement.value

    expect(terms).toHaveLength(0)
  })
})
