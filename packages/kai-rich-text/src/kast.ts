import type { Parent as UnistParent, Literal as UnistLiteral } from 'unist'

/*
https://kontent.ai/learn/reference/openapi/delivery-api/#section/HTML5-elements-allowed-in-rich-text

* Root
* Blocks
  * Heading
  * Paragraph
  * List, ListItem
  * Table, TableBody, TableRow, TableCell
* Spans
  * Strong (Span with Marks?)
  * Emphasis (Span with Marks?)
  * Superscript (Span with Marks?)
  * Subscript (Span with Marks?)
  * Code
  * LineBreak (\n in Text?)
* Text
* Asset
* Link
* ContentItem
* Component
*/

const kastNodeType = {
  root: 'root',
  heading: 'heading',
  paragraph: 'paragraph',
  list: 'list',
  listItem: 'listItem',
  table: 'table',
  tableRow: 'tableRow',
  tableCell: 'tableCell',
  text: 'text'
} as const

type KastNodeType = keyof typeof kastNodeType

interface KastParent extends UnistParent {
  children: KastContent[]
}

type KastContent =
  | KastRootContent
  | KastHeadingContent
  | KastParagraph
  | KastList
  | KastListItem
  | KastTable
  | KastTableRow
  | KastTableCell

interface KastRoot extends KastParent {
  type: typeof kastNodeType.root
  children: KastRootContent[]
}

type KastRootContent = KastRootContentMap[keyof KastRootContentMap]

interface KastRootContentMap {
  heading: KastHeading
  paragraph: KastParagraph
  list: KastList
  table: KastTable
}

interface KastHeading extends KastParent {
  type: typeof kastNodeType.heading
  children: KastHeadingContent[]
  level: number
}

type KastHeadingContent = KastHeadingContentMap[keyof KastHeadingContentMap]

/**
 * TODO: This comment is interesting, and the capability is worth preserving for custom elements?
 * This map registers all node types that may be used as content in an element.
 *
 * These types are accepted inside `element` nodes.
 *
 * This interface can be augmented to register custom node types.
 *
 * @example
 * declare module 'kast' {
 *   interface ElementContentMap {
 *     custom: Custom;
 *   }
 * }
 */
interface KastHeadingContentMap {
  text: KastText
}

interface KastParagraph extends KastParent {
  type: typeof kastNodeType.paragraph
  children: KastParagraphContent[]
}

type KastParagraphContent =
  KastParagraphContentMap[keyof KastParagraphContentMap]

interface KastParagraphContentMap {
  text: KastText
}

const kastListType = {
  ordered: 'ordered',
  unordered: 'unordered'
} as const

type KastListType = keyof typeof kastListType

interface KastList extends KastParent {
  type: typeof kastNodeType.list
  children: KastListContent[]
  listType: KastListType
}

type KastListContent = KastListContentMap[keyof KastListContentMap]

interface KastListContentMap {
  listItem: KastListItem
}

interface KastListItem extends KastParent {
  type: typeof kastNodeType.listItem
  children: KastListItemContent[]
}

type KastListItemContent = KastListItemContentMap[keyof KastListItemContentMap]

interface KastListItemContentMap {
  text: KastText
}

interface KastTable extends KastParent {
  type: typeof kastNodeType.table
  children: KastTableContent[]
}

type KastTableContent = KastTableContentMap[keyof KastTableContentMap]

interface KastTableContentMap {
  tableRow: KastTableRow
}

interface KastTableRow extends KastParent {
  type: typeof kastNodeType.tableRow
  children: KastTableRowContent[]
}

type KastTableRowContent = KastTableRowContentMap[keyof KastTableRowContentMap]

interface KastTableRowContentMap {
  tableCell: KastTableCell
}

interface KastTableCell extends KastParent {
  type: typeof kastNodeType.tableCell
  children: KastTableCellContent[]
}

type KastTableCellContent =
  KastTableCellContentMap[keyof KastTableCellContentMap]

interface KastTableCellContentMap {
  text: KastText
}

interface KastText extends KastLiteral {
  type: typeof kastNodeType.text
}

interface KastLiteral extends UnistLiteral {
  value: string
}

export { kastNodeType, kastListType }

export type {
  KastNodeType,
  KastParent,
  KastContent,
  KastRoot,
  KastRootContent,
  KastRootContentMap,
  KastHeading,
  KastHeadingContent,
  KastHeadingContentMap,
  KastParagraph,
  KastParagraphContent,
  KastParagraphContentMap,
  KastListType,
  KastList,
  KastListContent,
  KastListContentMap,
  KastListItem,
  KastListItemContent,
  KastListItemContentMap,
  KastTable,
  KastTableContent,
  KastTableContentMap,
  KastTableRow,
  KastTableRowContent,
  KastTableRowContentMap,
  KastTableCell,
  KastTableCellContent,
  KastTableCellContentMap,
  KastText,
  KastLiteral
}
