import type {
  Parent as UnistParent,
  Literal as UnistLiteral,
  Node as UnistNode
} from 'unist'

/*
https://kontent.ai/learn/reference/openapi/delivery-api/#section/HTML5-elements-allowed-in-rich-text

* [x] Root
* [x] Blocks
  * [x] Heading
  * [x] Paragraph
  * [x] List, ListItem
  * [x] Table, TableBody, TableRow, TableCell
* [x] Spans
  * [x] Strong (Span with Marks?)
  * [x] Emphasis (Span with Marks?)
  * [x] Superscript (Span with Marks?)
  * [x] Subscript (Span with Marks?)
  * [x] Code
  * [x] LineBreak (\n in Text?)
* [x] Text
* [x] Asset
* [ ] Link
* [ ] ContentItem, Component
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
  asset: 'asset',
  span: 'span',
  link: 'link',
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
  | KastAsset
  | KastSpan

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
  span: KastSpan
  text: KastText
}

interface KastParagraph extends KastParent {
  type: typeof kastNodeType.paragraph
  children: KastParagraphContent[]
}

type KastParagraphContent =
  KastParagraphContentMap[keyof KastParagraphContentMap]

interface KastParagraphContentMap {
  span: KastSpan
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
  span: KastSpan
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
  span: KastSpan
  text: KastText
}

interface KastAsset extends UnistNode<KastAssetData> {
  type: typeof kastNodeType.asset
}

type KastAssetData = {
  assetId: string
  imageId: string
  url: string
  description: string
}

const kastMarkType = {
  strong: 'strong',
  emphasis: 'emphasis',
  superscript: 'superscript',
  subscript: 'subscript',
  code: 'code'
} as const

type KastMarkType = keyof typeof kastMarkType

interface KastSpan extends KastParent {
  type: typeof kastNodeType.span
  children: KastSpanContent[]
  marks: KastMarkType[]
}

type KastSpanContent = KastSpanContentMap[keyof KastSpanContentMap]

interface KastSpanContentMap {
  text: KastText
}

const kastLinkType = {
  internal: 'internal',
  external: 'external',
  email: 'email',
  phone: 'phone',
  asset: 'asset'
} as const

type KastLinkType = keyof typeof kastLinkType

interface KastLink extends KastParent {
  type: typeof kastNodeType.link
  children: KastLinkContent[]
  data: KastLinkData
}

type KastLinkContent = KastLinkContentMap[keyof KastLinkContentMap]

interface KastLinkContentMap {
  text: KastText
}

type KastLinkData =
  | {
      type: typeof kastLinkType.internal
      itemId: string
    }
  | {
      type: typeof kastLinkType.external
      url: string
      title: string
      openInNewWindow: boolean
    }
  | {
      type: typeof kastLinkType.email
      email: string
      subject: string
    }
  | {
      type: typeof kastLinkType.phone
      phone: string
    }
  | {
      type: typeof kastLinkType.asset
      assetId: string
      url: string
    }

interface KastText extends KastLiteral {
  type: typeof kastNodeType.text
}

interface KastLiteral extends UnistLiteral {
  value: string
}

export { kastNodeType, kastListType, kastMarkType, kastLinkType }

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
  KastAsset,
  KastAssetData,
  KastSpan,
  KastSpanContent,
  KastSpanContentMap,
  KastMarkType,
  KastLinkType,
  KastLink,
  KastLinkContent,
  KastLinkContentMap,
  KastLinkData,
  KastText,
  KastLiteral
}
