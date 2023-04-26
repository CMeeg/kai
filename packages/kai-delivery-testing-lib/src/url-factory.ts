import {
  projectDataCenterLocation,
  defaultProjectDataCenterLocation
} from './project'
import type { ProjectDataCenterLocation } from './project'
import { urlEncode } from './url'

type AssetHostNames = Record<ProjectDataCenterLocation, string>

const assetHostname: AssetHostNames = {
  [projectDataCenterLocation.australia]: 'assets-au-01.kc-usercontent.com',
  [projectDataCenterLocation.eastUs]: 'assets-us-01.kc-usercontent.com',
  [projectDataCenterLocation.netherlands]: 'assets-eu-01.kc-usercontent.com'
}

interface CreateAssetUrlOptions {
  environmentId: string
  assetId: string
  assetFileName: string
  isPreview?: boolean
  projectLocation?: ProjectDataCenterLocation
}

function createAssetUrl(options: CreateAssetUrlOptions) {
  const isPreview = options.isPreview ?? false
  const projectLocation =
    options.projectLocation ?? defaultProjectDataCenterLocation

  const hostname = assetHostname[projectLocation]

  const baseUrl = isPreview
    ? `https://preview-${hostname}`
    : `https://${hostname}`

  return `${baseUrl}/${options.environmentId}/${options.assetId}/${urlEncode(
    options.assetFileName
  )}`
}

export { createAssetUrl }

export type { CreateAssetUrlOptions }
