import { describe, test, expect } from 'vitest'
import { faker } from '@faker-js/faker'
import { snakeCase } from 'snake-case'
import { contentItemBuilder } from './content-item-builder'

describe('withSystemData', () => {
  test('should override defaults', () => {
    const name = faker.commerce.productName()

    const overrides = {
      id: faker.datatype.uuid(),
      name,
      codename: snakeCase(name),
      language: 'en-GB',
      type: 'product',
      collection: 'products',
      sitemap_locations: ['products'],
      last_modified: faker.date.recent().toJSON(),
      workflow_step: 'review'
    }

    const contentItem = contentItemBuilder().withSystemData(overrides).build()

    const { system } = contentItem.item

    expect(system.id).toEqual(overrides.id)
    expect(system.name).toEqual(overrides.name)
    expect(system.codename).toEqual(overrides.codename)
    expect(system.language).toEqual(overrides.language)
    expect(system.type).toEqual(overrides.type)
    expect(system.collection).toEqual(overrides.collection)
    expect(system.sitemap_locations).toEqual(overrides.sitemap_locations)
    expect(system.last_modified).toEqual(overrides.last_modified)
    expect(system.workflow_step).toEqual(overrides.workflow_step)
  })
})

describe('withRichText', () => {
  test('should add a rich text element', () => {
    const html = '<p>Test test test</p>'
    const name = 'Test'
    const codename = 'test'

    const contentItem = contentItemBuilder()
      .withRichTextElement({
        name,
        codename,
        buildElement: (builder) => {
          builder.appendHtml(html)
        }
      })
      .build()

    const richText = contentItem.item.elements[codename]

    expect(richText.value).toEqual(html)
  })

  test('should add to modular content when linked item appended', () => {
    const linkedItemName = 'Linked item'
    const linkedItemCodename = 'linked_item'

    const linkedItem = contentItemBuilder()
      .withSystemData({
        name: linkedItemName,
        codename: linkedItemCodename
      })
      .withTextElement({
        name: 'Text',
        text: 'Testing'
      })
      .build()

    const name = 'Test'
    const codename = 'test'

    const contentItem = contentItemBuilder()
      .withRichTextElement({
        name,
        codename,
        buildElement: (builder) => {
          builder.appendLinkedItem(linkedItem)
        }
      })
      .build()

    const modularContentItem = contentItem.modular_content[linkedItemCodename]

    expect(modularContentItem).toEqual(linkedItem.item)
  })

  test('should add linked item modular content when linked item appended', () => {
    const linkedItemName = 'Linked item'
    const linkedItemCodename = 'linked_item'

    const linkedItem = contentItemBuilder()
      .withSystemData({
        name: linkedItemName,
        codename: linkedItemCodename
      })
      .withTextElement({
        name: 'Text',
        text: 'Testing'
      })
      .build()

    const richTextLinkedItem = contentItemBuilder()
      .withLinkedItemsElement({ name: 'Linked items', items: [linkedItem] })
      .build()

    const name = 'Test'
    const codename = 'test'

    const contentItem = contentItemBuilder()
      .withRichTextElement({
        name,
        codename,
        buildElement: (builder) => {
          builder.appendLinkedItem(richTextLinkedItem)
        }
      })
      .build()

    const modularContentItem = contentItem.modular_content[linkedItemCodename]

    expect(modularContentItem).toEqual(linkedItem.item)
  })

  test('should add to modular content when component appended', () => {
    const component = contentItemBuilder()
      .withTextElement({ name: 'Text', text: 'Testing' })
      .buildAsComponent()

    const componentCodename = component.item.system.codename

    const name = 'Test'
    const codename = 'test'

    const contentItem = contentItemBuilder()
      .withRichTextElement({
        name,
        codename,
        buildElement: (builder) => {
          builder.appendComponent(component)
        }
      })
      .build()

    const modularContentItem = contentItem.modular_content[componentCodename]

    expect(modularContentItem).toEqual(component.item)
  })
})
