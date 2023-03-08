import type { Contracts } from '@kontent-ai/delivery-sdk'
import { faker } from '@faker-js/faker'
import { snakeCase } from 'snake-case'
import { projectDataCenterLocation } from './project'
import type { ProjectDataCenterLocation } from './project'
import {
  createAssetElement,
  createCustomElement,
  createDateTimeElement,
  createLinkedItemsElement,
  createMultipleChoiceElement,
  createNumberElement,
  createTaxonomyElement,
  createTextElement,
  createUrlSlugElement,
  richTextElementBuilder
} from './elements'
import type {
  ContentItemAssetElement,
  CreateAssetElementOptions,
  CreateCustomElementOptions,
  CreateDateTimeElementOptions,
  CreateLinkedItemsElementOptions,
  CreateMultipleChoiceElementOptions,
  CreateNumberElementOptions,
  CreateTaxonomyElementOptions,
  CreateTextElementOptions,
  CreateUrlSlugElementOptions,
  RichTextElementBuilder
} from './elements'

function setSystemData(
  state: ContentItemBuilderState,
  data: Partial<Contracts.IContentItemSystemAttributesContract>
) {
  const stateSystem = state.system
  const mergedSystem = Object.assign(stateSystem, data)

  state.system = mergedSystem
}

const publishedWorkflowStep = 'published'

function createDefaultSystemData() {
  const name = faker.word.noun()
  const codename = createElementCodename(name)

  const data: Contracts.IContentItemSystemAttributesContract = {
    id: faker.datatype.uuid(),
    name,
    codename,
    language: 'default',
    type: 'content_type',
    collection: 'default',
    sitemap_locations: [],
    last_modified: faker.date.recent().toJSON(),
    workflow_step: publishedWorkflowStep
  }

  return data
}

function createElementCodename(name: string, codename?: string) {
  return codename || snakeCase(name)
}

function isPublished(state: ContentItemBuilderState) {
  const workflowStep = state.system.workflow_step

  if (!workflowStep) {
    return true
  }

  return workflowStep === publishedWorkflowStep
}

function setAssetElement(
  state: ContentItemBuilderState,
  assets: ContentItemAssetElement[],
  name: string,
  codename?: string
) {
  const key = createElementCodename(name, codename)
  const value = createAssetElement({
    name,
    assets,
    projectId: state.projectId,
    isPreview: !isPublished(state),
    projectLocation: state.projectLocation
  })

  state.elements[key] = value
}

function setCustomElement(
  state: ContentItemBuilderState,
  value: string | null,
  name: string,
  codename?: string
) {
  const key = createElementCodename(name, codename)
  const val = createCustomElement({ name, value })

  state.elements[key] = val
}

function setDateTimeElement(
  state: ContentItemBuilderState,
  dateTime: Date | null,
  name: string,
  codename?: string
) {
  const key = createElementCodename(name, codename)
  const value = createDateTimeElement({ name, dateTime })

  state.elements[key] = value
}

function setModularContent(
  state: ContentItemBuilderState,
  items: Contracts.IViewContentItemContract[]
) {
  if (!items?.length) {
    return
  }

  items.forEach((linkedItem) => {
    const { item } = linkedItem
    const { codename } = item.system

    state.modularContent[codename] = item

    const { modular_content: modularContent } = linkedItem

    Object.assign(state.modularContent, modularContent)
  })
}

function setLinkedItemsElement(
  state: ContentItemBuilderState,
  items: Contracts.IViewContentItemContract[],
  name: string,
  codename?: string
) {
  const key = createElementCodename(name, codename)
  const value = createLinkedItemsElement({ name, items })

  state.elements[key] = value

  setModularContent(state, items)
}

function setMultipleChoiceElement(
  state: ContentItemBuilderState,
  options: string[],
  name: string,
  codename?: string
) {
  const key = createElementCodename(name, codename)
  const value = createMultipleChoiceElement({ name, options })

  state.elements[key] = value
}

function setNumberElement(
  state: ContentItemBuilderState,
  number: number | null,
  name: string,
  codename?: string
) {
  const key = createElementCodename(name, codename)
  const value = createNumberElement({ name, number })

  state.elements[key] = value
}

function addModularContent(
  state: ContentItemBuilderState,
  contentItem: Contracts.IViewContentItemContract
) {
  state.modularContent[contentItem.item.system.codename] = contentItem.item

  Object.entries(contentItem.modular_content).forEach(([key, value]) => {
    state.modularContent[key] = value
  })
}

function setRichTextElement(
  state: ContentItemBuilderState,
  buildElement: (builder: RichTextElementBuilder) => void,
  name: string,
  codename?: string
) {
  const builder = richTextElementBuilder({
    projectId: state.projectId,
    isPreview: !isPublished(state),
    projectLocation: state.projectLocation,
    onAddModularContent: (contentItem: Contracts.IViewContentItemContract) =>
      addModularContent(state, contentItem)
  })

  buildElement(builder)

  const key = createElementCodename(name, codename)
  const value = builder.build(name)

  state.elements[key] = value
}

function setTaxonomyElement(
  state: ContentItemBuilderState,
  terms: string[],
  name: string,
  group?: string,
  codename?: string
) {
  const key = createElementCodename(name, codename)
  const value = createTaxonomyElement({ name, terms, group: group || key })

  state.elements[key] = value
}

