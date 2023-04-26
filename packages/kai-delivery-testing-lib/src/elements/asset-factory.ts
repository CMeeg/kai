import type { Contracts } from '@kontent-ai/delivery-sdk'
import { faker } from '@faker-js/faker'
import { defaultProjectDataCenterLocation } from '../project'
import type { ProjectDataCenterLocation } from '../project'
import { createAssetUrl } from '../url-factory'
import { elementTypeName } from './element'
import { PartialExceptFor } from '../utility'

type ContentItemAssetElement = PartialExceptFor<
  Contracts.IAssetContract,
  'name'
>

function createAssetValue(
  asset: ContentItemAssetElement,
  environmentId: string,
  isPreview: boolean,
  projectLocation: ProjectDataCenterLocation
) {
  const { name } = asset
  const description = asset.description || ''
  const type = asset.type ? asset.type.toLowerCase() : 'image/png'
  const size = asset.size || faker.datatype.number({ min: 1, max: 100000 })
  const url = createAssetUrl({
    environmentId,
    assetId: faker.datatype.uuid(),
    assetFileName: name,
    isPreview,
    projectLocation
  })

  const value: Contracts.IAssetContract = {
    name,
    description,
    type,
    size,
    url,
    width: null,
    height: null,
    renditions: {}
  }

  if (type.startsWith('image/')) {
    value.width = asset.width || faker.datatype.number({ min: 1, max: 3200 })
    value.height = asset.height || faker.datatype.number({ min: 1, max: 3200 })
  }

  return value
}

function createAssetValues(
  assets: ContentItemAssetElement[],
  environmentId: string,
  isPreview: boolean,
  projectLocation: ProjectDataCenterLocation
) {
  if (!assets.length) {
    return []
  }

  return assets.map((asset) =>
    createAssetValue(asset, environmentId, isPreview, projectLocation)
  )
}

interface CreateAssetElementOptions {
  name: string
  assets: ContentItemAssetElement[]
  environmentId: string
  isPreview?: boolean
  projectLocation?: ProjectDataCenterLocation
}

function createAssetElement(
  options: CreateAssetElementOptions
): Contracts.IElementContract {
  const isPreview = options.isPreview ?? false
  const projectLocation =
    options.projectLocation ?? defaultProjectDataCenterLocation

  const value = createAssetValues(
    options.assets,
    options.environmentId,
    isPreview,
    projectLocation
  )

  return {
    type: elementTypeName.asset,
    name: options.name,
    value
  }
}

export { createAssetElement }

export type { CreateAssetElementOptions, ContentItemAssetElement }
