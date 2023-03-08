const elementTypeName = {
  asset: 'asset',
  custom: 'custom',
  dateTime: 'date_time',
  linkedItems: 'modular_content',
  multipleChoice: 'multiple_choice',
  number: 'number',
  richText: 'rich_text',
  taxonomy: 'taxonomy',
  text: 'text',
  urlSlug: 'url_slug'
} as const

type ElementTypeName = (typeof elementTypeName)[keyof typeof elementTypeName]

export { elementTypeName }

export type { ElementTypeName }
