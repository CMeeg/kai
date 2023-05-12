import type {
  Root as HastRoot,
  Element as HastElement,
  Text as HastText
} from 'hast'
import { visit, SKIP } from 'unist-util-visit'
import type { VisitorResult } from 'unist-util-visit'
import { kastNodeType, kastListType } from '~/kast'
import type {
  KastRoot,
  KastHeading,
  KastParagraph,
  KastList,
  KastListItem,
  KastTable,
  KastTableRow,
  KastTableCell
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

function removeNode(
  index: number | null,
  parent: HastRoot | HastElement | null
): VisitorResult {
  if (index !== null && parent != null) {
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
  parent?: HastRoot | HastElement | null
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

const elementTransformer: Partial<
  Record<
    HtmlTagName,
    (
      element: HastElement,
      index?: number | null,
      parent?: HastRoot | HastElement | null
    ) => VisitorResult
  >
> = {
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
  [htmlTagName.td]: transformTableCellElement
}

function transformElementNode(
  element: HastElement,
  index: number | null,
  parent: HastRoot | HastElement | null
): VisitorResult {
  if (!isAllowedHtmlTag(element.tagName)) {
    // This element is not allowed in Kontent Rich text fields so we will replace it with its children - see https://unifiedjs.com/learn/recipe/remove-node/

    return replaceElementWithChildren(element, index, parent)
  }

  // We don't need position
  delete element.position

  // Transform based on the element's tagName
  const transformer = elementTransformer[element.tagName]
  if (transformer) {
    return transformer(element, index, parent)
  }
}

function transformTextNode(text: HastText): VisitorResult {
  // We don't need position or data
  delete text.position
  delete text.data
}

function hastToKast() {
  // TODO: Validate nodes are valid (or remove those that aren't)

  return (tree: HastRoot) => {
    visit(tree, (node, index, parent) => {
      if (node.type === hastNodeType.root) {
        return transformRootNode(node)
      }

      if (node.type === hastNodeType.element) {
        return transformElementNode(node, index, parent)
      }

      if (node.type === hastNodeType.text) {
        return transformTextNode(node)
      }

      // If it's not a root, element or text node then we don't need it
      return removeNode(index, parent)
    })

    return tree as unknown as KastRoot
  }
}

export { hastToKast }
