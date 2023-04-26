import { describe, test, expect } from 'vitest'
import { faker } from '@faker-js/faker'
import { createAssetElement } from './asset-factory'

describe('createAssetElement', () => {
  test('should have empty value when no assets provided', () => {
    const assetElement = createAssetElement({
      name: 'Assets',
      assets: [],
      environmentId: faker.datatype.uuid()
    })

    const assets = assetElement.value

    expect(assets).toHaveLength(0)
  })

  test('should have width and height when image type', () => {
    const assetElement = createAssetElement({
      name: 'Assets',
      assets: [
        {
          name: 'Image.png',
          type: 'image/png'
        },
        {
          name: 'Text.txt',
          type: 'text/plain'
        }
      ],
      environmentId: faker.datatype.uuid()
    })

    const assets = assetElement.value
    const image = assets[0]
    const text = assets[1]

    expect(image.width).toBeGreaterThan(0)
    expect(image.height).toBeGreaterThan(0)

    expect(text.width).toBeNull()
    expect(text.height).toBeNull()
  })
})
