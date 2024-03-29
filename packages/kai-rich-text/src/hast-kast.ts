import type {
  Root as HastRoot,
  Element as HastElement,
  Text as HastText,
  Properties as HastProperties
} from 'hast'
import { visit, SKIP } from 'unist-util-visit'
import type { VisitorResult } from 'unist-util-visit'
import type { Elements, IContentItemsContainer } from '@kontent-ai/delivery-sdk'
import {
  kastNodeType,
  kastListType,
  kastComponentType,
  kastMarkType,
  kastLinkType
} from '~/kast'
import type {
  KastParent,
  KastContent,
  KastRoot,
  KastHeading,
  KastParagraph,
  KastList,
  KastListItem,
  KastTable,
  KastTableRow,
  KastTableCell,
  KastAsset,
  KastAssetUrlResolver,
  KastComponent,
  KastComponentItemResolver,
  KastSpan,
  KastMarkType,
  KastLink,
  KastLinkData,
  KastContentItemUrlResolver,
  KastText
} from '~/kast'

const htmlTagName = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  p: 'p',
  ol: 'ol',
  ul: 'ul',
  li: 'li',
  figure: 'figure',
  img: 'img',
  table: 'table',
  tbody: 'tbody',
  tr: 'tr',
  td: 'td',
  object: 'object',
  strong: 'strong',
  em: 'em',
  sup: 'sup',
  sub: 'sub',
  code: 'code',
  a: 'a',
  br: 'br'
} as const

type HtmlTagName = keyof typeof htmlTagName

function isAllowedHtmlTag(tagName: string): tagName is HtmlTagName {
  return !!Object.values(htmlTagName).find((htmlTag) => tagName === htmlTag)
}

const hastNodeType = {
  comment: 'comment',
  doctype: 'doctype',
  element: 'element',
  root: 'root',
  text: 'text'
} as const

// See https://unifiedjs.com/learn/recipe/remove-node/
function replaceElementWithChildren(
  element: HastElement,
  index?: number | null,
  parent?: HastRoot | HastElement | null
): VisitorResult {
  if (
    typeof index !== 'undefined' &&
    index !== null &&
    typeof parent !== 'undefined' &&
    parent !== null
  ) {
    parent.children.splice(index, 1, ...element.children)

    // Skip this node and continue traversing
    return [SKIP, index]
  }
}

// See https://unifiedjs.com/learn/recipe/remove-node/
function removeNode(
  index?: number | null,
  parent?: HastRoot | HastElement | null
): VisitorResult {
  if (
    typeof index !== 'undefined' &&
    index !== null &&
    typeof parent !== 'undefined' &&
    parent !== null
  ) {
    parent.children.splice(index, 1)

    // Do not traverse `node`, continue at the node *now* at `index`.
    return [SKIP, index]
  }
}

function transformRootNode(root: HastRoot): VisitorResult {
  // We don't need position or data
  delete root.position
  delete root.data
}

type ElementTransformer = (
  element: HastElement,
  index?: number | null,
  parent?: HastRoot | HastElement | null,
  options?: HastToKastOptions
) => VisitorResult

const transformHeadingElement: ElementTransformer = (element) => {
  const { tagName } = element

  const level = parseInt(tagName.substring(1))

  //@ts-expect-error tagName is required of HastElement, but not KastElement
  delete element.tagName
  delete element.properties

  const heading = element as unknown as KastHeading
  heading.type = kastNodeType.heading
  heading.level = level
}

const transformParagraphElement: ElementTransformer = (element) => {
  //@ts-expect-error tagName is required of HastElement, but not KastElement
  delete element.tagName
  delete element.properties

  const paragraph = element as unknown as KastParagraph
  paragraph.type = kastNodeType.paragraph
}

const transformListElement: ElementTransformer = (element) => {
  const { tagName } = element

  //@ts-expect-error tagName is required of HastElement, but not KastElement
  delete element.tagName
  delete element.properties

  const list = element as unknown as KastList
  list.type = kastNodeType.list
  list.listType =
    tagName === 'ol' ? kastListType.ordered : kastListType.unordered
}

