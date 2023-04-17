import { ElementType } from '@kontent-ai/delivery-sdk'
import type {
  IContentItem,
  IContentItemElements,
  Elements,
  IContentItemSystemAttributes
} from '@kontent-ai/delivery-sdk'
import type { ContentItemUrlResolver } from '~/routing'

type KaiContentItem<T extends IContentItem> = T & {
  [Property in keyof T]: T[Property] extends IContentItemElements
    ? KaiContentItemElements<T[Property]>
    : T[Property] extends IContentItemSystemAttributes
    ? KaiContentItemSystemAttributes<T[Property]>
    : T[Property]
} & {
  kai: {
    url?: string | null
  }
}

type KaiContentItemElements<T extends IContentItemElements> = T & {
  [Property in keyof T]: T[Property] extends Elements.LinkedItemsElement
    ? KaiLinkedItemsElement<T[Property]>
    : T[Property] extends Elements.RichTextElement
    ? KaiRichTextElement<T[Property]>
    : T[Property]
}

type KaiLinkedItemsElement<T> = T & {
  [Property in keyof T]: T[Property] extends IContentItem[]
    ? KaiContentItem<ArrayElement<T[Property]>>[]
    : T[Property]
}

type ArrayElement<TArray extends readonly unknown[]> =
  TArray extends readonly (infer ArrayElementType)[] ? ArrayElementType : never

// TODO: Need to type "portable text"?
type KaiRichTextElement<T> = T & {
  kai: {
    portableText: unknown
  }
}

type KaiContentItemSystemAttributes<
  T extends IContentItemSystemAttributes = IContentItemSystemAttributes
> = T & {
  kai: {
    isComponent: boolean
  }
}

function createSystemAttributes(
  system: IContentItemSystemAttributes
): KaiContentItemSystemAttributes {
  return {
    ...system,
    kai: {
      isComponent: system.name === system.id
    }
  }
}

function createElements<T extends IContentItemElements>(
  elements: T
): KaiContentItemElements<T> {
  const mappedElements = {} as KaiContentItemElements<T>

  const keys = Object.keys(elements)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const element = elements[key]

    if (element.type === ElementType.ModularContent) {
      const linkedItemsElement = element as Elements.LinkedItemsElement

      // TODO: Need to map linkedItems from the response first and then we can copy the mapped linked item across
      Object.assign(mappedElements, { [key]: linkedItemsElement })
    } else if (element.type === ElementType.RichText) {
      const richTextElement = element as Elements.RichTextElement

      // TODO: Need to clone the richTextElement and then add portable text to it

      Object.assign(mappedElements, {
        [key]: { ...richTextElement, kai: { portableText: '' } }
      })
    } else {
      // TODO: Need to clone the object, not copy it
      Object.assign(mappedElements, { [key]: element })
    }
  }

  return mappedElements
}

function createKaiContentItem<T extends IContentItem>(
  contentItem: T,
  urlResolver: ContentItemUrlResolver
): KaiContentItem<T> {
  const url = urlResolver.resolve(contentItem)

  // TODO: Does this need the type assertion (is there a better way to do this)?
  return {
    system: createSystemAttributes(contentItem.system),
    elements: createElements(contentItem.elements),
    kai: {
      url
    }
  } as unknown as KaiContentItem<T>
}

export { createKaiContentItem }

export type {
  KaiContentItem,
  KaiContentItemSystemAttributes,
  KaiContentItemElements,
  KaiLinkedItemsElement,
  KaiRichTextElement
}
