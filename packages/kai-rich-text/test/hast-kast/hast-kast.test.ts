import { describe, test, expect } from 'vitest'
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeMinifyWhitespace from 'rehype-minify-whitespace'
import { hastToKast } from '~/hast-kast'
import { createFixture } from '../fixture'

describe('hastToKast', () => {
  test('sandbox', async (ctx) => {
    const fixture = createFixture(ctx)

    const html = await fixture.readHtmlFile('./line-breaks/input.html')

    const hastTree = await unified()
      .use(rehypeParse, { fragment: true })
      .parse(html)

    const actual = await unified()
      .use(rehypeMinifyWhitespace)
      .use(hastToKast)
      .run(hastTree)

    // console.log(JSON.stringify(kastTree, null, 2))

    console.dir(actual, { maxArrayLength: null, depth: null })
  })

  test('should remove unallowed html elements', async (ctx) => {
    const fixture = createFixture(ctx)

    const html = await fixture.readHtmlFile('./unallowed-elements/input.html')

    const hastTree = await unified()
      .use(rehypeParse, { fragment: true })
      .parse(html)

    const actual = await unified()
      .use(rehypeMinifyWhitespace)
      .use(hastToKast)
      .run(hastTree)

    const expected = await fixture.readJsonFile(
      './unallowed-elements/expected.json'
    )

    expect(actual).toStrictEqual(expected)
  })

  test('should remove unallowed hast nodes', async (ctx) => {
    const fixture = createFixture(ctx)

    const html = await fixture.readHtmlFile('./unallowed-nodes/input.html')

    const hastTree = await unified()
      .use(rehypeParse, { fragment: true })
      .parse(html)

    const actual = await unified()
      .use(rehypeMinifyWhitespace)
      .use(hastToKast)
      .run(hastTree)

    const expected = await fixture.readJsonFile(
      './unallowed-nodes/expected.json'
    )

    expect(actual).toStrictEqual(expected)
  })

  test('should transform allowed block level html elements', async (ctx) => {
    const fixture = createFixture(ctx)

    const html = await fixture.readHtmlFile('./allowed-blocks/input.html')

    const hastTree = await unified()
      .use(rehypeParse, { fragment: true })
      .parse(html)

    const actual = await unified()
      .use(rehypeMinifyWhitespace)
      .use(hastToKast)
      .run(hastTree)

    const expected = await fixture.readJsonFile(
      './allowed-blocks/expected.json'
    )

    expect(actual).toStrictEqual(expected)
  })

  test('should transform allowed span level html elements', async (ctx) => {
    const fixture = createFixture(ctx)

    const html = await fixture.readHtmlFile('./allowed-marks/input.html')

    const hastTree = await unified()
      .use(rehypeParse, { fragment: true })
      .parse(html)

    const actual = await unified()
      .use(rehypeMinifyWhitespace)
      .use(hastToKast)
      .run(hastTree)

    const expected = await fixture.readJsonFile('./allowed-marks/expected.json')

    expect(actual).toStrictEqual(expected)
  })

  test('should compound span level html elements when direct descendents', async (ctx) => {
    const fixture = createFixture(ctx)

    const html = await fixture.readHtmlFile('./compound-marks/input.html')

    const hastTree = await unified()
      .use(rehypeParse, { fragment: true })
      .parse(html)

    const actual = await unified()
      .use(rehypeMinifyWhitespace)
      .use(hastToKast)
      .run(hastTree)

    const expected = await fixture.readJsonFile(
      './compound-marks/expected.json'
    )

    expect(actual).toStrictEqual(expected)
  })

  test('should compound line break elements with text nodes', async (ctx) => {
    const fixture = createFixture(ctx)

    const html = await fixture.readHtmlFile('./line-breaks/input.html')

    const hastTree = await unified()
      .use(rehypeParse, { fragment: true })
      .parse(html)

    const actual = await unified()
      .use(rehypeMinifyWhitespace)
      .use(hastToKast)
      .run(hastTree)

    const expected = await fixture.readJsonFile('./line-breaks/expected.json')

    expect(actual).toStrictEqual(expected)
  })
})