const transformListItemElement: ElementTransformer = (element) => {
  //@ts-expect-error tagName is required of HastElement, but not KastElement
  delete element.tagName
  delete element.properties

  const listItem = element as unknown as KastListItem
  listItem.type = kastNodeType.listItem
}

const transformTableElement: ElementTransformer = (element) => {
  //@ts-expect-error tagName is required of HastElement, but not KastElement
  delete element.tagName
  delete element.properties

  const table = element as unknown as KastTable
  table.type = kastNodeType.table
}

const transformTableRowElement: ElementTransformer = (element) => {
  //@ts-expect-error tagName is required of HastElement, but not KastElement
  delete element.tagName
  delete element.properties

  const tableRow = element as unknown as KastTableRow
  tableRow.type = kastNodeType.tableRow
}

const transformTableCellElement: ElementTransformer = (element) => {
  //@ts-expect-error tagName is required of HastElement, but not KastElement
  delete element.tagName
  delete element.properties

  const tableCell = element as unknown as KastTableCell
  tableCell.type = kastNodeType.tableCell
}

const transformAssetElement: ElementTransformer = (
  element,
  index,
  parent,
  options
) => {
  if (!element.properties) {
    return removeNode(index, parent)
  }

  const { src, dataAssetId, dataImageId, alt } = element.properties

  //@ts-expect-error tagName is required of HastElement, but not KastElement
  delete element.tagName
  //@ts-expect-error children is required of HastElement, but not KastAsset
  delete element.children
  delete element.properties

  const asset = element as unknown as KastAsset
  asset.type = kastNodeType.asset
  asset.data = {
    assetId: String(dataAssetId ?? ''),
    imageId: String(dataImageId ?? ''),
    url: String(src ?? ''),
    description: String(alt ?? '')
  }

  const richTextImage = options?.element?.images.find(
    (image) => image.imageId === asset.data?.imageId
  )

  if (richTextImage) {
    asset.data.width = richTextImage.width
    asset.data.height = richTextImage.height

    if (options?.assetUrlResolver) {
      asset.data.url = options.assetUrlResolver(asset.data.url)
    }
  }
}

function getLinkedItem(itemCodename: string, options?: HastToKastOptions) {
  if (!itemCodename || !options?.linkedItems) {
    return undefined
  }

  return options.linkedItems[itemCodename]
}

const transformComponentElement: ElementTransformer = (
  element,
  index,
  parent,
  options
) => {
  if (!element.properties) {
    return removeNode(index, parent)
  }

  const { dataRel, dataCodename } = element.properties

  //@ts-expect-error tagName is required of HastElement, but not KastElement
  delete element.tagName
  //@ts-expect-error children is required of HastElement, but not KastComponent
  delete element.children
  delete element.properties

  const component = element as unknown as KastComponent
  component.type = kastNodeType.component
  component.data = {
    type:
      String(dataRel ?? '') === 'link'
        ? kastComponentType.item
        : kastComponentType.component,
    codename: String(dataCodename ?? '')
  }

  const contentItem = component.data.codename
    ? getLinkedItem(component.data.codename, options)
    : undefined

  if (contentItem && options?.componentItemResolver) {
    component.data.item = options.componentItemResolver(contentItem)
  }
}

const tagMarkMap: Partial<Record<HtmlTagName, KastMarkType>> = {
  [htmlTagName.strong]: kastMarkType.strong,
  [htmlTagName.em]: kastMarkType.emphasis,
  [htmlTagName.sup]: kastMarkType.superscript,
  [htmlTagName.sub]: kastMarkType.subscript,
  [htmlTagName.code]: kastMarkType.code
}

function getMarkType(tagName: string): KastMarkType | null {
  if (!isAllowedHtmlTag(tagName)) {
    return null
  }

  return tagMarkMap[tagName] ?? null
}

const transformSpanElement: ElementTransformer = (element, index, parent) => {
  const { tagName } = element
  const markType = getMarkType(tagName)

  const kastParent = parent as unknown as KastParent

  if (kastParent?.type === kastNodeType.span) {
    // If the parent is also a span then we can just add this element as an additional mark and then move on to processing its children

    if (markType) {
      const kastSpan = kastParent as KastSpan
      kastSpan.marks.push(markType)
    }

    return replaceElementWithChildren(element, index, parent)
  }

  // Transform this element to a span

  //@ts-expect-error tagName is required of HastElement, but not KastElement
  delete element.tagName
  delete element.properties

  const span = element as unknown as KastSpan
  span.type = kastNodeType.span
  span.marks = markType ? [markType] : []
}

