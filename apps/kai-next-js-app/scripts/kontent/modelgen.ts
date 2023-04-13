import { generateModelsAsync, textHelper } from '@kontent-ai/model-generator'
import type { IGenerateModelsConfig } from '@kontent-ai/model-generator'
import * as dotenv from 'dotenv'
import path from 'node:path'
import { emptyDir } from 'fs-extra'

// Load and validate env vars

const projectDir = process.cwd()
dotenv.config({ path: path.resolve(projectDir, '.env.local') })
dotenv.config({ path: path.resolve(projectDir, '.env') })

const projectId = process.env.PRIVATE_KONTENT_PROJECT_ID
if (!projectId) {
  throw 'Env var PRIVATE_KONTENT_PROJECT_ID not found.'
}

const apiKey = process.env.PRIVATE_KONTENT_MANAGEMENT_API_KEY
if (!apiKey) {
  throw 'Env var PRIVATE_KONTENT_MANAGEMENT_API_KEY not found.'
}

// Create config

interface KontentObject {
  codename: string
}

function createName(object: KontentObject, suffix: string, prefix = '') {
  return `${prefix}${textHelper.toPascalCase(object.codename)}${suffix}`
}

// N.B. `outputDir` needs to be relative to `process.cwd()` otherwise `generateModelsAsync` will error
const outputDir = './src/lib/kontent/models/_generated'

const config: IGenerateModelsConfig = {
  sdkType: 'delivery',
  projectId,
  apiKey,
  isEnterpriseSubscription: false,
  addTimestamp: false,
  contentTypeFileResolver: (type) => createName(type, 'ContentItem'),
  contentTypeResolver: (type) => createName(type, 'ContentItem'),
  contentTypeSnippetFileResolver: (snippet) =>
    createName(snippet, 'ContentTypeSnippet'),
  contentTypeSnippetResolver: (snippet) =>
    createName(snippet, 'ContentItem', 'Has'),
  taxonomyTypeFileResolver: (taxonomy) => createName(taxonomy, 'TaxonomyGroup'),
  taxonomyTypeResolver: (taxonomy) => createName(taxonomy, 'TaxonomyGroup'),
  outputDir
}

// Generate the models

;(async function () {
  try {
    await emptyDir(path.resolve(projectDir, outputDir))

    await generateModelsAsync(config)

    console.info('✔️ Done')
  } catch (err) {
    console.error(err)

    console.error('❌ Failed')
  }
})()
