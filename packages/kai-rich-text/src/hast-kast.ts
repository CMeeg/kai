import type {
  Root as HastRoot,
  Element as HastElement,
  Text as HastText
} from 'hast'
import { visit, SKIP } from 'unist-util-visit'
import type { VisitorResult } from 'unist-util-visit'
import { kastNodeType, kastListType, kastMarkType } from '~/kast'
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
  KastSpan,
  KastMarkType,
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
  [htmlTagName.td]: transformTableCellElement,
  [htmlTagName.strong]: transformSpanElement,
  [htmlTagName.em]: transformSpanElement,
  [htmlTagName.sup]: transformSpanElement,
  [htmlTagName.sub]: transformSpanElement,
  [htmlTagName.code]: transformSpanElement,
  [htmlTagName.br]: transformLineBreak
}

function transformElementNode(
  element: HastElement,
  index: number | null,
  parent: HastRoot | HastElement | null
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
  return transformer(element, index, parent)
}

function transformTextNode(
  text: HastText,
  index: number | null,
  parent: HastRoot | HastElement | null
): VisitorResult {
  // TODO: If previous sibling is also a text node then concatenate them together

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

function hastToKast() {
  return (tree: HastRoot) => {
    visit(tree, (node, index, parent) => {
      if (node.type === hastNodeType.root) {
        return transformRootNode(node)
      }

      if (node.type === hastNodeType.element) {
        return transformElementNode(node, index, parent)
      }

      if (node.type === hastNodeType.text) {
        return transformTextNode(node, index, parent)
      }

      // If it's not a root, element or text node then we don't need it
      return removeNode(index, parent)
    })

    return tree as unknown as KastRoot
  }
}

export { hastToKast }