function setTextElement(
  state: ContentItemBuilderState,
  text: string | null,
  name: string,
  codename?: string
) {
  const key = createElementCodename(name, codename)
  const value = createTextElement({ name, text })

  state.elements[key] = value
}

function setUrlSlugElement(
  state: ContentItemBuilderState,
  urlSlug: string | null,
  name: string,
  codename?: string
) {
  const key = createElementCodename(name, codename)
  const value = createUrlSlugElement({ name, urlSlug })

  state.elements[key] = value
}

function createComponentContentItem(state: ContentItemBuilderState) {
  const itemId = faker.datatype.uuid()
  const itemCodename = itemId.replace('-', '_')

  const system = {
    ...state.system,
    id: itemId,
    name: itemId,
    codename: itemCodename,
    workflow_step: null
  }

  const contentItem: Contracts.IViewContentItemContract = {
    item: {
      system,
      elements: state.elements
    },
    modular_content: state.modularContent
  }

  return contentItem
}

function createContentItem(state: ContentItemBuilderState) {
  const contentItem: Contracts.IViewContentItemContract = {
    item: {
      system: state.system,
      elements: state.elements
    },
    modular_content: state.modularContent
  }

  return contentItem
}

interface ContentItemBuilderState {
  projectId: string
  projectLocation: ProjectDataCenterLocation
  system: Contracts.IContentItemSystemAttributesContract
  elements: Contracts.IContentItemElementsContracts
  modularContent: Contracts.IModularContentContract
}

interface ContentItemBuilderOptions {
  projectId?: string
  projectLocation?: ProjectDataCenterLocation
}

type ContentItemBuilderElementOptions<T> = T & {
  codename?: string
}

interface ContentItemBuilder {
  withSystemData(
    data: Partial<Contracts.IContentItemSystemAttributesContract>
  ): ContentItemBuilder
  withAssetElement(
    options: ContentItemBuilderElementOptions<
      Pick<CreateAssetElementOptions, 'name' | 'assets'>
    >
  ): ContentItemBuilder
  withCustomElement(
    options: ContentItemBuilderElementOptions<CreateCustomElementOptions>
  ): ContentItemBuilder
  withDateTimeElement(
    options: ContentItemBuilderElementOptions<CreateDateTimeElementOptions>
  ): ContentItemBuilder
  withLinkedItemsElement(
    options: ContentItemBuilderElementOptions<CreateLinkedItemsElementOptions>
  ): ContentItemBuilder
  withMultipleChoiceElement(
    options: ContentItemBuilderElementOptions<CreateMultipleChoiceElementOptions>
  ): ContentItemBuilder
  withNumberElement(
    options: ContentItemBuilderElementOptions<CreateNumberElementOptions>
  ): ContentItemBuilder
  withRichTextElement(options: {
    name: string
    buildElement: (builder: RichTextElementBuilder) => void
    codename?: string
  }): ContentItemBuilder
  withTaxonomyElement(
    options: ContentItemBuilderElementOptions<CreateTaxonomyElementOptions>
  ): ContentItemBuilder
  withTextElement(
    options: ContentItemBuilderElementOptions<CreateTextElementOptions>
  ): ContentItemBuilder
  withUrlSlugElement(
    options: ContentItemBuilderElementOptions<CreateUrlSlugElementOptions>
  ): ContentItemBuilder
  build(): Contracts.IViewContentItemContract
  buildAsComponent(): Contracts.IViewContentItemContract
}

function contentItemBuilder(options?: ContentItemBuilderOptions) {
  const state: ContentItemBuilderState = {
    projectId: options?.projectId ?? faker.datatype.uuid(),
    projectLocation:
      options?.projectLocation ?? projectDataCenterLocation.netherlands,
    system: createDefaultSystemData(),
    elements: {},
    modularContent: {}
  }

  const builder: ContentItemBuilder = {
    withSystemData: function (data) {
      setSystemData(state, data)

      return this
    },
    withAssetElement: function (options) {
      setAssetElement(state, options.assets, options.name, options.codename)

      return this
    },
    withCustomElement(options) {
      setCustomElement(state, options.value, options.name, options.codename)

      return this
    },
    withDateTimeElement: function (options) {
      setDateTimeElement(
        state,
        options.dateTime,
        options.name,
        options.codename
      )

      return this
    },
    withLinkedItemsElement: function (options) {
      setLinkedItemsElement(
        state,
        options.items,
        options.name,
        options.codename
      )

      return this
    },
    withMultipleChoiceElement: function (options) {
      setMultipleChoiceElement(
        state,
        options.options,
        options.name,
        options.codename
      )

      return this
    },
    withNumberElement: function (options) {
      setNumberElement(state, options.number, options.name, options.codename)

      return this
    },
    withRichTextElement: function (options) {
      setRichTextElement(
        state,
        options.buildElement,
        options.name,
        options.codename
      )

      return this
    },
    withTaxonomyElement: function (options) {
      setTaxonomyElement(
        state,
        options.terms,
        options.name,
        options.group,
        options.codename
      )

      return this
    },
    withTextElement: function (options) {
      setTextElement(state, options.text, options.name, options.codename)

      return this
    },
    withUrlSlugElement: function (options) {
      setUrlSlugElement(state, options.urlSlug, options.name, options.codename)

      return this
    },
    build: function () {
      return createContentItem(state)
    },
    buildAsComponent: function () {
      return createComponentContentItem(state)
    }
  }

  return builder
}

export { contentItemBuilder }

export type { ContentItemBuilder, ContentItemBuilderOptions }
