import { describe, test, expect } from 'vitest'
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import { hastToKast } from './hast-kast'

describe('hastToKast', () => {
  test('sandbox', async () => {
    const hastTree = await unified()
      .use(rehypeParse, { fragment: true })
      .parse('<h1>Heading 1</h1>')

    const kastTree = await unified().use(hastToKast).run(hastTree)

    // console.log(JSON.stringify(kastTree, null, 2))

    console.dir(kastTree, { maxArrayLength: null, depth: null })
  })

  test('should remove elements not allowed in Kontent Rich text', async () => {
    // TODO: Need a better test!
    const html = '<h1><b>Heading 1</b></h1>'

    const hastTree = await unified()
      .use(rehypeParse, { fragment: true })
      .parse(html)

    const kastTree = await unified().use(hastToKast).run(hastTree)

    const h1 = kastTree.children[0]

    expect(h1.children[0].type).toEqual('text')
  })

  test('should remove comments', async () => {
    // TODO: Need a better test!
    const html = '<!-- We do not need this comment --><h1>Heading 1</h1>'

    const hastTree = await unified()
      .use(rehypeParse, { fragment: true })
      .parse(html)

    const kastTree = await unified().use(hastToKast).run(hastTree)

    const h1 = kastTree.children[0]

    expect(h1.type).toEqual('element')
  })
})
