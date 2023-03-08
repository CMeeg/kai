import type { Contracts } from '@kontent-ai/delivery-sdk'
import { faker } from '@faker-js/faker'
import { defaultProjectDataCenterLocation } from '../project'
import type { ProjectDataCenterLocation } from '../project'
import { createAssetUrl } from '../url-factory'
import { createRichTextElement } from './rich-text-factory'
import {
  createComponentHtml,
  createImageAssetHtml,
  createLinkedItemHtml
} from './rich-text-html-factory'

interface RichTextElementBuilderState {
  images: Contracts.IRichTextElementImageWrapperContract
  links: Contracts.IRichTextElementLinkWrapperContract
  modularContent: string[]
  htmlEntries: string[]
  projectId: string
  isPreview: boolean
  projectLocation: ProjectDataCenterLocation
  onAddModularContent?: (
    contentItem: Contracts.IViewContentItemContract
  ) => void
}

const urlSlugElementType = 'url_slug'

function appendLink(
  state: RichTextElementBuilderState,
  contentItem: Contracts.IViewContentItemContract
) {
  const { id, codename, type } = contentItem.item.system

  const urlSlugElement = Object.values(contentItem.item.elements).find(
    (element) => {
      return element.type === urlSlugElementType
    }
  )

  if (!urlSlugElement) {
    throw Error(
      `Linked content item with codename '${codename}' must contain a '${urlSlugElementType}' element.`
    )
  }

  const link = {
    codename,
    type,
    url_slug: urlSlugElement.value
  }

  state.links[id] = link
}

function appendLinks(
  state: RichTextElementBuilderState,
  contentItems?: Contracts.IViewContentItemContract[]
) {
  if (!contentItems) {
    return
  }

  contentItems.forEach((contentItem) => {
    appendLink(state, contentItem)
  })
}

function appendHtml(
  state: RichTextElementBuilderState,
  html: string,
  linkedContentItems?: Contracts.IViewContentItemContract[]
) {
  state.htmlEntries.push(html)

  appendLinks(state, linkedContentItems)
}

function appendImage(
  state: RichTextElementBuilderState,
  image: RichTextElementBuilderImage
) {
  const imageId = image.imageId ?? faker.datatype.uuid()
  const imageAlt = image.assetDescription ?? ''
  const imageWidth =
    image.assetWidth ?? faker.datatype.number({ min: 1, max: 3200 })
  const imageHeight =
    image.assetHeight ?? faker.datatype.number({ min: 1, max: 3200 })

  const assetUrl = createAssetUrl({
    projectId: state.projectId,
    assetId: image.assetId ?? faker.datatype.uuid(),
    assetFileName: image.assetFileName,
    isPreview: state.isPreview,
    projectLocation: state.projectLocation
  })

  const html = createImageAssetHtml(imageId, assetUrl, imageAlt)

  state.htmlEntries.push(html)

  state.images[imageId] = {
    image_id: imageId,
    description: imageAlt,
    url: assetUrl,
    width: imageWidth,
    height: imageHeight
  }
}

function addModularContent(
  state: RichTextElementBuilderState,
  contentItem: Contracts.IViewContentItemContract
) {
  if (!state.onAddModularContent) {
    return
  }

  state.onAddModularContent(contentItem)
}

function appendLinkedItem(
  state: RichTextElementBuilderState,
  contentItem: Contracts.IViewContentItemContract
) {
  const itemCodename = contentItem.item.system.codename

  const html = createLinkedItemHtml(itemCodename)

  state.htmlEntries.push(html)

  state.modularContent.push(itemCodename)

  addModularContent(state, contentItem)
}

function isComponent(contentItem: Contracts.IViewContentItemContract) {
  const { id, name } = contentItem.item.system

  return id === name
}

function appendComponent(
  state: RichTextElementBuilderState,
  contentItem: Contracts.IViewContentItemContract
) {
  let itemId = contentItem.item.system.id
  let itemCodename = contentItem.item.system.codename

  if (!isComponent(contentItem)) {
    itemId = faker.datatype.uuid()
    itemCodename = itemId.replace('-', '_')

    contentItem.item.system.id = itemId
    contentItem.item.system.name = itemId
    contentItem.item.system.codename = itemCodename
    contentItem.item.system.workflow_step = null
  }

  const html = createComponentHtml(itemCodename)

  state.htmlEntries.push(html)

  state.modularContent.push(itemCodename)

  addModularContent(state, contentItem)
}

function clear(state: RichTextElementBuilderState) {
  state.images = {}
  state.links = {}
  state.modularContent = []
  state.htmlEntries = []
}

interface RichTextElementBuilderOptions {
  projectId?: string
  isPreview?: boolean
  projectLocation?: ProjectDataCenterLocation
  onAddModularContent?: (
    contentItem: Contracts.IViewContentItemContract
  ) => void
}

interface RichTextElementBuilderImage {
  imageId?: string
  assetId?: string
  assetFileName: string
  assetDescription?: string
  assetWidth?: number
  assetHeight?: number
}

interface RichTextElementBuilder {
  appendHtml(
    html: string,
    linkedContentItems?: Contracts.IViewContentItemContract[]
  ): RichTextElementBuilder
  appendImage(image: RichTextElementBuilderImage): RichTextElementBuilder
  appendLinkedItem(
    contentItem: Contracts.IViewContentItemContract
  ): RichTextElementBuilder
  appendComponent(
    contentItem: Contracts.IViewContentItemContract
  ): RichTextElementBuilder
  clear(): RichTextElementBuilder
  build(name: string): Contracts.IRichTextElementContract
}

function richTextElementBuilder(options?: RichTextElementBuilderOptions) {
  const state: RichTextElementBuilderState = {
    images: {},
    links: {},
    modularContent: [],
    htmlEntries: [],
    projectId: options?.projectId ?? faker.datatype.uuid(),
    isPreview: options?.isPreview ?? false,
    projectLocation:
      options?.projectLocation ?? defaultProjectDataCenterLocation,
    onAddModularContent: options?.onAddModularContent
  }

  const builder: RichTextElementBuilder = {
    appendHtml: function (html, linkedContentItems) {
      appendHtml(state, html, linkedContentItems)

      return this
    },
    appendImage: function (image) {
      appendImage(state, image)

      return this
    },
    appendLinkedItem: function (contentItem) {
      appendLinkedItem(state, contentItem)

      return this
    },
    appendComponent: function (contentItem) {
      appendComponent(state, contentItem)

      return this
    },
    clear: function () {
      clear(state)

      return this
    },
    build: function (name) {
      return createRichTextElement({
        name,
        html: state.htmlEntries.length === 0 ? '' : state.htmlEntries.join(''),
        images: state.images,
        links: state.links,
        modularContent: state.modularContent
      })
    }
  }

  return builder
}

export { richTextElementBuilder }

export type { RichTextElementBuilder, RichTextElementBuilderOptions }
