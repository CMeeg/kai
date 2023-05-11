import { TestContext } from 'vitest'
import * as path from 'node:path'
import * as fs from 'node:fs/promises'

function createFixture(testContext: TestContext) {
  const testDir = testContext.meta.file
    ? path.dirname(testContext.meta.file.filepath)
    : __dirname

  return {
    readHtmlFile: async (fixturePath: string) => {
      const inputPath = path.resolve(testDir, fixturePath)
      const input = await fs.readFile(inputPath, 'utf-8')

      return input.trim()
    },
    readJsonFile: async (fixturePath: string) => {
      const outputPath = path.resolve(testDir, fixturePath)
      const output = await fs.readFile(outputPath, 'utf-8')

      return JSON.parse(output.trim())
    }
  }
}

export { createFixture }