function createLinkData(
  properties: HastProperties | undefined
): KastLinkData | undefined {
  if (!properties) {
    return undefined
  }

  const {
    dataItemId,
    href,
    dataNewWindow,
    title,
    dataEmailAddress,
    dataEmailSubject,
    dataPhoneNumber,
    dataAssetId
  } = properties

  if (dataItemId) {
    return {
      type: kastLinkType.internal,
      itemId: String(dataItemId ?? '')
    }
  }

  if (dataAssetId) {
    return {
      type: kastLinkType.asset,
      assetId: String(dataAssetId ?? ''),
      url: String(href ?? '')
    }
  }

  if (dataEmailAddress) {
    return {
      type: kastLinkType.email,
      email: String(dataEmailAddress ?? ''),
      subject: String(dataEmailSubject ?? '')
    }
  }

  if (dataPhoneNumber) {
    return {
      type: kastLinkType.phone,
      phone: String(dataPhoneNumber ?? '')
    }
  }

  // If none of the above matched then it must be an external link
  return {
    type: kastLinkType.external,
    url: String(href ?? ''),
    title: String(title ?? ''),
    openInNewWindow: String(dataNewWindow ?? 'false') === 'true'
  }
}

function getContentItemUrl(
  itemCodename: string,
  options?: HastToKastOptions
): ReturnType<KastContentItemUrlResolver> | undefined {
  if (!options?.contentItemUrlResolver) {
    return undefined
  }

  // Try to get the linkedItem using the codename
  const contentItem = getLinkedItem(itemCodename, options)

  if (!contentItem) {
    return undefined
  }

  return options.contentItemUrlResolver(contentItem)
}

const transformLinkElement: ElementTransformer = (
  element,
  index,
  parent,
  options
) => {
  const linkData = createLinkData(element.properties)

  if (!linkData) {
    return removeNode(index, parent)
  }

  //@ts-expect-error tagName is required of HastElement, but not KastElement
  delete element.tagName
  delete element.properties

  const link = element as unknown as KastLink
  link.type = kastNodeType.link
  link.data = linkData

  if (linkData.type === kastLinkType.internal) {
    const richTextLink = options?.element?.links.find(
      (l) => l.linkId === linkData.itemId
    )

    if (richTextLink) {
      linkData.itemCodename = richTextLink.codename
      linkData.itemType = richTextLink.type
      linkData.itemUrlSlug = richTextLink.urlSlug

      const url = getContentItemUrl(linkData.itemCodename, options)

      if (typeof url !== 'undefined') {
        linkData.itemUrl = url
      }
    }
  }
}

function getPreviousSibling(
  index?: number | null,
  parent?: HastRoot | HastElement | null
): KastContent | null {
  if (
    typeof index !== 'undefined' &&
    index !== null &&
    index > 0 &&
    (parent?.children.length ?? 0) > 0
  ) {
    const sibling = parent?.children[index - 1]

    return sibling as unknown as KastContent
  }

  return null
}

const lineBreakValue = '\n'

const transformLineBreak: ElementTransformer = (element, index, parent) => {
  //@ts-expect-error tagName is required of HastElement, but not KastText
  delete element.tagName
  //@ts-expect-error children is required of HastElement, but not KastText
  delete element.children
  delete element.properties

  const sibling = getPreviousSibling(index, parent)

  if (sibling?.type !== kastNodeType.text) {
    // The previous sibling is not of type text so transform to a text node

    const text = element as unknown as KastText
    text.type = kastNodeType.text
    text.value = lineBreakValue

    return
  }

  // The previous sibling is of type text so append the line break and skip this node

  sibling.value += lineBreakValue

  return removeNode(index, parent)
}

