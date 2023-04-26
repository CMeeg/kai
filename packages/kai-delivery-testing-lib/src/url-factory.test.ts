import { describe, test, expect } from 'vitest'
import { faker } from '@faker-js/faker'
import { createAssetUrl } from './url-factory'

describe('createAssetUrl', () => {
  test('should have preview hostname when isPreview', () => {
    const assetUrl = createAssetUrl({
      environmentId: faker.datatype.uuid(),
      assetId: faker.datatype.uuid(),
      assetFileName: 'test.png',
      isPreview: true
    })

    expect(assetUrl).toEqual(expect.stringContaining('preview-'))
  })

  test('should not have preview hostname when not isPreview', () => {
    const assetUrl = createAssetUrl({
      environmentId: faker.datatype.uuid(),
      assetId: faker.datatype.uuid(),
      assetFileName: 'test.png'
    })

    expect(assetUrl).not.toEqual(expect.stringContaining('preview-'))
  })
})
