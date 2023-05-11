import { describe, test, expect } from 'vitest'
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import { hastToKast } from '~/hast-kast'
import { createFixture } from '../fixture'

describe('hastToKast', () => {
  test('sandbox', async () => {
    const hastTree = await unified()
      .use(rehypeParse, { fragment: true })
      .parse('<h1>Heading 1</h1>')

    const kastTree = await unified().use(hastToKast).run(hastTree)

    // console.log(JSON.stringify(kastTree, null, 2))

    console.dir(kastTree, { maxArrayLength: null, depth: null })
  })

  test('should remove elements not allowed in Kontent Rich text', async (ctx) => {
    const fixture = createFixture(ctx)

    const html = await fixture.readHtmlFile('./unallowed-elements/input.html')

    const hastTree = await unified()
      .use(rehypeParse, { fragment: true })
      .parse(html)

    const actual = await unified().use(hastToKast).run(hastTree)

    const expected = await fixture.readJsonFile(
      './unallowed-elements/expected.json'
    )

    expect(actual).toStrictEqual(expected)
  })

  test('should remove comments', async (ctx) => {
    const fixture = createFixture(ctx)

    const html = await fixture.readHtmlFile('./unallowed-nodes/input.html')

    const hastTree = await unified()
      .use(rehypeParse, { fragment: true })
      .parse(html)

    const actual = await unified().use(hastToKast).run(hastTree)

    const expected = await fixture.readJsonFile(
      './unallowed-nodes/expected.json'
    )

    expect(actual).toStrictEqual(expected)
  })
})