const elementTransformer: Partial<Record<HtmlTagName, ElementTransformer>> = {
  [htmlTagName.h1]: transformHeadingElement,
  [htmlTagName.h2]: transformHeadingElement,
  [htmlTagName.h3]: transformHeadingElement,
  [htmlTagName.h4]: transformHeadingElement,
  [htmlTagName.h5]: transformHeadingElement,
  [htmlTagName.h6]: transformHeadingElement,
  [htmlTagName.p]: transformParagraphElement,
  [htmlTagName.ol]: transformListElement,
  [htmlTagName.ul]: transformListElement,
  [htmlTagName.li]: transformListItemElement,
  [htmlTagName.table]: transformTableElement,
  [htmlTagName.tbody]: replaceElementWithChildren,
  [htmlTagName.tr]: transformTableRowElement,
  [htmlTagName.td]: transformTableCellElement,
  [htmlTagName.figure]: replaceElementWithChildren,
  [htmlTagName.img]: transformAssetElement,
  [htmlTagName.object]: transformComponentElement,
  [htmlTagName.strong]: transformSpanElement,
  [htmlTagName.em]: transformSpanElement,
  [htmlTagName.sup]: transformSpanElement,
  [htmlTagName.sub]: transformSpanElement,
  [htmlTagName.code]: transformSpanElement,
  [htmlTagName.a]: transformLinkElement,
  [htmlTagName.br]: transformLineBreak
}

function transformElementNode(
  element: HastElement,
  index: number | null,
  parent: HastRoot | HastElement | null,
  options?: HastToKastOptions
): VisitorResult {
  if (!isAllowedHtmlTag(element.tagName)) {
    // This element is not allowed in Kontent Rich text fields so we will replace it with its children

    return replaceElementWithChildren(element, index, parent)
  }

  // Transform based on the element's tagName
  const transformer = elementTransformer[element.tagName]

  if (!transformer) {
    // We don't know how to transform this tag so we will remove it

    return replaceElementWithChildren(element, index, parent)
  }

  // We don't need position on any element node
  delete element.position

  // Run the transformer
  return transformer(element, index, parent, options)
}

function transformTextNode(
  text: HastText,
  index: number | null,
  parent: HastRoot | HastElement | null
): VisitorResult {
  const sibling = getPreviousSibling(index, parent)

  if (sibling?.type !== kastNodeType.text) {
    // The previous sibling is not of type text so transform to a text node

    // We don't need position or data
    delete text.position
    delete text.data

    return
  }

  // The previous sibling is of type text so append the line break and skip this node

  sibling.value += text.value

  return removeNode(index, parent)
}

function isEmpty(root: KastRoot) {
  if (root.children.length === 0) {
    // No children so is empty
    return true
  }

  if (root.children.length > 1) {
    // More than one child so not empty
    return false
  }

  if (
    root.children[0].type === kastNodeType.asset ||
    root.children[0].type === kastNodeType.component
  ) {
    // Assets and components do not have children so not empty
    return false
  }

  if (root.children[0].children.length === 0) {
    // Only child has no children so is empty
    return true
  }

  if (root.children[0].children.length > 1) {
    // Only child has no more than one child so not empty
    return false
  }

  if (
    root.children[0].type === kastNodeType.paragraph &&
    root.children[0].children[0].type === kastNodeType.text &&
    root.children[0].children[0].value === lineBreakValue
  ) {
    // Onlly child is a paragraph containing a single line break so is empty
    return true
  }

  // Otherwise not empty
  return false
}

interface HastToKastOptions {
  element?: Elements.RichTextElement
  linkedItems?: IContentItemsContainer
  assetUrlResolver?: KastAssetUrlResolver
  contentItemUrlResolver?: KastContentItemUrlResolver
  componentItemResolver?: KastComponentItemResolver
}

function hastToKast(options?: HastToKastOptions) {
  return (tree: HastRoot) => {
    visit(tree, (node, index, parent) => {
      if (node.type === hastNodeType.root) {
        return transformRootNode(node)
      }

      if (node.type === hastNodeType.element) {
        return transformElementNode(node, index, parent, options)
      }

      if (node.type === hastNodeType.text) {
        return transformTextNode(node, index, parent)
      }

      // If it's not a root, element or text node then we don't need it
      return removeNode(index, parent)
    })

    const kast = tree as unknown as KastRoot

    if (isEmpty(kast)) {
      // If empty zero the children
      kast.children.length = 0
    }

    return kast
  }
}

export { hastToKast }
